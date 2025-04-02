---
layout: post
title: "Dart Basics"
author: "chanchan"
categories: journal
tags: [dart,flutter]
image: mountains.jpg
toc: true
---

Dart is a modern programming language developed by Google, initially designed for Flutter (a cross-platform UI framework), but it can also be used for web development, server-side development, and even command-line tools. Dart's design goals include simplicity, efficiency, and suitability for building user interfaces. Let's explore the core concepts of Dart in detail:

## 1. Dart Fundamentals

### (1) Syntax Features

- **Strong typing with type inference**: Dart is a strongly typed language but supports type inference using var, final, or const.

```dart
var name = "Alice"; // Inferred as String
final age = 25;     // Inferred as int, immutable
const pi = 3.14;    // Compile-time constant
```

- **Object-oriented**: Dart supports classes, interfaces, mixins, and other OOP features.
- **Asynchronous programming**: Supports async operations using async and await, similar to JavaScript.

### (2) Entry Point

The entry point of a Dart program is the main() function:

```dart
void main() {
  print("Hello, Dart!");
}
```

### (3) Comments

Dart supports single-line, multi-line, and documentation comments:

```dart
// Single-line comment
/*
  Multi-line comment
*/
/// Documentation comment, typically used for API documentation
```

## 2. Variables and Data Types

### (1) Variable Declaration

- **var**: Type inferred dynamically.
- **dynamic**: Allows type changes at runtime (use sparingly).
- **Object**: Base class for all classes.
- **final**: Immutable after runtime initialization.
- **const**: Compile-time constant.

### (2) Built-in Data Types

- **Numbers**: int (integers) and double (floating-point).

```dart
int count = 10;
double price = 19.99;
```

- **Strings**: Supports single or double quotes, with string interpolation ${expression}.

```dart
String greeting = "Hello";
print("$greeting, Dart!"); // Output: Hello, Dart!
```

- **Booleans**: true and false.
- **Lists**: Ordered collections (similar to arrays).

```dart
List<int> numbers = [1, 2, 3];
```

- **Sets**: Unordered collections of unique items.

```dart
Set<String> names = {"Alice", "Bob"};
```

- **Maps**: Key-value pair collections.

```dart
Map<String, int> scores = {"Alice": 90, "Bob": 85};
```

### (3) Null Safety

Dart 2.12 introduced Sound Null Safety, where variables are non-nullable by default. Use ? for nullable types:

```dart
String? nullableString = null; // Can be null
String nonNullableString = "Dart"; // Cannot be null
```

## 3. Control Flow

- **Conditional statements**: if, else if, else.

```dart
int age = 20;
if (age >= 18) {
  print("Adult");
} else {
  print("Minor");
}
```

- **Loops**: for, while, do-while.

```dart
for (int i = 0; i < 3; i++) {
  print(i);
}
```

- **Switch**:

```dart
String day = "Monday";
switch (day) {
  case "Monday":
    print("Start of week");
    break;
  default:
    print("Other day");
}
```

## 4. Functions

### (1) Function Definition

```dart
int add(int a, int b) {
  return a + b;
}
```

**Optional Parameters**:

- **Named parameters** (wrapped in {}, require names when called):

```dart
void greet({String? name, int? age}) {
  print("Hello, $name, age $age");
}
greet(name: "Alice", age: 25);
```

- **Positional optional parameters** (wrapped in []):

```dart
void say(String msg, [String? from]) {
  print("$msg from $from");
}
say("Hi"); // Hi from null
say("Hi", "Bob"); // Hi from Bob
```

### (2) Arrow Functions

Concise syntax for single-expression functions:

```dart
int square(int x) => x * x;
```

### (3) Anonymous Functions

```dart
var list = [1, 2, 3];
list.forEach((item) => print(item));
```

## 5. Object-Oriented Programming

### (1) Classes and Objects

```dart
class Person {
  String name;
  int age;

  // Constructor
  Person(this.name, this.age);

  void introduce() {
    print("I am $name, $age years old.");
  }
}

void main() {
  var person = Person("Alice", 25);
  person.introduce(); // Output: I am Alice, 25 years old.
}
```

### (2) Inheritance

Using the extends keyword:

```dart
class Student extends Person {
  String school;

  Student(String name, int age, this.school) : super(name, age);

  @override
  void introduce() {
    print("I am $name, $age years old, from $school.");
  }
}
```

### (3) Mixins

Multiple inheritance using the with keyword:

```dart
mixin Musician {
  void play() => print("Playing music");
}

class Artist with Musician {}
```

### (4) Abstract Classes and Interfaces

Abstract classes defined with abstract:

```dart
abstract class Animal {
  void eat(); // Abstract method
}
```

Interfaces implemented with implements:

```dart
class Dog implements Animal {
  @override
  void eat() => print("Dog is eating");
}
```

## 6. Asynchronous Programming

Dart uses Future for async operations, combined with async and await:

```dart
Future<String> fetchData() async {
  await Future.delayed(Duration(seconds: 2)); // Simulated delay
  return "Data loaded";
}

void main() async {
  print("Fetching...");
  String data = await fetchData();
  print(data); // After 2 seconds: Data loaded
}
```

## 7. Exception Handling

Using try, catch, finally:

```dart
void main() {
  try {
    int result = 10 ~/ 0; // Division by zero throws exception
  } catch (e) {
    print("Error: $e");
  } finally {
    print("Done");
  }
}
```

## 8. Libraries and Packages

**Importing Libraries**:

```dart
import 'dart:math'; // Import Dart core library
import 'package:http/http.dart' as http; // Import external package
```

**Custom Libraries**:

```dart
// mylib.dart
void sayHello() => print("Hello from mylib");

// main.dart
import 'mylib.dart';
void main() => sayHello();
```

## 9. Dart and Flutter

Dart is the core language of Flutter, which uses Dart to build declarative UIs. Widgets are Flutter's basic building blocks, represented in Dart:

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MaterialApp(
    home: Scaffold(
      body: Center(child: Text("Hello, Flutter!")),
    ),
  ));
}
```

## Summary

Dart is a clean, modern language with syntax similar to Java and JavaScript, but enhanced with features like null safety and mixins. It's particularly well-suited for rapid cross-platform development. With its gentle learning curve and powerful features, it excels especially in the Flutter ecosystem.
