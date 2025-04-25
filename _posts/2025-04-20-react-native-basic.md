---
layout: post
title: "React Native : 01 Basic"
author: "chanchan"
categories: journal
tags: [react native]
image: mountains.jpg
toc: true
---

React Native is an open-source framework developed by Facebook for building mobile applications using **JavaScript** and **React**. It allows developers to create **cross-platform** apps (iOS and Android) with a single codebase while delivering near-native performance.

- **Key Advantage**: Write once, run on both iOS and Android, with reusable components.
- **Native Integration**: Uses native components (e.g., UIView for iOS, View for Android) under the hood, unlike hybrid frameworks like Cordova.

---

### 2. **Core Concepts**

#### a. **React Fundamentals**
React Native is built on **React**, so understanding React is crucial:
- **Components**: The building blocks of the UI. React Native uses both **functional** and **class-based** components.

  ```jsx
  import React from 'react';
  import { Text, View } from 'react-native';

  const App = () => (
    <View>
      <Text>Hello, React Native!</Text>
    </View>
  );
  export default App;
  ```

- **JSX**: A syntax extension for JavaScript to describe UI elements.
- **Props**: Pass data to components to make them dynamic.

  ```jsx
  const Greeting = ({ name }) => <Text>Hello, {name}!</Text>;
  ```

- **State**: Manages dynamic data within a component using hooks like `useState`.

  ```jsx
  import React, { useState } from 'react';
  const Counter = () => {
    const [count, setCount] = useState(0);
    return <Text onPress={() => setCount(count + 1)}>{count}</Text>;
  };
  ```

#### b. **React Native-Specific Components**
Unlike React for web (which uses HTML tags like `<div>`), React Native provides **platform-specific components**:
- **View**: A container component, equivalent to `<div>` or a native `UIView`/`android.view`.
- **Text**: Displays text, replacing `<p>` or `<span>`.
- **Image**: Handles image rendering.
- **TextInput**: For user input fields.
- **ScrollView**: Enables scrolling content.
- **FlatList**: Optimized for rendering long lists of data.

Example of a simple UI:

```jsx
import { View, Text, Image, FlatList } from 'react-native';

const data = [{ id: '1', title: 'Item 1' }, { id: '2', title: 'Item 2' }];

const App = () => (
  <View>
    <Image source={{ uri: 'https://example.com/image.jpg' }} style={{ width: 100, height: 100 }} />
    <FlatList
      data={data}
      renderItem={({ item }) => <Text>{item.title}</Text>}
      keyExtractor={item => item.id}
    />
  </View>
);
```

#### c. **Styling in React Native**
Styling is done using JavaScript objects, not CSS, via the `style` prop:
- Uses **camelCase** properties (e.g., `backgroundColor` instead of `background-color`).
- Supports **Flexbox** for layout.
- No cascading styles (like CSS); styles are scoped to components.
- **StyleSheet** API is recommended for performance.

  ```jsx
  import { StyleSheet, Text, View } from 'react-native';

  const App = () => (
    <View style={styles.container}>
      <Text style={styles.text}>Styled Text</Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 18,
      color: 'blue',
    },
  });
  ```

#### d. **Navigation**
React Native doesn’t have a built-in navigation system, so libraries like **React Navigation** or **React Native Navigation** are used:
- **Stack Navigator**: For screen transitions (like a stack of cards).
- **Tab Navigator**: For bottom/top tabs.
- **Drawer Navigator**: For side menus.

Example with React Navigation:

```jsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
```

#### e. **State Management**
For complex apps, state management libraries are used:
- **React Hooks**: `useState` and `useReducer` for local state.
- **Context API**: For global state without prop drilling.
- **Third-Party Libraries**: Redux, MobX, or Zustand for advanced state management.
Example with Context:

```jsx
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

const App = () => {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ChildComponent />
    </ThemeContext.Provider>
  );
};

const ChildComponent = () => {
  const { theme } = useContext(ThemeContext);
  return <Text>Current theme: {theme}</Text>;
};
```

