---
layout: post
title: "Flutter 02 : Development Guide"
author: "chanchan"
categories: journal
tags: [flutter]
image: mountains.jpg
toc: true
---

Developing a Flutter cross-platform application is a systematic process. Flutter is a powerful UI toolkit developed by Google that enables you to build iOS, Android, Web, and desktop applications using a single codebase. This guide will walk you through the steps of developing a Flutter application from scratch, covering environment setup, project creation, code writing, debugging, and publishing.

## Step 1: Prepare Development Environment

### Install Flutter SDK
1. Visit the Flutter website (https://flutter.dev) and download the latest version of Flutter SDK for your operating system (Windows, macOS, or Linux).
2. Extract the downloaded zip file to a local directory (e.g., `~/flutter`) and add Flutter's bin directory to your system's PATH environment variable.
3. Run `flutter doctor` to check if your environment is properly configured. It will inform you of any missing dependencies.

### Install Required Tools
- **Dart**: Flutter uses the Dart programming language, which is included with the Flutter SDK.
- **IDE**: Recommended to use Android Studio or Visual Studio Code.
  - Android Studio: Install Flutter and Dart plugins.
  - VS Code: Install the Flutter extension.

### Android Environment
- Install Android SDK (through Android Studio or separate download).
- Configure Android emulator or connect a physical device.

### iOS Environment (macOS Users)
- Install Xcode (through App Store).
- Run `sudo gem install cocoapods` to install CocoaPods.
- Configure iOS simulator.

### Verify Environment
Run `flutter doctor` again to ensure there are no error messages. If there are issues (such as unaccepted Android licenses), follow the prompts to resolve them.

## Step 2: Create Flutter Project

### Create New Project
Open terminal and enter the following command:
```bash
flutter create my_app
```
This will generate a Flutter project template named `my_app`.

### Project Structure Overview
- `lib/main.dart`: The application's entry file containing default code.
- `pubspec.yaml`: Configuration file for managing dependencies and resources.
- `android/` and `ios/`: Platform-specific native code folders.

### Run Default Application
Navigate to the project directory:
```bash
cd my_app
```
Start the emulator (or connect a device) and run:
```bash
flutter run
```
You'll see a simple counter example application.

## Step 3: Design Application Features

Let's develop a simple To-Do application with features for adding tasks, displaying task list, and deleting tasks.

### Plan UI and Features
- Main interface: Task list.
- Input field: Add new tasks.
- Delete button: Remove tasks.

### Modify pubspec.yaml
Usually, no additional dependencies are needed as Flutter's built-in components are sufficient for this functionality.

### Write Code
Open `lib/main.dart` and replace the default content with the following code:

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'To-Do App',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: TodoScreen(),
    );
  }
}

class TodoScreen extends StatefulWidget {
  @override
  _TodoScreenState createState() => _TodoScreenState();
}

class _TodoScreenState extends State<TodoScreen> {
  final TextEditingController _controller = TextEditingController();
  List<String> tasks = [];

  void _addTask() {
    if (_controller.text.isNotEmpty) {
      setState(() {
        tasks.add(_controller.text);
        _controller.clear();
      });
    }
  }

  void _removeTask(int index) {
    setState(() {
      tasks.removeAt(index);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('To-Do List')),
      body: Column(
        children: [
          Padding(
            padding: EdgeInsets.all(8.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(hintText: 'Enter task'),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.add),
                  onPressed: _addTask,
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: tasks.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(tasks[index]),
                  trailing: IconButton(
                    icon: Icon(Icons.delete),
                    onPressed: () => _removeTask(index),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
```

### Code Explanation
- `MyApp`: The root component of the application using Material Design.
- `TodoScreen`: A stateful component managing the task list.
- `tasks`: List to store tasks.
- `_addTask` and `_removeTask`: Logic for adding and removing tasks.
- UI uses `TextField` (input field) and `ListView` (task list).

## Step 4: Testing and Debugging

### Run Application
Use `flutter run` to test on emulator or device.
- Enter tasks, click add, check list updates
- Click delete, verify task removal

### Debugging Tools
- Use Flutter Inspector in IDE to view UI hierarchy.
- Use `print()` or debugger to check variable values.

### Cross-Platform Testing
Run on both Android and iOS simulators to ensure compatibility.

## Step 5: Optimization and Extension

### Add Styling
Modify `ThemeData` or individual component styles (colors, fonts).

Example: Change AppBar to green:
```dart
theme: ThemeData(primarySwatch: Colors.green),
```

### Data Persistence
Use `shared_preferences` plugin to save task list:

Add to `pubspec.yaml`:
```yaml
dependencies:
  shared_preferences: ^2.0.0
```
Modify code to save and read tasks.

### Add More Features
- Mark task completion status.
- Add categories or priorities.

## Step 6: Packaging and Publishing

### Configure Application
Modify `android/app/build.gradle` and `ios/Runner/Info.plist` to set application name, icon, and permissions.
- Icon generation: Use `flutter_launcher_icons` plugin.

### Build APK (Android)
Run:
```bash
flutter build apk --release
```
Output file is in `build/app/outputs/flutter-apk/app-release.apk`.

### Build IPA (iOS)
Run:
```bash
flutter build ios --release
```
Open `ios/Runner.xcworkspace` in Xcode, archive and upload to App Store.

### Publishing
- Android: Upload APK to Google Play Console.
- iOS: Submit application through App Store Connect.

## Important Notes
- Performance optimization: Avoid unnecessary `setState` calls, use `const` constructors.
- Error handling: Add input validation or exception catching.
- Documentation and community: Refer to Flutter official documentation (https://docs.flutter.dev) and community resources.
