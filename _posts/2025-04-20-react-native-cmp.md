---
layout: post
title: "React Native : 04 Compare"
author: "chanchan"
categories: journal
tags: [react native]
image: mountains.jpg
toc: true
---

Developing for **React Native** and **React** for the web has several key differences due to the distinct platforms they target (mobile apps vs. web browsers). Below, I outline the main differences and key considerations when working with React Native compared to React for the web:

---

### **Key Differences**

1. **Platform and Rendering**:
   - **React (Web)**: Renders to the DOM (Document Object Model) using HTML elements. It leverages browser APIs and CSS for styling and layout.
   - **React Native**: Renders to native mobile components (e.g., `UIView` on iOS, `View` on Android) using JavaScript and a bridge to communicate with native code. It does not use HTML or CSS.
   - **Implication**: You cannot use browser-specific APIs (e.g., `window`, `document`) or HTML elements (`div`, `span`) in React Native. Instead, you use React Native components like `<View>`, `<Text>`, and `<ScrollView>`.

2. **Styling**:
   - **React (Web)**: Uses CSS (inline, CSS files, or libraries like styled-components) with full support for CSS properties, media queries, and animations.
   - **React Native**: Uses JavaScript objects for styling via the `StyleSheet` API. Styles are similar to CSS but limited to a subset of properties, and some CSS features (e.g., pseudo-classes, complex animations) are unavailable or implemented differently.
   - **Implication**: You need to adapt to React Native’s styling system, which is less flexible than CSS. For example, layouts rely heavily on Flexbox, and there’s no support for CSS Grid.

3. **Components**:
   - **React (Web)**: Uses HTML elements and custom components built with libraries like Material-UI or Ant Design.
   - **React Native**: Provides platform-specific components (`Button`, `TextInput`, etc.) that map to native UI elements. Some components behave differently on iOS and Android.
   - **Implication**: You must learn React Native’s component library and account for platform-specific behaviors (e.g., `TouchableOpacity` for buttons instead of `<button>`).

4. **Navigation**:
   - **React (Web)**: Uses libraries like React Router for client-side navigation within the browser.
   - **React Native**: Uses libraries like React Navigation or React Native Navigation for mobile app navigation, which mimics native navigation patterns (e.g., stack, tabs, or drawers).
   - **Implication**: Navigation in React Native is more complex due to the need to handle native navigation gestures, transitions, and deep linking.

5. **Access to Native Features**:
   - **React (Web)**: Limited to browser APIs (e.g., geolocation, WebRTC). Accessing device hardware requires user permissions and is often restricted.
   - **React Native**: Can access native device features (e.g., camera, GPS, push notifications) via built-in APIs or third-party libraries. For advanced features, you may need to write native modules in Swift/Objective-C (iOS) or Kotlin/Java (Android).
   - **Implication**: React Native requires understanding how to bridge JavaScript with native code for custom functionality, which adds complexity.

6. **Performance**:
   - **React (Web)**: Performance depends on browser optimizations and JavaScript execution. Web apps are generally less resource-intensive but rely on network connectivity.
   - **React Native**: Performance is closer to native apps but can be slower than fully native code due to the JavaScript bridge. Large lists or complex animations may require optimization.
   - **Implication**: React Native apps need careful optimization (e.g., using `FlatList` for long lists) to match native performance.

7. **Development and Debugging**:
   - **React (Web)**: Debugging is done in browser dev tools (e.g., Chrome DevTools) with hot reloading and extensive tooling.
   - **React Native**: Debugging uses tools like React Native Debugger, Flipper, or Metro bundler logs. You may need to use platform-specific tools (Xcode for iOS, Android Studio for Android) for native issues.
   - **Implication**: React Native development often involves setting up native build environments (e.g., Android SDK, Xcode), which can be time-consuming.

8. **Build and Deployment**:
   - **React (Web)**: Builds are simpler, producing static assets (HTML, CSS, JS) deployed to a web server or CDN.
   - **React Native**: Requires building separate binaries for iOS (IPA) and Android (APK/AAB), which involves configuring signing certificates, provisioning profiles, and app store submissions.
   - **Implication**: React Native deployment is more complex due to platform-specific requirements and app store review processes.

---

### **Key Considerations for React Native Development**

1. **Platform-Specific Code**:
   - iOS and Android may require different implementations for certain features (e.g., UI components, navigation gestures). Use platform-specific modules (`Platform.OS`) or separate files (e.g., `Component.ios.js`, `Component.android.js`) to handle differences.
   - Test thoroughly on both platforms, as emulators/simulators may not catch all issues.

2. **Performance Optimization**:
   - Avoid excessive re-renders by using `React.memo`, `useCallback`, and `useMemo`.
   - Use `FlatList` or `SectionList` for rendering large datasets efficiently.
   - Minimize JavaScript thread usage for smooth animations, and consider libraries like `react-native-reanimated` for complex animations.

3. **Third-Party Libraries**:
   - Not all React libraries work in React Native. Always check for React Native compatibility or alternatives (e.g., use `react-native-vector-icons` instead of web-based icon libraries).
   - Some libraries may require linking native modules, which involves modifying native code.

4. **Native Module Integration**:
   - For features not supported by React Native (e.g., advanced Bluetooth functionality), you may need to write custom native modules or use existing ones from the community.
   - Be prepared to dive into native code if you need custom integrations.

5. **Screen Size and Orientation**:
   - Mobile devices have varying screen sizes and densities (e.g., Retina, high-DPI Android). Use libraries like `react-native-responsive-screen` or percentage-based dimensions for responsive layouts.
   - Handle orientation changes gracefully with proper layout adjustments.

6. **Testing and Debugging**:
   - Use real devices for testing, as emulators may not accurately reflect performance or behavior.
   - Leverage tools like Flipper for performance monitoring and React Native Debugger for state inspection.

7. **Build Configuration**:
   - Set up proper build configurations for development, staging, and production environments.
   - Understand app signing and provisioning for iOS and Android to avoid deployment issues.

8. **App Store Guidelines**:
   - Familiarize yourself with Apple App Store and Google Play Store guidelines to ensure compliance during submission.
   - Account for longer review times on iOS compared to Android.

---

### **Summary**

While React and React Native share the same component-based architecture and JavaScript syntax, React Native requires adapting to a mobile-first mindset. You’ll need to learn platform-specific components, styling, and navigation, and handle native integrations and build processes. Key challenges include optimizing performance, managing platform differences, and navigating app store requirements. To succeed, leverage React Native’s documentation, test extensively on real devices, and use community libraries to bridge gaps in functionality.
