---
layout: post
title: "React Native : 03 Libs"
author: "chanchan"
categories: journal
tags: [react native]
image: mountains.jpg
toc: true
---

Below is a comprehensive list of **common, mainstream, and highly useful libraries** for developing **React Native** applications. These libraries cover essential aspects of mobile app development, including navigation, UI components, state management, networking, animations, and more. Each library is explained with its purpose, why it’s popular, and brief code examples where applicable to help you understand their usage.

---

### 1. Navigation Libraries

#### a. **React Navigation**
- **Purpose**: The most popular library for handling navigation in React Native, supporting stack, tab, drawer, and modal navigators.
- **Why Use It?**:
  - Flexible and customizable.
  - Supports both iOS and Android with native-like transitions.
  - Large community and extensive documentation.
- **Installation**:
  ```bash
  npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
  npm install react-native-screens react-native-safe-area-context
  ```
- **Example**:
  ```jsx
  import { NavigationContainer } from '@react-navigation/native';
  import { createStackNavigator } from '@react-navigation/stack';
  import HomeScreen from './screens/HomeScreen';
  import DetailsScreen from './screens/DetailsScreen';

  const Stack = createStackNavigator();

  const App = () => (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  export default App;
  ```
- **Website**: [reactnavigation.org](https://reactnavigation.org)

#### b. **React Native Navigation (by Wix)**
- **Purpose**: A navigation library that uses native navigation components for better performance.
- **Why Use It?**:
  - Closer to native performance (uses native navigation stacks).
  - Ideal for apps requiring complex navigation.
  - Supports advanced features like deep linking.
- **Note**: Requires native setup, less beginner-friendly than React Navigation.
- **Installation**:
  ```bash
  npm install react-native-navigation
  ```
- **Website**: [wix.github.io/react-native-navigation](https://wix.github.io/react-native-navigation)

---

### 2. UI Component Libraries

#### a. **React Native Elements**
- **Purpose**: A cross-platform UI toolkit providing pre-built, customizable components like buttons, inputs, and cards.
- **Why Use It?**:
  - Consistent design across iOS and Android.
  - Highly customizable with theming support.
  - Easy to integrate for rapid prototyping.
- **Installation**:
  ```bash
  npm install react-native-elements
  ```
- **Example**:
  ```jsx
  import { Button, Input } from 'react-native-elements';

  const MyForm = () => (
    <>
      <Input placeholder="Enter name" />
      <Button title="Submit" onPress={() => console.log('Submitted')} />
    </>
  );
  ```
- **Website**: [reactnativeelements.com](https://reactnativeelements.com)

#### b. **NativeBase**
- **Purpose**: A feature-rich UI component library with a focus on theming and accessibility.
- **Why Use It?**:
  - Large collection of components (e.g., forms, modals, typography).
  - Supports dark/light mode and responsive design.
  - Built-in support for TypeScript.
- **Installation**:
  ```bash
  npm install native-base react-native-svg react-native-safe-area-context
  ```
- **Example**:
  ```jsx
  import { Box, Button, Input } from 'native-base';

  const MyForm = () => (
    <Box>
      <Input placeholder="Enter email" />
      <Button mt="2">Sign Up</Button>
    </Box>
  );
  ```
- **Website**: [nativebase.io](https://nativebase.io)

#### c. **React Native Paper**
- **Purpose**: A Material Design-based UI library with lightweight, customizable components.
- **Why Use It?**:
  - Adheres to Google’s Material Design guidelines.
  - Lightweight and performant.
  - Great for apps targeting Android or Material Design aesthetics.
- **Installation**:
  ```bash
  npm install react-native-paper
  ```
- **Example**:
  ```jsx
  import { Button, TextInput } from 'react-native-paper';

  const MyForm = () => (
    <>
      <TextInput label="Username" />
      <Button mode="contained">Login</Button>
    </>
  );
  ```
- **Website**: [callstack.github.io/react-native-paper](https://callstack.github.io/react-native-paper)

---

### 3. State Management Libraries

#### a. **Redux (with Redux Toolkit)**
- **Purpose**: A predictable state container for managing global app state.
- **Why Use It?**:
  - Widely adopted for complex apps.
  - Redux Toolkit simplifies setup with less boilerplate.
  - Great for debugging with Redux DevTools.
- **Installation**:
  ```bash
  npm install @reduxjs/toolkit react-redux
  ```
- **Example**:
  ```jsx
  import { configureStore } from '@reduxjs/toolkit';
  import { Provider } from 'react-redux';
  import counterReducer from './slices/counterSlice';

  const store = configureStore({
    reducer: { counter: counterReducer },
  });

  const App = () => (
    <Provider store={store}>
      <MyComponent />
    </Provider>
  );
  ```
- **Website**: [redux.js.org](https://redux.js.org)

#### b. **Zustand**
- **Purpose**: A lightweight, hook-based state management library.
- **Why Use It?**:
  - Simpler API than Redux.
  - Minimal boilerplate, ideal for small to medium apps.
  - Supports TypeScript and middleware.
- **Installation**:
  ```bash
  npm install zustand
  ```
- **Example**:
  ```jsx
  import create from 'zustand';

  const useStore = create(set => ({
    count: 0,
    increment: () => set(state => ({ count: state.count + 1 })),
  }));

  const Counter = () => {
    const { count, increment } = useStore();
    return <Button title={`Count: ${count}`} onPress={increment} />;
  };
  ```
- **Website**: [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)

#### c. **MobX**
- **Purpose**: A reactive state management library using observables.
- **Why Use It?**:
  - Automatic reactivity reduces manual state updates.
  - Great for apps with complex, dynamic state.
  - Less verbose than Redux.
- **Installation**:
  ```bash
  npm install mobx mobx-react
  ```
- **Website**: [mobx.js.org](https://mobx.js.org)

---

### 4. Networking Libraries

#### a. **Axios**
- **Purpose**: A promise-based HTTP client for making API requests.
- **Why Use It?**:
  - Simple and intuitive API.
  - Supports request/response interceptors.
  - Handles JSON data automatically.
- **Installation**:
  ```bash
  npm install axios
  ```
- **Example**:
  ```jsx
  import axios from 'axios';
  import { useEffect, useState } from 'react';

  const DataFetcher = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
      axios.get('https://jsonplaceholder.typicode.com/posts/1')
        .then(response => setData(response.data));
    }, []);

    return <Text>{data?.title}</Text>;
  };
  ```
- **Website**: [axios-http.com](https://axios-http.com)

#### b. **React Query (TanStack Query)**
- **Purpose**: A library for fetching, caching, and updating asynchronous data.
- **Why Use It?**:
  - Simplifies data fetching with automatic caching and refetching.
  - Handles loading, error, and success states.
  - Ideal for server-state management.
- **Installation**:
  ```bash
  npm install @tanstack/react-query
  ```
- **Example**:
  ```jsx
  import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
  import axios from 'axios';

  const queryClient = new QueryClient();

  const App = () => (
    <QueryClientProvider client={queryClient}>
      <DataFetcher />
    </QueryClientProvider>
  );

  const DataFetcher = () => {
    const { data, isLoading } = useQuery(['post'], () =>
      axios.get('https://jsonplaceholder.typicode.com/posts/1').then(res => res.data)
    );

    return isLoading ? <Text>Loading...</Text> : <Text>{data.title}</Text>;
  };
  ```
- **Website**: [tanstack.com/query](https://tanstack.com/query)

---

### 5. Animation Libraries

#### a. **React Native Reanimated**
- **Purpose**: A powerful library for creating smooth, performant animations.
- **Why Use It?**:
  - Runs animations on the native thread for better performance.
  - Supports complex gestures and animations.
  - Integrates with `react-native-gesture-handler`.
- **Installation**:
  ```bash
  npm install react-native-reanimated react-native-gesture-handler
  ```
- **Example**:
  ```jsx
  import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
  import { Button, View } from 'react-native';

  const AnimatedBox = () => {
    const offset = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: offset.value }],
    }));

    return (
      <View>
        <Animated.View style={[animatedStyle, { height: 100, width: 100, backgroundColor: 'blue' }]} />
        <Button title="Move" onPress={() => (offset.value = withSpring(100))} />
      </View>
    );
  };
  ```
- **Website**: [docs.swmansion.com/react-native-reanimated](https://docs.swmansion.com/react-native-reanimated)

#### b. **Lottie**
- **Purpose**: Renders Airbnb’s After Effects animations in React Native.
- **Why Use It?**:
  - Easy to integrate high-quality animations.
  - Supports JSON animation files from tools like Adobe After Effects.
  - Cross-platform compatibility.
- **Installation**:
  ```bash
  npm install lottie-react-native lottie-ios
  ```
- **Example**:
  ```jsx
  import LottieView from 'lottie-react-native';

  const Animation = () => (
    <LottieView
      source={require('./animation.json')}
      autoPlay
      loop
      style={{ width: 200, height: 200 }}
    />
  );
  ```
- **Website**: [lottiefiles.com](https://lottiefiles.com)

---

### 6. Storage and Persistence

#### a. **AsyncStorage**
- **Purpose**: A simple key-value storage system for persisting small amounts of data.
- **Why Use It?**:
  - Built into React Native (community package).
  - Ideal for storing user preferences, tokens, or small datasets.
  - Asynchronous and lightweight.
- **Installation**:
  ```bash
  npm install @react-native-async-storage/async-storage
  ```
- **Example**:
  ```jsx
  import AsyncStorage from '@react-native-async-storage/async-storage';

  const saveData = async () => {
    await AsyncStorage.setItem('user', JSON.stringify({ name: 'John' }));
  };

  const getData = async () => {
    const user = await AsyncStorage.getItem('user');
    console.log(JSON.parse(user)); // { name: 'John' }
  };
  ```
- **Website**: [react-native-async-storage.github.io/async-storage](https://react-native-async-storage.github.io/async-storage)

#### b. **MMKV**
- **Purpose**: A high-performance key-value storage library by WeChat.
- **Why Use It?**:
  - Faster than AsyncStorage (uses native implementation).
  - Supports encryption and large datasets.
  - Simple API similar to AsyncStorage.
- **Installation**:
  ```bash
  npm install react-native-mmkv
  ```
- **Website**: [github.com/mrousavy/react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)

---

### 7. Backend and Push Notifications

#### a. **Firebase**
- **Purpose**: A Backend-as-a-Service (BaaS) platform for authentication, databases, analytics, and push notifications.
- **Why Use It?**:
  - Comprehensive suite of tools for app development.
  - Easy integration with React Native.
  - Scalable and reliable.
- **Installation**:
  ```bash
  npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/messaging
  ```
- **Example (Authentication)**:
  ```jsx
  import auth from '@react-native-firebase/auth';

  const signIn = async () => {
    try {
      await auth().signInWithEmailAndPassword('user@example.com', 'password');
      console.log('Signed in!');
    } catch (error) {
      console.error(error);
    }
  };
  ```
- **Website**: [rnfirebase.io](https://rnfirebase.io)

#### b. **OneSignal**
- **Purpose**: A push notification service for engaging users.
- **Why Use It?**:
  - Easy to set up for cross-platform notifications.
  - Supports segmentation and analytics.
  - Free tier available.
- **Installation**:
  ```bash
  npm install react-native-onesignal
  ```
- **Website**: [onesignal.com](https://onesignal.com)

---

### 8. Forms and Validation

#### a. **Formik**
- **Purpose**: A library for managing forms and validation in React Native.
- **Why Use It?**:
  - Simplifies form state management.
  - Integrates with validation libraries like Yup.
  - Reduces boilerplate for form handling.
- **Installation**:
  ```bash
  npm install formik yup
  ```
- **Example**:
  ```jsx
  import { Formik } from 'formik';
  import * as Yup from 'yup';
  import { TextInput, Button } from 'react-native';

  const MyForm = () => (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={Yup.object({
        email: Yup.string().email('Invalid email').required('Required'),
      })}
      onSubmit={values => console.log(values)}
    >
      {({ handleChange, handleSubmit, values, errors }) => (
        <>
          <TextInput
            value={values.email}
            onChangeText={handleChange('email')}
            placeholder="Email"
          />
          {errors.email && <Text>{errors.email}</Text>}
          <Button title="Submit" onPress={handleSubmit} />
        </>
      )}
    </Formik>
  );
  ```
- **Website**: [formik.org](https://formik.org)

---

### 9. Utilities and Miscellaneous

#### a. **React Native Vector Icons**
- **Purpose**: Provides customizable icon sets (e.g., FontAwesome, Material Icons).
- **Why Use It?**:
  - Lightweight and easy to use.
  - Supports multiple icon libraries.
  - Customizable with styles.
- **Installation**:
  ```bash
  npm install react-native-vector-icons
  ```
- **Example**:
  ```jsx
  import Icon from 'react-native-vector-icons/MaterialIcons';

  const MyIcon = () => <Icon name="star" size={30} color="gold" />;
  ```
- **Website**: [github.com/oblador/react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)

#### b. **React Native Gesture Handler**
- **Purpose**: Handles touch gestures like swipes, pinches, and taps.
- **Why Use It?**:
  - Native-driven gestures for better performance.
  - Essential for complex interactions (e.g., drag-and-drop).
  - Pairs well with Reanimated.
- **Installation**:
  ```bash
  npm install react-native-gesture-handler
  ```
- **Website**: [docs.swmansion.com/react-native-gesture-handler](https://docs.swmansion.com/react-native-gesture-handler)

#### c. **React Native Maps**
- **Purpose**: Integrates Google Maps or Apple Maps into React Native apps.
- **Why Use It?**:
  - Cross-platform map support.
  - Customizable markers, polygons, and overlays.
  - Widely used for location-based apps.
- **Installation**:
  ```bash
  npm install react-native-maps
  ```
- **Example**:
  ```jsx
  import MapView from 'react-native-maps';

  const MyMap = () => (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    />
  );
  ```
- **Website**: [github.com/react-native-maps/react-native-maps](https://github.com/react-native-maps/react-native-maps)

---

### 10. Testing Libraries

#### a. **Jest**
- **Purpose**: A JavaScript testing framework for unit and snapshot testing.
- **Why Use It?**:
  - Built into React Native projects.
  - Great for testing components and logic.
  - Supports mocking and assertions.
- **Installation**: Included in React Native CLI/Expo projects.
- **Example**:
  ```jsx
  import { render } from '@testing-library/react-native';
  import MyComponent from './MyComponent';

  test('renders correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello')).toBeTruthy();
  });
  ```
- **Website**: [jestjs.io](https://jestjs.io)

#### b. **React Native Testing Library**
- **Purpose**: A testing utility for React Native components, focusing on user interactions.
- **Why Use It?**:
  - Encourages testing from the user’s perspective.
  - Lightweight and integrates with Jest.
- **Installation**:
  ```bash
  npm install @testing-library/react-native
  ```
- **Website**: [callstack.github.io/react-native-testing-library](https://callstack.github.io/react-native-testing-library)

---

### Tips for Choosing Libraries
- **Project Size**: For small apps, use lightweight libraries like Zustand and Formik. For large apps, consider Redux and React Query.
- **Performance**: Prioritize native-driven libraries (e.g., Reanimated, Gesture Handler) for animations and gestures.
- **Community Support**: Choose libraries with active maintenance and large communities (e.g., React Navigation, NativeBase).
- **Native Integration**: Some libraries (e.g., React Native Navigation, Maps) require native setup; ensure you’re comfortable with platform-specific configurations.
- **TypeScript**: Opt for libraries with TypeScript support (e.g., NativeBase, Zustand) for type-safe development.

---

### How to Stay Updated
- **X Posts**: Search for #ReactNative or follow library maintainers for updates and tips.
- **GitHub**: Star and watch repositories for release notes.
- **NPM Trends**: Check [npmtrends.com](https://npmtrends.com) to compare library popularity.
- **Community**: Join React Native Discord or Reddit for recommendations.
