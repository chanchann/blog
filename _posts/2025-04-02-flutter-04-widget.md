---
layout: post
title: "Flutter 04 : Widget"
author: "chanchan"
categories: journal
tags: [flutter]
image: mountains.jpg
toc: true
---

Flutter, developed by Google, is an open-source UI framework where the Widget system is one of its core features. In Flutter, widgets are the basic building blocks for user interfaces - almost everything (layouts, buttons, text, animations, etc.) is a widget. 

---

### 1. **What is a Widget?**
In Flutter, a Widget is an immutable descriptive object used to define a part of the UI. Widgets are declarative - you describe the interface by combining different widgets rather than directly manipulating the underlying drawing logic. Flutter's core philosophy is "Everything is a Widget."

- **Immutability**: Once created, a widget's properties cannot be changed. To update the UI, you must rebuild a new widget tree through state management.
- **Tree Structure**: Widgets form a tree structure where parent widgets contain child widgets, ultimately forming a complete interface.

---

### 2. **Widget Classification**
Flutter widgets can be divided into several categories, each with different purposes:

#### (1) **Basic Widgets**
These are the fundamental components for building UIs:
- **Text**: Displays text with customizable styles.
- **Image**: Displays images from various sources (network, local, etc.).
- **Icon**: Displays icons, often used with Material Design icon library.
- **Container**: A versatile container widget that can set padding, margin, background color, borders, etc.

#### (2) **Layout Widgets**
Used to organize and arrange other widgets:
- **Row and Column**: Arrange child widgets horizontally or vertically.
- **Stack**: Layered layout where child widgets can overlap.
- **Expanded and Flexible**: Control how child widgets expand within a Row or Column.
- **Padding**: Add internal padding to a child widget.
- **SizedBox**: Force specific width, height, or spacing.

#### (3) **Interactive Widgets**
Handle user input and interaction:
- **GestureDetector**: Detect gestures (tap, long press, drag, etc.).
- **ElevatedButton, TextButton, IconButton**: Different styles of buttons.
- **TextField**: Input field for text entry.

#### (4) **State Management Widgets**
Used in conjunction with state management:
- **StatelessWidget**: Stateless widget suitable for static content.
- **StatefulWidget**: Stateful widget suitable for dynamic content, used with a `State` class.

#### (5) **Material and Cupertino Widgets**
Flutter provides widgets in two design styles:
- **Material Design**: Google's design language, e.g., `Scaffold`, `AppBar`, `FloatingActionButton`.
- **Cupertino**: Apple's design style, e.g., `CupertinoButton`, `CupertinoAlertDialog`.

#### (6) **Advanced Widgets**
Provide complex functionality:
- **ListView**: Scrollable list.
- **GridView**: Grid layout.
- **FutureBuilder and StreamBuilder**: Handle asynchronous data and update the UI.

---

### 3. **StatelessWidget vs StatefulWidget**
Flutter widgets are divided into stateless and stateful types:

#### (1) **StatelessWidget**
- **Characteristics**: No internal state; content is entirely determined by passed parameters.
- **Use Cases**: Static pages or UIs that don't change with user interaction.
- **Example**:
  ```dart
  class MyText extends StatelessWidget {
    final String text;

    const MyText(this.text);

    @override
    Widget build(BuildContext context) {
      return Text(text);
    }
  }
  ```

#### (2) **StatefulWidget**
- **Characteristics**: Has state that can be updated via `setState`.
- **Use Cases**: Interfaces that need dynamic updates, such as counters and forms.
- **Example**:
  ```dart
  class Counter extends StatefulWidget {
    @override
    _CounterState createState() => _CounterState();
  }

  class _CounterState extends State<Counter> {
    int count = 0;

    @override
    Widget build(BuildContext context) {
      return Column(
        children: [
          Text('Count: $count'),
          ElevatedButton(
            onPressed: () => setState(() => count++),
            child: Text('Add'),
          ),
        ],
      );
    }
  }
  ```

---

### 4. **Widget Lifecycle**
Understanding the widget lifecycle is crucial for development, especially for StatefulWidgets.

#### (1) **StatelessWidget Lifecycle**
- Only has the `build` method, called directly after creation.

#### (2) **StatefulWidget Lifecycle**
- **createState**: Creates the State object.
- **initState**: Initializes the state, called only once.
- **didChangeDependencies**: Called when dependencies change.
- **build**: Builds the widget tree, called every time the state updates.
- **setState**: Triggers state updates, causing `build` to be called again.
- **deactivate**: Called when the widget is removed from the tree.
- **dispose**: Called when the widget is permanently removed, used for cleanup.

---

### 5. **Common Layout Techniques**
Flutter's layout is very flexible. Here are some practical techniques:
- **Nested Layouts**: Combine Row, Column, and Container for complex layouts.
- **Constraint Passing**: Flutter uses a parent-to-child constraint mechanism where parent widgets determine the size of child widgets.
- **Spacer**: Fill remaining space in a Row or Column.
- **SafeArea**: Prevent content from being obscured by screen edges (like notches).

---

### 6. **Widget Performance Optimization**
- **const Constructor**: Use `const` for unchanging widgets to reduce rebuilding overhead.
  ```dart
  const Text('Hello World')
  ```
- **Keys**: Use `Key` in dynamic lists to ensure correct widget reuse.
- **Avoid Excessive Nesting**: Overly deep widget trees affect performance; simplify when possible.

---

### 7. **Custom Widgets**
You can create your own widgets to reuse code:
- **Extract Components**: Encapsulate repeated UI parts into independent widgets.
- **Parameterization**: Make custom widgets more flexible by passing parameters through constructors.
- **Example**:
  ```dart
  class CustomCard extends StatelessWidget {
    final String title;
    final VoidCallback onTap;

    const CustomCard({required this.title, required this.onTap});

    @override
    Widget build(BuildContext context) {
      return GestureDetector(
        onTap: onTap,
        child: Container(
          padding: EdgeInsets.all(16),
          color: Colors.blue,
          child: Text(title),
        ),
      );
    }
  }
  ```

---

### 8. **Debugging Widgets**
- **DevTools**: Flutter provides DevTools for viewing the widget tree, performance, and more.
- **print**: Print logs in the `build` method to check the building process.
- **Widget Inspector**: Enable in the IDE to inspect widget hierarchy and properties.

---

### Summary
Flutter's widget system is the core of its power and flexibility. By understanding widget categories, lifecycles, and layout techniques, you can easily build complex UIs. Start with simple StatelessWidgets, gradually master StatefulWidgets and state management (e.g., Provider, BLoC), and you'll develop Flutter applications more efficiently.