---

### 3. **Architecture**

#### a. **JavaScript and Native Bridge**
React Native operates via a **bridge** that connects JavaScript code (running in a JS engine like JSC or Hermes) with native code:
- **JavaScript Thread**: Runs the app’s logic, React components, and state updates.
- **Native Thread**: Handles rendering of native UI components and platform APIs.
- **Bridge**: Serializes data (JSON) to communicate between JS and native sides, which can be a performance bottleneck for heavy computations.

#### b. **Hermes Engine**
Hermes is an optimized JavaScript engine for React Native:
- Reduces app startup time and memory usage.
- Enabled by default in newer React Native versions.

#### c. **Metro Bundler**
Metro is the JavaScript bundler for React Native:
- Bundles JS code and assets into a single file.
- Supports hot reloading for faster development.

---

### 4. **Platform-Specific Code**
To handle differences between iOS and Android:
- **File Extensions**: Use `.ios.js` or `.android.js` for platform-specific files.
- **Platform Module**:

  ```jsx
  import { Platform } from 'react-native';

  const styles = {
    container: {
      paddingTop: Platform.OS === 'ios' ? 20 : 0,
    },
  };
  ```

- **Native Modules**: Write custom native code (Swift/Objective-C for iOS, Kotlin/Java for Android) for features unavailable in React Native.

---

### 5. **Networking**
React Native uses the **Fetch API** or libraries like **Axios** for HTTP requests:

```jsx
import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(setData);
  }, []);

  return <Text>{data ? data.title : 'Loading...'}</Text>;
};
```

---

### 6. **Performance Optimization**
- **Use FlatList for Lists**: Avoid `ScrollView` for large datasets.
- **Memoization**: Use `React.memo`, `useMemo`, and `useCallback` to prevent unnecessary renders.
- **Avoid Frequent Bridge Calls**: Minimize passing large data over the bridge.
- **Image Optimization**: Use compressed images and `Image.prefetch`.
- **Hermes**: Enable Hermes for better JS performance.

---

### 7. **Debugging and Tools**
- **React Developer Tools**: Inspect component hierarchy and props.
- **Flipper**: A debugging tool for React Native (network, logs, etc.).
- **Remote Debugging**: Use Chrome DevTools for JS debugging.
- **LogBox**: Handles warnings and errors in the app.

---

### 8. **Common Libraries**
- **React Navigation**: For routing.
- **Redux/Zustand**: For state management.
- **React Native Elements**: UI component library.
- **Lottie**: For animations.
- **Firebase**: For backend services (auth, database, push notifications).

---

### 9. **Building and Deployment**
- **iOS**:
  - Requires Xcode.
  - Configure `Info.plist` and signing certificates.
  - Build via `npx react-native run-ios` or Xcode.
- **Android**:
  - Requires Android Studio.
  - Configure `build.gradle` and signing keys.
  - Build via `npx react-native run-android` or Android Studio.
- **Distribution**:
  - iOS: App Store via App Store Connect.
  - Android: Google Play Store or APK distribution.

---

### 10. **New Architecture (Fabric and Turbo Modules)**
React Native is transitioning to a **new architecture** (introduced in v0.68+):
- **Fabric**: A new rendering system for better performance and concurrency.
- **Turbo Modules**: Faster native module access without the bridge.
- **JSI (JavaScript Interface)**: Direct interaction between JS and native code.
These are opt-in for now but will become default in future versions.

---

### 11. **Limitations**
- **Performance**: Not as fast as fully native apps for complex animations or heavy computations.
- **Native Dependencies**: Requires native knowledge for custom modules.
- **Platform Differences**: Some features require platform-specific handling.
- **Bridge Bottleneck**: Heavy data transfers can slow down the app.

---

### 12. **Learning Path**
1. Master **React** (components, hooks, state).
2. Learn React Native components and styling.
3. Explore navigation (React Navigation).
4. Dive into state management.
5. Experiment with native modules and debugging.
6. Study performance optimization and new architecture.

