---
layout: post
title: "React Native : 05 Styling"
author: "chanchan"
categories: journal
tags: [react native]
image: mountains.jpg
toc: true
---

Styling in React Native is a fundamental aspect of building visually appealing and responsive mobile applications. Unlike web development, where CSS is used, React Native uses JavaScript objects to define styles, leveraging a subset of CSS-like properties tailored for mobile environments.

---

### 1. **Core Concept: JavaScript-Based Styling**
- **Style Objects**: Styles in React Native are defined as JavaScript objects, typically using camelCase properties (e.g., `backgroundColor` instead of `background-color`).

  ```javascript
  const styles = {
    container: {
      backgroundColor: '#fff',
      padding: 20,
      marginTop: 10,
    },
  };
  ```
- **Applying Styles**: Styles are applied to components using the `style` prop, which accepts either a single style object or an array of style objects.

  ```javascript
  <View style={styles.container}>
    <Text style={[styles.text, { color: 'blue' }]}>Hello</Text>
  </View>
  ```

- **Inline Styles vs. StyleSheet**: You can write styles inline or use the `StyleSheet` API. The `StyleSheet` API is preferred for performance and maintainability.

  ```javascript
  import { StyleSheet, View } from 'react-native';

  const App = () => {
    return <View style={styles.container} />;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f0f0',
    },
  });
  ```

- **Why Use StyleSheet?**:
  - Optimizes performance by reusing style references.
  - Provides better debugging with named styles.
  - Ensures consistent styling across components.

---

### 2. **Supported Style Properties**
React Native supports a subset of CSS properties, categorized by their purpose:

- **Layout Properties** (e.g., Flexbox):
  - `flex`, `flexDirection`, `justifyContent`, `alignItems`, `margin`, `padding`, etc.
  - Example:

    ```javascript
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }
    ```

- **View Properties**:
  - `backgroundColor`, `borderWidth`, `borderColor`, `borderRadius`, `opacity`, etc.
  - Example:

    ```javascript
    box: {
      backgroundColor: 'blue',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#000',
    }
    ```

- **Text Properties**:
  - `color`, `fontSize`, `fontWeight`, `textAlign`, `lineHeight`, etc.
  - Example:

    ```javascript
    text: {
      color: '#333',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    }
    ```

- **Image Properties**:
  - `resizeMode` (`cover`, `contain`, `stretch`), `tintColor`, etc.
  - Example:

    ```javascript
    image: {
      width: 100,
      height: 100,
      resizeMode: 'cover',
    }
    ```

- **Shadow and Elevation**:
  - iOS: `shadowColor`, `shadowOffset`, `shadowOpacity`, `shadowRadius`.
  - Android: `elevation`.
  - Example:

    ```javascript
    shadowBox: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5, // Android
    }
    ```

- **Transformations**:
  - `transform` (e.g., `translateX`, `rotate`, `scale`).
  - Example:

    ```javascript
    transformBox: {
      transform: [{ rotate: '45deg' }, { scale: 1.2 }],
    }
    ```

---

### 3. **Flexbox for Layout**
React Native uses Flexbox as the primary layout system, similar to CSS Flexbox but with some differences:
- **Default Behavior**:
  - `flexDirection` defaults to `column` (not `row` as in CSS).
  - All elements are `display: flex` by default; there’s no `display: block`.

- **Key Properties**:
  - `flex`: Defines how a component grows or shrinks (e.g., `flex: 1` takes available space).
  - `flexDirection`: `row`, `column`, `row-reverse`, `column-reverse`.
  - `justifyContent`: `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly`.
  - `alignItems`: `flex-start`, `center`, `flex-end`, `stretch`.
  - `alignSelf`: Overrides `alignItems` for a specific child.
  - `flexWrap`: `wrap`, `nowrap`.

- Example:
  ```javascript

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    item: {
      width: 100,
      height: 100,
      backgroundColor: 'red',
    },
  });
  ```

---

### 4. **Units and Dimensions**
- **Unitless Values**: Most measurements (e.g., `width`, `height`, `margin`, `padding`) are in density-independent pixels (DP), which are unitless in React Native.
- **Percentage Values**: Supported for some properties (e.g., `width: '50%'`).
- **Dynamic Dimensions**:
  - Use `Dimensions` API to get screen or window dimensions.
  - Example:

    ```javascript
    import { Dimensions } from 'react-native';
    const { width, height } = Dimensions.get('window');

    const styles = StyleSheet.create({
      fullScreen: {
        width: width,
        height: height,
      },
    });
    ```

