---
layout: post
title: "Flutter 11 : Riverpod"
author: "chanchan"
categories: journal
tags: [flutter]
image: mountains.jpg
toc: true
---

`flutter_riverpod` is a very popular state management library in the Flutter ecosystem, developed by Remi Rousselet. It is an enhanced version of the `provider` package, designed to provide a simpler and more flexible state management solution while addressing some limitations of `provider`. The core goal of `flutter_riverpod` is to allow developers to easily manage application state while maintaining code maintainability and testability.

Below is a detailed explanation of the knowledge points for `flutter_riverpod/flutter_riverpod.dart`:

---

### 1. **What is Riverpod?**
Riverpod is an acronym for "**R**eactive **I**mmutable **V**alue **E**xposed **D**eclaratively with **O**bservable **P**roviders". It is based on several core principles:
- **Declarative**: States and dependencies are defined in a declarative way.
- **Immutable**: States are typically immutable, encouraging the use of pure functions and immutable data structures.
- **Observer Pattern**: UI automatically updates by observing state changes.
- **Context Independent**: Unlike `provider`, Riverpod does not depend on Flutter's `BuildContext`, making it more flexible and usable outside the widget tree.

The core library of Riverpod is `flutter_riverpod`, which provides integration with the UI for Flutter applications.

---

### 2. **Installation and Import**
To use `flutter_riverpod` in your project, add the dependency in `pubspec.yaml`:

```yaml
dependencies:
  flutter_riverpod: ^2.4.0  # Use the latest version
```

Then import it in your code:

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
```

---

### 3. **Core Concepts**
The core of Riverpod is to manage state and dependencies through "**Providers**". Here are several key concepts:

#### (1) **Provider**
`Provider` is the basic building block of Riverpod, used to expose a value (which can be a state, object, or computation result). It is a read-only provider, suitable for simple dependency injection.

```dart
final myProvider = Provider((ref) => 'Hello, Riverpod!');
```

When using it:
```dart
class MyWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final message = ref.watch(myProvider);
    return Text(message); // Outputs "Hello, Riverpod!"
  }
}
```

#### (2) **StateProvider**
`StateProvider` is used to manage simple, mutable states. It is suitable for values that need to be manually updated.

```dart
final counterProvider = StateProvider((ref) => 0);
```

Usage and updating:
```dart
class CounterWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final counter = ref.watch(counterProvider);
    return Column(
      children: [
        Text('Counter: $counter'),
        ElevatedButton(
          onPressed: () => ref.read(counterProvider.notifier).state++,
          child: Text('Increment'),
        ),
      ],
    );
  }
}
```

#### (3) **StateNotifierProvider**
`StateNotifierProvider` combines with `StateNotifier` to manage more complex state logic. It allows you to define a class to handle state updates.

```dart
class CounterNotifier extends StateNotifier<int> {
  CounterNotifier() : super(0);

  void increment() => state++;
}

