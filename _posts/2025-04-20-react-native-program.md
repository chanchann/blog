---
layout: post
title: "React Native : 02 Program"
author: "chanchan"
categories: journal
tags: [react native]
image: mountains.jpg
toc: true
---

This tutorial guides you through building a simple to-do list app using **React Native**, **TypeScript**, and **Expo**. We'll cover setup, core concepts, and best practices, with detailed explanations of each knowledge point.

## Prerequisites
- Basic knowledge of JavaScript/TypeScript and React.
- Node.js (v16 or higher) installed.
- Expo CLI installed globally (`npm install -g expo-cli`).
- Expo Go app installed on your mobile device (iOS/Android) for testing.

## Step 1: Setting Up the Project

### Initialize the Expo Project
Run the following command to create a new Expo project with TypeScript:

```bash
npx create-expo-app TodoApp --template typescript
cd TodoApp
```

This command sets up a new React Native project with TypeScript support. The `--template typescript` flag ensures the project includes TypeScript configuration (`tsconfig.json`) and TypeScript files (`.tsx`).

### Project Structure
After initialization, your project will have the following key files:
- **`App.tsx`**: The main entry point of the app.
- **`tsconfig.json`**: TypeScript configuration file.
- **`package.json`**: Lists dependencies and scripts.
- **`app.json`**: Expo configuration file for app metadata (e.g., name, icon).

### Knowledge Point: Why TypeScript?
TypeScript adds static types to JavaScript, catching errors during development (e.g., passing a string to a function expecting a number). In React Native, TypeScript improves code maintainability and reduces runtime errors. For example:

```typescript
interface Task {
  id: string;
  text: string;
}
```

This defines a `Task` type, ensuring all task objects have an `id` and `text` property.

### Knowledge Point: Expo
Expo is a framework that simplifies React Native development by providing:
- A managed workflow (no need to touch native iOS/Android code).
- Tools like Expo Go for instant preview on devices.
- Libraries for common features (e.g., camera, notifications).

## Step 2: Building the Todo App

We'll create a simple to-do list app where users can:
- Add tasks via a text input.
- View tasks in a list.
- Delete tasks by tapping them.

### Install Dependencies
Install additional dependencies for styling and UUID generation:

```bash
npm install @react-native-community/uuid
```

We'll use React Native's built-in components and TypeScript for type safety.

### Replace `App.tsx` with the Following Code
Create the main app logic in `App.tsx`:

```typescript
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import { v4 as uuidv4 } from 'uuid';

// Define the Task interface
interface Task {
  id: string;
  text: string;
}

export default function App() {
  const [taskText, setTaskText] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);

  // Handle adding a new task
  const addTask = () => {
    if (taskText.trim() === '') {
      Alert.alert('Error', 'Task cannot be empty');
      return;
    }
    const newTask: Task = {
      id: uuidv4(),
      text: taskText,
    };
    setTasks([...tasks, newTask]);
    setTaskText('');
  };

  // Handle deleting a task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a task"
          value={taskText}
          onChangeText={setTaskText}
        />
        <Button title="Add Task" onPress={addTask} />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => deleteTask(item.id)}>
            <View style={styles.task}>
              <Text>{item.text}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  task: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
});
```

### Run the App
Start the development server:

```bash
npx expo start
```

Open the Expo Go app on your mobile device, scan the QR code, and the app should load. Alternatively, press `i` for iOS simulator or `a` for Android emulator if you have them set up.

## Step 3: Explanation of Key Concepts

### 1. **React Native Components**
- **`View`**: The basic container, similar to `<div>` in web development.
- **`TextInput`**: Allows users to input text. We use `value` and `onChangeText` to manage its state.
- **`Button`**: A simple button for triggering actions.
- **`FlatList`**: Efficiently renders a scrollable list of items. It uses `data` (array of items), `keyExtractor` (unique key for each item), and `renderItem` (how to render each item).
- **`TouchableOpacity`**: A touchable component that provides feedback (opacity change) when pressed.

