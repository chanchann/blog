---
layout: post
title: "Flutter 10 : material"
author: "chanchan"
categories: journal
tags: [flutter]
image: mountains.jpg
toc: true
---

Let’s dive into the key knowledge points about `flutter/material.dart`, which is a fundamental part of building Flutter applications. This library provides the Material Design widgets and tools that allow you to create visually appealing, structured, and responsive user interfaces in Flutter. I'll break it down step-by-step so you can understand its components, usage, and significance.

---

### What is `flutter/material.dart`?
`flutter/material.dart` is a Dart library in the Flutter framework that implements Material Design, a design system created by Google. It provides a rich set of pre-built widgets that follow Material Design guidelines, such as buttons, text fields, app bars, dialogs, and more. When you import this library into your Flutter project with:

```dart
import 'package:flutter/material.dart';
```

You gain access to a wide variety of widgets and utilities to build apps with a consistent look and feel, adhering to Material Design principles like elevation, shadows, animations, and typography.

---

### Core Components of `flutter/material.dart`

#### 1. **MaterialApp**
The `MaterialApp` widget is typically the root of a Flutter application when using Material Design. It sets up the app’s structure and provides navigation, theming, and other app-wide configurations.

- **Key Properties**:
  - `title`: Sets the app’s title (e.g., for the taskbar or app switcher).
  - `theme`: Defines the app’s visual theme (e.g., colors, typography) using `ThemeData`.
  - `home`: Specifies the default screen (a widget like `Scaffold`) when the app starts.
  - `routes`: Defines navigation routes for the app.

Example:
```dart
void main() {
  runApp(MaterialApp(
    title: 'My App',
    theme: ThemeData(primarySwatch: Colors.blue),
    home: MyHomePage(),
  ));
}
```

#### 2. **Scaffold**
The `Scaffold` widget is a layout structure that implements the basic Material Design visual layout. It provides slots for common UI elements like an app bar, body, floating action button, drawer, and more.

- **Key Properties**:
  - `appBar`: Adds a top bar (usually an `AppBar` widget).
  - `body`: The main content area of the screen.
  - `floatingActionButton`: A button that “floats” above the content (e.g., a “+” button).
  - `drawer`: A slide-in menu from the side.

Example:
```dart
Scaffold(
  appBar: AppBar(title: Text('Home')),
  body: Center(child: Text('Hello, Flutter!')),
  floatingActionButton: FloatingActionButton(
    onPressed: () {},
    child: Icon(Icons.add),
  ),
)
```

#### 3. **Widgets**
The `material.dart` library includes a vast collection of widgets. Here are some of the most commonly used ones:

- **Text**: Displays styled text.
  - Example: `Text('Hello', style: TextStyle(fontSize: 20))`
- **ElevatedButton**: A raised button with Material Design styling.
  - Example: `ElevatedButton(onPressed: () {}, child: Text('Click Me'))`
- **TextField**: An input field for user text entry.
  - Example: `TextField(decoration: InputDecoration(labelText: 'Enter text'))`
- **Icon**: Displays Material icons.
  - Example: `Icon(Icons.star)`
- **Card**: A Material Design card with elevation and rounded corners.
  - Example: `Card(child: Text('This is a card'))`
- **ListTile**: A row with optional leading/trailing icons and text, often used in lists.
  - Example: `ListTile(title: Text('Item'), leading: Icon(Icons.check))`

#### 4. **ThemeData**
The `ThemeData` class allows you to define the app’s visual style, such as colors, fonts, and shapes. You can set it globally in `MaterialApp` or locally using `Theme`.

- **Key Properties**:
  - `primarySwatch`: Sets the primary color palette (e.g., `Colors.blue`).
  - `textTheme`: Customizes text styles (e.g., headlines, body text).
  - `buttonTheme`: Configures button styles.

Example:
```dart
ThemeData(
  primarySwatch: Colors.green,
  textTheme: TextTheme(bodyText2: TextStyle(fontSize: 16)),
)
```

#### 5. **Navigation**
Material Design supports navigation through widgets like `Navigator`, often used with `MaterialApp`’s `routes` or `push`/`pop` methods.

- Example of pushing a new screen:
```dart
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => SecondScreen()),
);
```

---

### Key Concepts in `flutter/material.dart`

#### 1. **Stateless vs. Stateful Widgets**
- **StatelessWidget**: Used for static UI that doesn’t change (e.g., a simple button or text).
  - Example: A basic screen with a `Text` widget.
- **StatefulWidget**: Used for dynamic UI that changes over time (e.g., a counter).
  - Example: A button that updates a number when pressed.

#### 2. **BuildContext**
Every widget has a `BuildContext`, which provides information about its location in the widget tree. It’s commonly used for navigation, theming, or accessing inherited widgets.

#### 3. **Material Design Principles**
- **Elevation**: Widgets like `Card` and `ElevatedButton` have shadows to indicate depth.
- **InkWell**: Adds ripple effects on taps (e.g., used in buttons or custom tappable areas).
- **Animation**: Many widgets (e.g., `FloatingActionButton`) come with built-in animations.

---

### Practical Example
Here’s a simple app combining several `material.dart` components:

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Home')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Welcome to Flutter!', style: TextStyle(fontSize: 24)),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Button Pressed!')),
                );
              },
              child: Text('Press Me'),
            ),
          ],
        ),
      ),
    );
  }
}
```

This code creates an app with an app bar, centered text, and a button that shows a snackbar when pressed.

---

### Additional Features
- **Dialogs**: Use `showDialog` with `AlertDialog` for pop-ups.
  - Example: `showDialog(context: context, builder: (context) => AlertDialog(title: Text('Hi')))`
- **SnackBar**: Displays temporary messages at the bottom of the screen.
  - Example: `ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Hello')))`
- **BottomNavigationBar**: Adds a navigation bar at the bottom of the screen.

---

### Why Use `flutter/material.dart`?
- **Consistency**: Ensures your app follows a widely recognized design system.
- **Productivity**: Pre-built widgets save time compared to building everything from scratch.
- **Customization**: Highly flexible with themes and widget properties.

---

In summary, `flutter/material.dart` is the backbone of Material Design in Flutter, providing a robust toolkit for building modern, responsive, and visually appealing apps. Whether you're creating a simple button or a complex navigation system, this library has you covered.