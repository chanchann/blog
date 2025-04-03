---
layout: post
title: "Flutter 07 : Navigation and Routing"
author: "chanchan"
categories: journal
tags: [flutter]
image: mountains.jpg
toc: true
---

In Flutter, **Navigation** refers to managing transitions between pages (or screens) in an application, while **Routing** is the specific mechanism that implements navigation. Flutter uses **Route** objects to represent pages and **Navigator** to manage a stack of these pages, enabling operations like page transitions and returns.

Flutter's navigation system is highly flexible, supporting both simple page transitions and complex routing management (such as named routes, dynamic routes, parameter passing, etc.).

---

### 2. Core Components of Flutter Navigation
Flutter's navigation primarily relies on these core components:
- **Navigator**: A Widget that manages the route stack, responsible for page transitions and returns.
- **Route**: Represents a page, typically implemented by `MaterialPageRoute` or `CupertinoPageRoute`.
- **MaterialPageRoute**: Page transition animations based on Material Design (Android style).
- **CupertinoPageRoute**: Page transition animations based on iOS style.

---

### 3. Basic Navigation Operations
#### 3.1 Navigating to a New Page (Push)
To navigate to a new page, use the `Navigator.push()` method. Here's a simple example:

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: FirstScreen(),
    );
  }
}

class FirstScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('First Screen')),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            // Navigate to SecondScreen
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => SecondScreen()),
            );
          },
          child: Text('Go to Second Screen'),
        ),
      ),
    );
  }
}

class SecondScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Second Screen')),
      body: Center(child: Text('Welcome to Second Screen!')),
    );
  }
}
```

**Explanation**:
- `Navigator.push()` pushes a new page onto the top of the stack.
- `MaterialPageRoute` creates a new page with default transition animations.

#### 3.2 Returning to Previous Page (Pop)
To return to the previous page, use `Navigator.pop()`:

```dart
ElevatedButton(
  onPressed: () {
    Navigator.pop(context); // Return to previous page
  },
  child: Text('Go Back'),
)
```

**Note**: If there's only one page in the stack, calling `pop()` will have no effect.

#### 3.3 Returning with Data
You can pass data back to the previous page when returning:

```dart
// Return with data in SecondScreen
ElevatedButton(
  onPressed: () {
    Navigator.pop(context, 'Hello from Second Screen!');
  },
  child: Text('Return with Data'),
)

// Receive data in FirstScreen
ElevatedButton(
  onPressed: () async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => SecondScreen()),
    );
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(result ?? 'No data')));
  },
  child: Text('Go to Second Screen'),
)
```

**Explanation**:
- `Navigator.pop(context, result)` returns with data.
- `await Navigator.push()` can wait for the return result.

---

### 4. Named Routes
For larger applications, manually calling `push` and `pop` might not be flexible enough. Flutter supports **Named Routes**, which manage pages through predefined route tables.

#### 4.1 Configuring Named Routes
Define the route table in `MaterialApp`:

```dart
MaterialApp(
  initialRoute: '/home', // Initial route
  routes: {
    '/home': (context) => FirstScreen(),
    '/second': (context) => SecondScreen(),
  },
)
```

#### 4.2 Using Named Routes for Navigation
```dart
Navigator.pushNamed(context, '/second');
```

#### 4.3 Named Routes with Parameters
You can pass parameters using `arguments`:

```dart
// Navigate and pass parameters
Navigator.pushNamed(
  context,
  '/second',
  arguments: 'Hello from First Screen',
);

// Receive parameters in SecondScreen
class SecondScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final String message = ModalRoute.of(context)!.settings.arguments as String;
    return Scaffold(
      appBar: AppBar(title: Text('Second Screen')),
      body: Center(child: Text(message)),
    );
  }
}
```

---

### 5. Advanced Navigation
#### 5.1 Replacing Pages (PushReplacement)
If you don't want to keep the current page but replace it, use `pushReplacement`:

```dart
Navigator.pushReplacement(
  context,
  MaterialPageRoute(builder: (context) => SecondScreen()),
);
```

#### 5.2 Navigate and Clear Stack (PushAndRemoveUntil)
Navigate to a new page and remove all previous pages:

```dart
Navigator.pushAndRemoveUntil(
  context,
  MaterialPageRoute(builder: (context) => SecondScreen()),
  (Route<dynamic> route) => false, // Clear entire stack
);
```

#### 5.3 Return to a Specific Page
Use `popUntil` to return to a specific page in the stack:

```dart
Navigator.popUntil(context, (route) => route.isFirst); // Return to first page
```

---

### 6. Navigator 2.0 (Advanced Route Management)
Flutter provides **Navigator 2.0**, a more powerful declarative navigation system suitable for complex scenarios (like web applications, deep linking). It's implemented through `Router` and `RouteInformationParser`, but it's relatively complex and best suited for applications requiring dynamic route management.

Simple example:
```dart
MaterialApp.router(
  routerDelegate: MyRouterDelegate(),
  routeInformationParser: MyRouteInformationParser(),
)
```

Since Navigator 2.0 is more complex, it's recommended for beginners to first master basic navigation and named routes.

---

### 7. Important Notes
- **Context**: Navigation operations require `BuildContext`, ensure it's called within the Widget tree.
- **Custom Animations**: You can modify page transition animations by customizing `PageRouteBuilder`.
- **State Management**: Navigation might require integration with state management tools (like Provider, Riverpod) for data passing.

---

### 8. Summary
- **Basic Navigation**: `push` and `pop` are suitable for simple scenarios.
- **Named Routes**: Ideal for medium to large applications, providing clear management.
- **Advanced Navigation**: `pushReplacement`, `pushAndRemoveUntil` meet specific requirements.
- **Navigator 2.0**: Provides declarative routing for complex applications.