**Example**:

```typescript
<TextInput
  style={styles.input}
  placeholder="Enter a task"
  value={taskText}
  onChangeText={setTaskText}
/>
```

This creates a controlled input where `taskText` state drives the input value, and `setTaskText` updates it.

### 2. **TypeScript in React Native**
TypeScript ensures type safety. Key usages in the code:
- **Interface**: The `Task` interface defines the shape of task objects.
- **State Types**: `useState<string>` for `taskText` and `useState<Task[]>` for `tasks` ensure the state has the correct type.
- **Function Parameters**: The `deleteTask` function takes a `string` parameter for the task `id`.

**Example**:

```typescript
const [tasks, setTasks] = useState<Task[]>([]);
```

This ensures `tasks` is always an array of `Task` objects.

### 3. **State Management with Hooks**
We use the `useState` hook to manage:
- `taskText`: The text in the input field.
- `tasks`: The array of tasks.

**Example**:

```typescript
const addTask = () => {
  const newTask: Task = {
    id: uuidv4(),
    text: taskText,
  };
  setTasks([...tasks, newTask]);
};
```

This creates a new task with a unique ID (generated by `uuidv4`) and appends it to the `tasks` array.

### 4. **Styling with StyleSheet**
React Native uses `StyleSheet.create` to define styles, which are applied via the `style` prop. Styles are JavaScript objects with camelCase properties (e.g., `backgroundColor` instead of `background-color`).

**Example**:

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
});
```

- `flex: 1` ensures the container takes up the full screen.
- `padding: 20` adds spacing inside the container.
- `backgroundColor` sets the background color.

### 5. **UUID for Unique Keys**
The `uuid` library generates unique IDs for tasks, which are used as keys in `FlatList`. This is critical for performance and correct rendering.

**Example**:

```typescript
keyExtractor={(item) => item.id}
```

This tells `FlatList` to use the `id` property as the unique key for each task.

### 6. **Event Handling**
- **TextInput**: `onChangeText` updates the `taskText` state.
- **Button**: `onPress` triggers the `addTask` function.
- **TouchableOpacity**: `onPress` triggers the `deleteTask` function.

**Example**:

```typescript
<TouchableOpacity onPress={() => deleteTask(item.id)}>
  <View style={styles.task}>
    <Text>{item.text}</Text>
  </View>
</TouchableOpacity>
```

Tapping a task calls `deleteTask` with the task's `id`.

### 7. **Error Handling**
We use `Alert` to show an error if the user tries to add an empty task.

**Example**:

```typescript
if (taskText.trim() === '') {
  Alert.alert('Error', 'Task cannot be empty');
  return;
}
```

## Step 4: Best Practices
1. **Type Safety**: Always define interfaces for complex data (e.g., `Task`).
2. **Controlled Components**: Use state to control inputs (e.g., `TextInput`).
3. **Modularize Code**: For larger apps, split components into separate files.
4. **Style Consistency**: Use `StyleSheet.create` for reusable styles.
5. **Performance**: Use `FlatList` for lists to optimize rendering.
6. **Error Handling**: Validate user input to prevent crashes.

## Step 5: Extending the App
To enhance the app, consider:
- **Persistence**: Use `@react-native-async-storage/async-storage` to save tasks.
- **Styling**: Add libraries like `react-native-paper` for pre-built components.
- **Navigation**: Use `react-navigation` for multiple screens.
- **TypeScript Advanced**: Add stricter types (e.g., for navigation props).

## Conclusion
This tutorial covered building a to-do list app with React Native, TypeScript, and Expo. You learned how to:
- Set up an Expo project with TypeScript.
- Use React Native components and hooks.
- Apply TypeScript for type safety.
- Style components with `StyleSheet`.
- Handle user interactions and errors.

