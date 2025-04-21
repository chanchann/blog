---
layout: post
title: "Expo : Basic"
author: "chanchan"
categories: journal
tags: [react native]
image: mountains.jpg
toc: true
---

Expo is a powerful open-source platform for building native iOS, Android, and web applications using JavaScript and React Native. It simplifies the development process by providing a set of tools, libraries, and services that streamline workflows. 

---

### 1. **Overview of Expo**
- **What is Expo?**
  Expo is a framework and platform built on top of React Native, designed to make mobile app development faster and easier. It provides a managed environment for building, deploying, and testing apps without needing to write native code (Swift, Kotlin, etc.).
- **Key Features**:
  - Cross-platform development (iOS, Android, and web from a single codebase).
  - Simplified build and deployment process.
  - Extensive library of pre-built APIs and components.
  - Over-the-air (OTA) updates for instant app updates without app store submissions.
  - Expo Go app for rapid testing and prototyping on real devices.

- **Two Workflows**:
  - **Managed Workflow**: Expo handles the native code and build process. Developers focus solely on JavaScript/React Native.
  - **Bare Workflow**: Offers more control by allowing direct access to native code, but requires manual configuration for native builds.

---

### 2. **Core Components and Tools**
- **Expo CLI**:
  - A command-line interface for creating, building, and managing Expo projects.
  - Commands:
    - `npx expo start`: Starts the development server.
    - `npx expo build`: Builds standalone apps for iOS/Android.
    - `npx expo publish`: Publishes the app for OTA updates.
    - `npx expo install`: Installs compatible dependencies.
  - Install globally or use via `npx` (e.g., `npx create-expo-app`).

- **Expo SDK**:
  - A collection of APIs and libraries for common functionalities, such as:
    - **Camera**: Access device camera for photos/videos.
    - **Notifications**: Push and local notifications.
    - **Location**: GPS and geolocation services.
    - **FileSystem**: Read/write files on the device.
    - **Permissions**: Manage access to device features.
  - The SDK is versioned (e.g., SDK 51), and each version corresponds to a specific React Native version.

- **Expo Go**:
  - A mobile app (available on iOS and Android) for testing Expo projects in development.
  - Scan a QR code from the Expo CLI to instantly preview your app on a real device.
  - Limitations: Some native modules or custom native code may not work in Expo Go, requiring a custom development client or bare workflow.

- **Custom Development Client**:
  - A tailored version of the Expo Go app that includes custom native modules or configurations.
  - Useful when you need features not supported by Expo Go (e.g., specific native libraries).

---

### 3. **Development Workflow**
- **Starting a Project**:
  - Use `npx create-expo-app my-app` to bootstrap a new project.
  - Project structure:
    - `app.json`: Configuration file for app metadata (name, icon, version, etc.).
    - `package.json`: Manages dependencies and scripts.
    - `App.js`: Entry point for the app’s JavaScript code.

- **Running the App**:
  - Run `npx expo start` to launch the development server.
  - Options for testing:
    - Expo Go (scan QR code).
    - iOS/Android emulator/simulator.
    - Web browser (using React Native Web).

- **Building for Production**:
  - **Managed Workflow**: Use `npx expo build:ios` or `npx expo build:android` to generate standalone apps.
  - **EAS (Expo Application Services)**:
    - A cloud-based service for building, submitting, and deploying apps.
    - Commands:
      - `eas build`: Builds apps in the cloud.
      - `eas submit`: Submits apps to App Store/Google Play.
      - `eas update`: Publishes OTA updates.
    - Requires an Expo account and configuration in `eas.json`.

- **OTA Updates**:
  - Publish updates to your app’s JavaScript bundle without resubmitting to app stores.
  - Use `npx expo publish` or `eas update` to push updates.
  - Users receive updates automatically when they open the app (if configured).

---

