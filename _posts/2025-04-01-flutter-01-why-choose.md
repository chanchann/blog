---
layout: post
title: "Flutter 01 : Why Choose Flutter"
author: "chanchan"
categories: journal
tags: [flutter]
image: mountains.jpg
toc: true
---

Why choose Flutter? The reasons are following:

- **Cross-Platform Capability**: Developed by Google, Flutter allows you to build Android, iOS, Web, and desktop (Windows, macOS, Linux) applications with a single codebase, significantly reducing development time and maintenance costs.
- **High Performance**: Flutter uses the Skia engine for direct rendering, independent of native components, delivering performance close to native applications with smooth animations.
- **Hot Reload**: See changes immediately after modifying code, perfect for rapid iteration and debugging, making it beginner-friendly.
- **Rich UI Toolkit**: Flutter provides Material Design (Android) and Cupertino (iOS) style component libraries, offering flexible and consistent UI design.
- **Community and Ecosystem**: Flutter has an active community, comprehensive documentation, and a vast collection of open-source packages (Pub.dev) supporting common features like networking and databases.
- **Moderate Learning Curve**: If you have basic programming experience (like understanding object-oriented programming), Flutter's Dart language is relatively easy to learn.

### Potential Drawbacks

- **App Size**: Flutter applications may have larger package sizes than native apps (typically starting at 10-20MB), which might be too heavy for small applications.
- **Native Feature Integration**: Deep integration with device-specific features (like certain advanced sensors) might require platform-specific code, increasing complexity.
- **Ecosystem Maturity**: Compared to React Native (another cross-platform framework), Flutter's ecosystem is newer, and some third-party libraries might not be as abundant.
- **Dart Language**: While Flutter uses Dart, which is simple to learn, it's not as widely used as JavaScript (React Native), which might limit skill transferability.

### Comparison with Other Options

- **React Native**: Based on JavaScript, has a more mature ecosystem, suitable for those with web development experience, but slightly inferior performance to Flutter, and UI consistency might require more adjustments.
- **Kotlin Multiplatform (KMP)**: Good for developers wanting to stay close to native development, but has a steeper learning curve for beginners.
- **.NET MAUI**: Based on C#, suitable for those with Microsoft technology background, but cross-platform support isn't as comprehensive as Flutter.

### Conclusion

If you're a beginner looking to quickly develop beautiful cross-platform applications and aren't concerned about app size, Flutter is currently one of the best choices. It's beginner-friendly, has abundant learning resources, and offers an excellent development experience, making it perfect for independent developers.

## What You Need to Know About Flutter

### 1. Basic Preparation

#### Programming Basics
Learn the Dart language

#### Development Environment
- Install Flutter SDK (detailed instructions on the official website)
- Install Android Studio (for Android development and emulator) or Xcode (for iOS development, requires Mac)
- Configure environment variables and ensure `flutter doctor` runs successfully
- Tools: Familiarize yourself with VS Code or Android Studio, the mainstream IDEs for Flutter development, supporting code completion and debugging

### 2. Core Flutter Concepts

#### Widget
Flutter's core principle is "everything is a Widget." Widgets are UI building blocks, divided into two types:
- **StatelessWidget**: Static interfaces, like text and buttons
- **StatefulWidget**: Dynamic interfaces, like counters and forms

#### Layout
- **Container**: Basic container, controlling size, margins, and background
- **Row and Column**: Horizontal and vertical Widget arrangement
- **Stack**: Stacked layout, suitable for complex designs
- **ListView**: Scrolling lists, similar to message lists on phones

#### Other Core Concepts
- **State Management**: Control how data updates the interface. Beginners can use `setState`, while advanced users can learn Provider or Riverpod
- **Navigation**: Use Navigator to switch between pages, like push and pop

### 4. Development Process

1. Create Project: Run `flutter create my_app` to generate a template
2. Write UI: Modify code in `lib/main.dart`, building interfaces with Widgets
3. Debug: Run on emulator (Android/iOS) or physical device, using hot reload for adjustments
4. Build and Release: Use `flutter build apk` (Android) or `flutter build ios` (iOS) to generate applications

### 5. Advanced Knowledge

- **Network Requests**: Use the http package to call APIs and fetch data
- **Local Storage**: Use shared_preferences for simple data or sqflite for databases
- **Third-Party Packages**: Find ready-made libraries on Pub.dev, like image loading (cached_network_image)
- **Animations**: Flutter's animation system is powerful, using AnimatedContainer or custom animations
- **Platform Integration**: Learn to use MethodChannel to call Java/Kotlin or Swift when native features are needed

### 6. Learning Resources

- **Official Documentation**: Flutter.dev, including getting started guides and API references
- **Video Tutorials**: Free courses on YouTube, like "Flutter Crash Course"
- **Project Practice**: Start with simple applications like To-Do List or weather apps
- **Community**: Join Flutter communities (like Flutter.dev) or Reddit for support and questions