- **SafeAreaView**: Use `SafeAreaView` to handle notches and status bars.

  ```javascript
  import { SafeAreaView } from 'react-native-safe-area-context';

  <SafeAreaView style={styles.container}>
    <Text>Content</Text>
  </SafeAreaView>;
  ```

---

### 5. **Conditional and Dynamic Styling**
- **Conditional Styles**:
  - Use ternary operators or object spreads to apply styles conditionally.
  - Example:

    ```javascript
    <View style={[styles.base, isActive ? styles.active : styles.inactive]} />
    ```

- **Dynamic Styles**:
  - Compute styles based on props or state.
  - Example:

    ```javascript
    const DynamicBox = ({ size }) => {
      const dynamicStyle = {
        width: size,
        height: size,
        backgroundColor: size > 100 ? 'blue' : 'red',
      };
      return <View style={dynamicStyle} />;
    };
    ```

- **Platform-Specific Styles**:
  - Use `Platform` module to apply platform-specific styles.
  - Example:

    ```javascript
    import { Platform } from 'react-native';

    const styles = StyleSheet.create({
      container: {
        padding: Platform.OS === 'ios' ? 20 : 10,
        ...Platform.select({
          ios: { backgroundColor: '#f0f0f0' },
          android: { backgroundColor: '#fff' },
        }),
      },
    });
    ```

---

### 6. **Style Composition and Arrays**
- **Style Arrays**: The `style` prop accepts an array of styles, applied from left to right (later styles override earlier ones).
  ```javascript
  <Text style={[styles.base, styles.text, { color: 'green' }]}>Styled Text</Text>
  ```

- **Merging Styles**:
  - Use `StyleSheet.flatten` to merge multiple styles into a single object.
  - Example:

    ```javascript
    const mergedStyle = StyleSheet.flatten([styles.base, styles.override]);
    ```

---

### 7. **Performance Considerations**
- **Avoid Inline Styles**: Inline styles create new objects on every render, impacting performance. Use `StyleSheet.create` instead.
- **Minimize Style Updates**: Avoid dynamically generating styles in render-heavy components.
- **Use Memoization**: For dynamic styles, use `useMemo` to prevent unnecessary recalculations.

  ```javascript
  const dynamicStyle = useMemo(() => ({
    width: size,
    height: size,
  }), [size]);
  ```

---

### 8. **Theming and Reusability**
- **Theme Objects**: Define a theme object to centralize colors, typography, and spacing.

  ```javascript
  const theme = {
    colors: {
      primary: '#007AFF',
      background: '#fff',
    },
    spacing: {
      small: 8,
      medium: 16,
      large: 24,
    },
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.medium,
    },
  });
  ```

- **Styled Components** (Third-Party):
  - Libraries like `styled-components` or `emotion` allow CSS-like syntax for styling.
  - Example with `styled-components`:

    ```javascript
    import styled from 'styled-components/native';

    const StyledView = styled.View`
      background-color: ${props => props.theme.colors.primary};
      padding: 20px;
    `;
    ```

---

### 9. **Accessibility in Styling**
- **Readable Fonts**: Ensure `fontSize` and `color` contrast meet accessibility standards.
- **Dynamic Type**: Support dynamic font scaling with `allowFontScaling` or `Text` component adjustments.

  ```javascript
  <Text allowFontScaling={true} style={styles.text}>
    Scalable Text
  </Text>
  ```

- **Touch Target Size**: Ensure buttons and interactive elements have sufficient size (e.g., 48x48 DP).

---

### 10. **Debugging Styles**
- **React Native Debugger**: Use tools like React Native Debugger or Flipper to inspect styles.
- **Log Styles**: Use `console.log(StyleSheet.flatten(style))` to debug computed styles.
- **Visual Debugging**: Temporarily add `borderWidth` or `backgroundColor` to visualize layouts.

---

### 11. **Common Pitfalls**
- **Unsupported Properties**: Not all CSS properties are supported (e.g., `display: block` or `float`).
- **Flexbox Differences**: Be aware of React Native’s Flexbox quirks (e.g., default `flexDirection: column`).
- **Performance Overuse**: Avoid overly complex dynamic styles or excessive style arrays.

---

### Conclusion
Styling in React Native combines the familiarity of CSS-like properties with the flexibility of JavaScript, optimized for mobile performance. By leveraging `StyleSheet`, Flexbox, platform-specific adjustments, and theming, you can create scalable and maintainable styles. Always prioritize performance and accessibility to ensure a smooth user experience.