### 4. **Configuration**
- **app.json / app.config.js**:
  - Defines app metadata and platform-specific settings.
  - Key fields:
    - `name`: App name.
    - `slug`: Unique identifier for the app.
    - `version`: App version.
    - `icon`: Path to app icon.
    - `splash`: Splash screen configuration.
    - `ios`/`android`: Platform-specific settings (e.g., bundle identifier, permissions).
  - `app.config.js` allows dynamic configuration using JavaScript.

- **Environment Variables**:
  - Use libraries like `dotenv` or Expo’s `extra` field in `app.json` to manage environment-specific variables.
  - Example:
  
    ```json
    "extra": {
      "apiKey": "your-api-key"
    }
    ```
  - Access in code via `import Constants from 'expo-constants';`.

---

### 5. **Key APIs and Libraries**
- **Navigation**:
  - Expo supports popular navigation libraries like `react-navigation`.
  - Install via `npx expo install @react-navigation/native`.
  - Common navigators: Stack, Tab, Drawer.

- **Styling**:
  - Use React Native’s `StyleSheet` or libraries like `styled-components`.
  - Expo supports web-friendly styling for cross-platform apps.

- **Assets**:
  - Manage images, fonts, and other assets using `expo-asset` and `expo-font`.
  - Preload assets to improve performance.

- **Testing**:
  - Use `Jest` with `react-native-testing-library` for unit testing.
  - Test on real devices via Expo Go or emulators.

- **Third-Party Libraries**:
  - Many React Native libraries are compatible with Expo (e.g., `axios`, `lodash`).
  - For native modules not supported by Expo, use the bare workflow or custom dev client.

---

### 6. **Advantages of Expo**
- **Rapid Development**: No need to set up complex native build environments (Xcode, Android Studio).
- **Cross-Platform**: Single codebase for iOS, Android, and web.
- **Rich Ecosystem**: Access to a wide range of APIs and tools.
- **OTA Updates**: Update apps without app store delays.
- **Community and Documentation**: Strong community support and comprehensive docs.

---

### 7. **Limitations**
- **Limited Native Access in Managed Workflow**:
  - Cannot use libraries requiring native code modifications without switching to bare workflow.
- **Performance**:
  - React Native apps may not match the performance of fully native apps for complex use cases.
- **Size Overhead**:
  - Expo apps include the Expo SDK, which can increase app size (though EAS Build optimizes this).
- **Dependency on Expo**:
  - Managed workflow ties you to Expo’s ecosystem and SDK versions.

---

### 8. **When to Use Expo**
- **Use Expo If**:
  - You’re building a cross-platform app with standard features.
  - You want to prototype quickly or avoid native code.
  - You need OTA updates or simplified deployment.

- **Avoid Expo If**:
  - Your app requires extensive native code or specific native modules not supported by Expo.
  - You need maximum performance or minimal app size.

---

### 9. **Recent Developments (as of April 2025)**
- **Expo SDK Updates**:
  - SDK 51 (latest as of late 2024) includes improved performance, new APIs, and better React Native compatibility.
  - Check the Expo blog or changelog for updates beyond SDK 51.
- **EAS Enhancements**:
  - EAS Build and EAS Submit have become the standard for production builds, replacing classic builds.
  - Improved support for custom build profiles and CI/CD integration.
- **Web Support**:
  - Expo’s web support has matured, allowing seamless React Native Web development.

---

### 10. **Learning Resources**
- **Official Documentation**: [docs.expo.dev](https://docs.expo.dev)
- **Expo Blog**: Updates on new features and best practices.
- **Community**:
  - Expo Discord, forums, and X posts for real-time help.
  - Search X for recent Expo-related discussions or issues.
- **Tutorials**:
  - YouTube channels and blogs like “React Native School” or “Expo Examples” on GitHub.

---

### 11. **Best Practices**
- **Keep SDK Updated**: Regularly update to the latest SDK to access new features and bug fixes.
- **Optimize Assets**: Use compressed images and preload assets for better performance.
- **Modularize Code**: Break down components and logic for maintainability.
- **Test Early**: Test on real devices using Expo Go to catch platform-specific issues.
- **Use EAS for Production**: Leverage EAS Build and Submit for reliable, scalable deployment.