final counterProvider = StateNotifierProvider<CounterNotifier, int>((ref) => CounterNotifier());
```

Usage:
```dart
class CounterWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final counter = ref.watch(counterProvider);
    return Column(
      children: [
        Text('Counter: $counter'),
        ElevatedButton(
          onPressed: () => ref.read(counterProvider.notifier).increment(),
          child: Text('Increment'),
        ),
      ],
    );
  }
}
```

#### (4) **FutureProvider**
`FutureProvider` is used to handle asynchronous operations, such as loading data from the network.

```dart
final fetchDataProvider = FutureProvider<String>((ref) async {
  await Future.delayed(Duration(seconds: 2)); // Simulate network delay
  return 'Data loaded!';
});
```

Usage:
```dart
class DataWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncData = ref.watch(fetchDataProvider);
    return asyncData.when(
      data: (data) => Text(data),
      loading: () => CircularProgressIndicator(),
      error: (error, stack) => Text('Error: $error'),
    );
  }
}
```

#### (5) **StreamProvider**
`StreamProvider` is used to handle stream data, such as WebSockets or real-time updates.

```dart
final streamProvider = StreamProvider<int>((ref) {
  return Stream.periodic(Duration(seconds: 1), (count) => count);
});
```

Usage:
```dart
class StreamWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final streamData = ref.watch(streamProvider);
    return streamData.when(
      data: (value) => Text('Stream value: $value'),
      loading: () => CircularProgressIndicator(),
      error: (error, stack) => Text('Error: $error'),
    );
  }
}
```

---

### 4. **How to Integrate Riverpod in Applications**
To make Riverpod available throughout the application, wrap the root widget with `ProviderScope`:

```dart
void main() {
  runApp(ProviderScope(child: MyApp()));
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: MyHomePage(),
    );
  }
}
```

---

### 5. **ConsumerWidget and ref**
Riverpod provides `ConsumerWidget`, a convenient base class for accessing `WidgetRef` and listening to state changes. `ref` is the core object of Riverpod, used to read and listen to providers.

- `ref.watch(provider)`: Listens to the provider's value and rebuilds the widget when the value changes.
- `ref.read(provider)`: Reads the provider's value without listening (commonly used in event handling).
- `ref.listen(provider, callback)`: Manually listens to changes in the provider.

---

### 6. **Dependency Management and Communication Between Providers**
Riverpod supports dependencies between providers. For example, one provider can depend on the value of another provider:

```dart
final baseProvider = Provider((ref) => 10);
final derivedProvider = Provider((ref) {
  final baseValue = ref.watch(baseProvider);
  return baseValue * 2;
});
```

---

### 7. **Advanced Features**
- **Family Providers**: Allow creating providers with parameters.
  ```dart
  final userProvider = Provider.family<String, int>((ref, userId) => 'User $userId');
  ```
  Usage: `ref.watch(userProvider(123))`.

- **AutoDispose**: Automatically cleans up providers that are no longer in use.
  ```dart
  final autoDisposeProvider = Provider.autoDispose((ref) => 'Temporary value');
  ```

- **Modifiers**: Such as `.name` (for debugging), `.overrideWith` (for testing).

---

### 8. **Advantages and Limitations**
#### Advantages:
- Does not depend on `BuildContext`, can be used anywhere.
- Type-safe, supports Dart's strong typing system.
- Easy to test (through `ProviderContainer`).
- Supports complex asynchronous and stream-based state management.

#### Limitations:
- Steeper learning curve, especially for beginners.
- Requires more boilerplate code to handle complex logic.

---

### 9. **Practical Application Example**
Suppose you want to build a simple counter application:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Define state
final counterProvider = StateNotifierProvider<CounterNotifier, int>((ref) => CounterNotifier());

class CounterNotifier extends StateNotifier<int> {
  CounterNotifier() : super(0);
  void increment() => state++;
  void decrement() => state--;
}

void main() {
  runApp(ProviderScope(child: MyApp()));
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(home: CounterPage());
  }
}

class CounterPage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    return Scaffold(
      appBar: AppBar(title: Text('Riverpod Counter')),
      body: Center(
        child: Text('Count: $count', style: TextStyle(fontSize: 24)),
      ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            onPressed: () => ref.read(counterProvider.notifier).increment(),
            child: Icon(Icons.add),
          ),
          SizedBox(height: 10),
          FloatingActionButton(
            onPressed: () => ref.read(counterProvider.notifier).decrement(),
            child: Icon(Icons.remove),
          ),
        ],
      ),
    );
  }
}
```

---

### 10. **Summary**
`flutter_riverpod` is a powerful and flexible state management tool suitable for all scenarios from simple to complex. It meets the needs of modern Flutter applications through the diversity of providers (`Provider`, `StateProvider`, `StateNotifierProvider`, etc.) and support for asynchronous and streams. If you are already familiar with basic Flutter concepts, learning Riverpod will significantly improve your development efficiency and code quality.

