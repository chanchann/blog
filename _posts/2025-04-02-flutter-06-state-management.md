---
layout: post
title: "Flutter 06 : State Management"
author: "chanchan"
categories: journal
tags: [flutter]
image: mountains.jpg
toc: true
---

State Management in Flutter is a core topic in development as it directly relates to how data is managed, UI updates are handled, and user interactions are responded to in applications. As a declarative UI framework, the quality of state management significantly impacts code maintainability, scalability, and performance.

---

### 1. What is State?
In Flutter, state refers to any mutable data in an application that affects UI rendering. State can be:
- **Ephemeral State**: Used only within a single Widget, such as the current text in a text field or the on/off state of a switch. This type of state is typically managed using the `setState` method of `StatefulWidget`.
- **App State**: Data that needs to be shared across multiple Widgets or pages, such as user login information, theme settings, shopping cart contents, etc.

The core goal of state management is: **Efficiently update the UI when state changes occur while maintaining clear and understandable code**.

---

### 2. Basic State Management in Flutter: setState
Flutter provides `StatefulWidget` and `setState` as the most fundamental state management tools.

#### Example Code:
```dart
class Counter extends StatefulWidget {
  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $_counter'),
        ElevatedButton(
          onPressed: _incrementCounter,
          child: Text('Add 1'),
        ),
      ],
    );
  }
}
```

#### How it Works:
- Calling `setState` notifies the Flutter framework that the state has changed.
- Flutter re-calls the `build` method to rebuild the affected UI.

#### Use Cases:
- Simple scenarios, such as local state within a single page.
- When state doesn't need to be shared across Widgets.

#### Limitations:
- As the application grows and state needs to be shared across multiple pages or Widgets, `setState` can lead to tightly coupled code that's difficult to maintain.
- Frequent calls to `setState` may trigger unnecessary rebuilds, affecting performance.

---

### 3. Common Flutter State Management Solutions
To address the limitations of `setState`, the community and official team provide various state management solutions. Here are detailed explanations of the mainstream approaches:

#### 3.1 Provider
**Provider** is Flutter's officially recommended state management library, simple to use and based on `InheritedWidget`.

##### Core Concepts:
- **Provider**: Provides data.
- **Consumer**: Consumes data and rebuilds UI when state changes.
- **ChangeNotifier**: A simple class for notifying state changes.

##### Example Code:
```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class Counter with ChangeNotifier {
  int _count = 0;
  int get count => _count;

  void increment() {
    _count++;
    notifyListeners(); // Notify listeners of state change
  }
}

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => Counter(),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Consumer<Counter>(
                builder: (context, counter, child) => Text('Count: ${counter.count}'),
              ),
              ElevatedButton(
                onPressed: () => context.read<Counter>().increment(),
                child: Text('Add 1'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

##### Advantages:
- Simple to learn, suitable for small to medium projects.
- Highly compatible with Flutter's declarative style.
- Supports dependency injection, making testing easier.

##### Limitations:
- Code can become verbose for complex state management (e.g., heavily nested states).
- Not flexible enough for handling asynchronous operations or complex logic.

#### 3.2 Riverpod
**Riverpod** is an upgraded version of Provider, developed by the same author, addressing some of Provider's pain points.

##### Core Concepts:
- **Provider**: Defines state or logic.
- **ConsumerWidget**: Listens to state changes and rebuilds UI.
- Doesn't depend on `BuildContext`, making it more flexible.

##### Example Code:
```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final counterProvider = StateProvider<int>((ref) => 0);

