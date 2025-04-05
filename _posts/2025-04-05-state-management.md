---
layout: post
title: "React 06 : State Management"
author: "chanchan"
categories: journal
tags: [react]
image: mountains.jpg
toc: true
---

In React, state is a mechanism used within components to manage dynamic data. Through state, components can re-render the UI based on user interactions, data changes, and other events. State management refers to how to effectively organize, pass, and maintain these states between components, especially as application scale increases.

React itself provides basic state management tools, such as `useState` and `useReducer`, but as application complexity increases (for example, when multiple components need to share state or state logic becomes complex), we need more powerful patterns or tools to manage state.

---

### 1. React's Built-in State Management Methods

#### (1) `useState` - Basic State Management
`useState` is the simplest and most commonly used state management hook in React. It's suitable for local state within a single component.

**Example:**
```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add 1</button>
    </div>
  );
}
```
- `useState` returns a state variable (`count`) and an update function (`setCount`).
- Suitable for simple, local states, such as form inputs, toggle states, etc.

**Limitations:**
- When state needs to be shared between multiple components, `useState` requires passing through props layer by layer (commonly known as "props drilling"), making the code verbose and difficult to maintain.

#### (2) `useReducer` - Complex Local State Management
When component state logic is complex (such as multiple interdependent states or batch updates), `useReducer` is a better choice. It's similar to Redux's reducer pattern.

**Example:**
```jsx
import React, { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Add 1</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Subtract 1</button>
    </div>
  );
}
```
- `useReducer` accepts a reducer function and initial state, returning the current state and a dispatch function.
- Suitable for scenarios that require centralized state logic management.

**Limitations:**
- Like `useState`, `useReducer` is still at the component level and cannot directly solve the problem of sharing state across components.

---

### 2. Sharing State Between Components

#### (1) Props Passing
The most basic way to share state is to define it in a parent component and pass it to child components through props.

**Example:**
```jsx
function Parent() {
  const [count, setCount] = useState(0);

  return <Child count={count} setCount={setCount} />;
}

function Child({ count, setCount }) {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add 1</button>
    </div>
  );
}
```
**Problems:**
- When component hierarchy is deep, props need to be passed layer by layer, leading to high maintenance costs.

#### (2) Context API - Global State Management
React's `Context API` allows state to be shared across components, avoiding props drilling.

**Example:**
```jsx
import React, { createContext, useContext, useState } from 'react';

const CountContext = createContext();

function App() {
  const [count, setCount] = useState(0);

  return (
    <CountContext.Provider value={{ count, setCount }}>
      <Parent />
    </CountContext.Provider>
  );
}

function Parent() {
  return <Child />;
}

function Child() {
  const { count, setCount } = useContext(CountContext);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add 1</button>
    </div>
  );
}
```
- `createContext` creates a context, `Provider` provides the state, and `useContext` consumes the state.
- Suitable for global state management in small to medium-sized applications, such as themes, user information, etc.

**Limitations:**
- When state updates frequently, all components depending on the Context will re-render, potentially affecting performance.
- Not suitable for very complex applications (logic scattered across multiple Contexts becomes difficult to manage).

---

### 3. Third-party State Management Libraries

When built-in tools cannot meet the requirements (for example, large applications or complex state logic), third-party libraries are a better choice. Here are common solutions:

#### (1) Redux
Redux is the most popular state management library in the React ecosystem, based on a single state tree (Single Source of Truth) and Flux architecture.

**Core Concepts:**
- **Store**: The container for global state storage.
- **Actions**: Events that describe state changes.
- **Reducers**: Pure functions that handle actions and update state.

**Example:**
```jsx
import { createStore } from 'redux';
import { Provider, useDispatch, useSelector } from 'react-redux';

// Reducer
const initialState = { count: 0 };
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    default:
      return state;
  }
}

// Store
const store = createStore(reducer);

// Component
function Counter() {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>Add 1</button>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}
```
**Advantages:**
- Predictable state updates (pure functions).
- Powerful debugging tools (such as Redux DevTools).
- Suitable for large applications.

**Disadvantages:**
- Lots of boilerplate code, steep learning curve.
- Too complex for simple applications.

#### (2) Zustand
Zustand is a lightweight state management library with a concise API, suitable for small to medium-sized applications.

**Example:**
```jsx
import create from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

function Counter() {
  const { count, increment } = useStore();
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Add 1</button>
    </div>
  );
}
```
**Advantages:**
- Simple API, no boilerplate code.
- Flexible, supports both local and global state.

**Disadvantages:**
- Lacks the strict architectural constraints of Redux, which may lead to chaotic state management.

#### (3) Recoil
Recoil is a state management library launched by Facebook, designed specifically for React, based on atomized state (Atoms).

**Example:**
```jsx
import { atom, useRecoilState } from 'recoil';

const countState = atom({
  key: 'countState',
  default: 0,
});

function Counter() {
  const [count, setCount] = useRecoilState(countState);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add 1</button>
    </div>
  );
}
```
**Advantages:**
- Consistent with React's Hooks style.
- Supports fine-grained updates, better performance.

**Disadvantages:**
- Community ecosystem is not as mature as Redux.

---

### 4. State Management Selection Recommendations
- **Small Applications**: Use `useState` + `useContext`.
- **Medium-sized Applications**: Use `useReducer` + `Context`, or lightweight libraries like Zustand.
- **Large Applications**: Use Redux or Recoil, especially when strict state management and debugging are needed.

---

### 5. Considerations
- **Performance Optimization**: Use `useMemo`, `useCallback`, or optimization tools from state management libraries (such as Redux's `connect`) to avoid unnecessary rendering.
- **State Design**: Try to keep the state flat, avoiding deep nesting.
- **Debugging**: For large applications, it's recommended to use debugging features of state management tools (such as Redux DevTools).
