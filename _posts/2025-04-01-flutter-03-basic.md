---
layout: post
title: "Flutter 03 : Basics"
author: "chanchan"
categories: journal
tags: [flutter]
image: mountains.jpg
toc: true
---

Flutter is an open-source UI framework developed by Google for building high-performance, cross-platform applications. It's primarily used for mobile development (iOS and Android) but also supports Web, desktop (Windows, macOS, Linux), and embedded devices. Here's a comprehensive and structured explanation of Flutter's core concepts:

## 1. Introduction to Flutter

- **Definition**: Flutter is a UI toolkit that allows developers to build natively compiled applications using a single codebase.
- **Language**: Uses Dart programming language, a modern, object-oriented language supporting both JIT (Just-In-Time) and AOT (Ahead-Of-Time) compilation.
- **Key Features**:
  - **Hot Reload**: Developers can see code changes in real-time, significantly improving development efficiency.
  - **Native Performance**: Achieves near-native performance by compiling directly to machine code (rather than relying on interpreters or bridges).
  - **Custom UI**: Flutter doesn't rely on platform native widgets but renders all UI through its own engine (Skia), providing complete control.
  - **Cross-platform**: One codebase runs on multiple platforms.

## 2. Dart Basics

Since Flutter uses Dart as its programming language, understanding Dart fundamentals is crucial:

- **Variables**: Supports var (type inference), dynamic (dynamic typing), and explicit types (like int, String).
- **Functions**: Supports arrow functions, named parameters, and optional parameters.

```dart
void sayHello(String name) => print("Hello, $name");
```

- **Asynchronous Programming**: Uses Future and async/await for handling asynchronous operations.

```dart
Future<String> fetchData() async {
  await Future.delayed(Duration(seconds: 2));
  return "Data loaded";
}
```

- **Classes and Objects**: Supports object-oriented features like inheritance, interfaces, and mixins.

## 3. Flutter's Core Architecture

- **Widget**: The core concept of Flutter, where everything is a Widget (including UI elements, layouts, logic controls, etc.).
  - **StatelessWidget**: For static content.

```dart
class MyWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Text("Hello, Flutter!");
  }
}
```

  - **StatefulWidget**: For dynamic content.

```dart
class Counter extends StatefulWidget {
  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int count = 0;
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () => setState(() => count++),
      child: Text("Count: $count"),
    );
  }
}
```

- **Widget Tree**: Flutter organizes UI in a tree structure, where parent widgets contain child widgets.
- **Rendering Process**: Flutter renders directly to the screen through the Skia engine, independent of platform native widgets.

## 4. Common Widgets

### Basic Components:
- **Text**: Displays text.
- **Image**: Shows images (supports network, local resources, etc.).
- **Icon**: Displays icons.

### Layout Components:
- **Container**: A container for a single child node, supporting styling (margin, padding, color).
- **Row / Column**: Arranges multiple child nodes horizontally or vertically.
- **Stack**: Stack layout where child nodes can overlap.
- **Expanded / Flexible**: For flexible space allocation.

### Interactive Components:
- **ElevatedButton / TextButton**: Buttons.
- **GestureDetector**: Detects gestures (tap, long press, drag).

### Form Components:
- **TextField**: Text input field.
- **Form**: Form management.

## 5. State Management

Flutter provides various state management solutions, choose based on project complexity:

- **setState**: Basic state management, suitable for simple scenarios.
- **Provider**: Officially recommended, lightweight state management library.

```dart
ChangeNotifierProvider(
  create: (context) => CounterModel(),
  child: Consumer<CounterModel>(
    builder: (context, model, child) => Text("${model.count}"),
  ),
);
```

- **Riverpod**: An enhanced version of Provider with more complex dependency injection support.
- **Bloc**: Stream-based complex state management, suitable for large applications.
- **Redux / MobX**: Other alternative solutions.

## 6. Navigation and Routing

### Basic Navigation:
- **Navigator.push**: Navigate to a new page.
- **Navigator.pop**: Return to the previous page.

```dart
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => SecondPage()),
);
```

### Named Routes: 
Define route table in MaterialApp.

```dart
MaterialApp(
  initialRoute: '/',
  routes: {
    '/': (context) => HomePage(),
    '/second': (context) => SecondPage(),
  },
);
```

### Parameter Passing: 
Pass data through constructors or route parameters.

## 7. Network Requests and Data Processing

- **http package**: For sending HTTP requests.

```dart
import 'package:http/http.dart' as http;

Future<void> fetchData() async {
  var response = await http.get(Uri.parse('https://api.example.com/data'));
  print(response.body);
}
```

- **JSON Parsing**: Use dart:convert to parse JSON data.

```dart
import 'dart:convert';
var data = jsonDecode(response.body);
```

- **Dio**: A more powerful third-party networking library supporting interceptors, file uploads, etc.

## 8. Theming and Styling

### Global Theme:

```dart
MaterialApp(
  theme: ThemeData(
    primaryColor: Colors.blue,
    textTheme: TextTheme(bodyText2: TextStyle(fontSize: 16)),
  ),
  home: MyHomePage(),
);
```

### Local Styling: 
Use style properties or Container decorations (like BoxDecoration).

## 9. Animations

- **Basic Animations**: Use AnimatedContainer, AnimatedOpacity, etc.
- **Custom Animations**:
  - **AnimationController**: Controls animation timing and state.
  - **Tween**: Defines animation start and end values.

```dart
class MyAnimation extends StatefulWidget {
  @override
  _MyAnimationState createState() => _MyAnimationState();
}

class _MyAnimationState extends State<MyAnimation> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    );
    _animation = Tween<double>(begin: 0, end: 200).animate(_controller);
    _controller.forward();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) => Container(
        width: _animation.value,
        height: _animation.value,
        color: Colors.blue,
      ),
    );
  }
}
```

## 10. Debugging and Performance Optimization

- **Debugging Tools**: Flutter DevTools, providing performance analysis, Widget tree inspection, etc.
- **Performance Optimization**:
  - Use const constructors for Widgets to reduce rebuilds.
  - Avoid unnecessary setState calls.
  - Use ListView.builder for long lists.

## 11. App Publishing

### Building APK or IPA:
- **Android**: `flutter build apk --release`
- **iOS**: `flutter build ios --release` (requires macOS).

### Configuration: 
Modify pubspec.yaml (dependency management), app icons, permissions, etc.

## Summary

Flutter's core lies in its Widget system, Dart language, and cross-platform capabilities. By mastering Widget usage, state management, routing, animations, and other key concepts, you can quickly build complex applications. It's recommended to start with the official documentation (flutter.dev) or simple projects and gradually dive deeper.