void main() {
  runApp(ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: Column(
            children: [
              Text('Count: $count'),
              ElevatedButton(
                onPressed: () => ref.read(counterProvider.notifier).state++,
                child: Text('Add 1'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

##### Advantages:
- No need for `BuildContext`, can access state anywhere.
- Type-safe, supports complex dependency management.
- Better suited for large projects.

##### Limitations:
- Slightly steeper learning curve.
- May be overly complex for simple projects.

#### 3.3 Bloc / Cubit
**Bloc** (Business Logic Component) is a stream-based state management solution that emphasizes separation of business logic from UI.

##### Core Concepts:
- **Event**: User-triggered actions (e.g., button clicks).
- **State**: Application state.
- **Bloc**: Processes events and outputs state.

##### Example Code:
```dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Events
abstract class CounterEvent {}
class IncrementEvent extends CounterEvent {}

// State
class CounterState {
  final int count;
  CounterState(this.count);
}

// Bloc
class CounterBloc extends Bloc<CounterEvent, CounterState> {
  CounterBloc() : super(CounterState(0)) {
    on<IncrementEvent>((event, emit) => emit(CounterState(state.count + 1)));
  }
}

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: BlocProvider(
        create: (context) => CounterBloc(),
        child: CounterPage(),
      ),
    );
  }
}

class CounterPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          children: [
            BlocBuilder<CounterBloc, CounterState>(
              builder: (context, state) => Text('Count: ${state.count}'),
            ),
            ElevatedButton(
              onPressed: () => context.read<CounterBloc>().add(IncrementEvent()),
              child: Text('Add 1'),
            ),
          ],
        ),
      ),
    );
  }
}
```

##### Advantages:
- Clear logic, suitable for complex applications.
- Supports asynchronous operations (e.g., network requests).
- Strong testability.

##### Limitations:
- More boilerplate code.
- Higher learning curve.

#### 3.4 Redux
**Redux** is a global state management solution originating from the JavaScript community, also ported to Flutter.

##### Core Concepts:
- **Store**: Global state container.
- **Action**: Describes intent to change state.
- **Reducer**: Updates state based on actions.

##### Use Cases:
- When strict state management rules are needed.
- When the team is familiar with the Redux pattern.

##### Limitations:
- Large amount of code, suitable for very large projects.
- Overly complex for small to medium applications.

#### 3.5 GetX
**GetX** is a lightweight yet powerful state management library that emphasizes simplicity and high performance.

##### Example Code:
```dart
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class CounterController extends GetxController {
  var count = 0.obs; // RxInt, reactive variable

  void increment() => count++;
}

void main() {
  runApp(GetMaterialApp(home: CounterPage()));
}

class CounterPage extends StatelessWidget {
  final CounterController controller = Get.put(CounterController());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          children: [
            Obx(() => Text('Count: ${controller.count}')),
            ElevatedButton(
              onPressed: controller.increment,
              child: Text('Add 1'),
            ),
          ],
        ),
      ),
    );
  }
}
```

##### Advantages:
- Simple and intuitive, less code.
- Built-in route management, dependency injection, and other features.
- High performance.

##### Limitations:
- Not very "Flutter-native", controversial in the community.
- Overly simplified syntax might hide potential issues.

---

### 4. How to Choose a State Management Solution?
When selecting a state management solution, consider the following factors:
- **Project Size**:
  - Small: `setState` or `Provider`.
  - Medium: `Provider`, `Riverpod`, or `GetX`.
  - Large: `Bloc`, `Riverpod`, or `Redux`.
- **Team Experience**:
  - Familiar with Dart/Flutter: `Provider` or `Riverpod`.
  - Familiar with reactive programming: `Bloc`.
  - Familiar with JavaScript/Redux: `Redux`.
- **Complexity**:
  - Simple UI updates: `setState` or `GetX`.
  - Complex business logic: `Bloc` or `Riverpod`.

---

### 5. Best Practices
- **Minimize Rebuilds**: Update UI only when necessary, avoid unnecessary rebuilds.
- **Separate Logic from UI**: Keep business logic in the state management layer, keeping the Widget layer clean.
- **Handle Asynchronous Operations**: Use `Future` or `Stream` for handling network requests and other asynchronous operations.
- **Debugging Tools**: Utilize DevTools or state management library-specific tools (like Redux DevTools) for debugging state.

---

### 6. Summary
There is no "one-size-fits-all" best solution for state management in Flutter. Instead, choose the appropriate tool based on specific needs. `setState` is suitable for simple scenarios, `Provider` and `Riverpod` are officially recommended general choices, `Bloc` is good for complex logic, and `GetX` pursues an extremely simple development experience. It's recommended to start learning with `Provider` and gradually explore other solutions to find the pattern that best suits your project.
