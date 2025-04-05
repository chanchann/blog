---
layout: post
title: "React 03 : React Hooks"
author: "chanchan"
categories: journal
tags: [react]
image: mountains.jpg
toc: true
---

React Hooks is a feature introduced in React 16.8 that allows you to use state and lifecycle features in function components without writing class components. The introduction of Hooks has greatly facilitated code reuse, logic separation, and state management. Let's explore the core concepts, common Hooks, and important considerations.

## What are React Hooks?

Before Hooks, React components were primarily of two types:
- **Class Components**: Defined using the `class` keyword, capable of using state and lifecycle methods (like `componentDidMount`, `componentWillUnmount`, etc.).
- **Function Components**: Could only be stateless, purely presentational.

As development complexity increased, class components brought challenges like code reuse difficulties, scattered logic, and complex lifecycle management. Hooks aim to solve these issues, making function components more powerful while maintaining simplicity.

Simply put, Hooks are special functions that let you "hook into" React features like state management, lifecycle, and context.

## Core Hooks

React provides several built-in core Hooks. Here are the most commonly used ones:

### 1. useState

**Purpose**: Add state to function components.

**Usage**:
```javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // Initial value is 0

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click to increment</button>
    </div>
  );
}
```

**Explanation**:
- `useState` returns an array with two elements: the state value (`count`) and a function to update it (`setCount`).
- The initial value can be of any type (number, object, array, etc.).
- Calling `setCount` triggers a re-render of the component.

### 2. useEffect

**Purpose**: Handle side effects, equivalent to lifecycle methods in class components.

**Usage**:
```javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Executes on component mount or update
    fetch('https://api.example.com/data')
      .then(response => response.json())
      .then(result => setData(result));

    // Optional cleanup function, executes on component unmount
    return () => {
      console.log('Component unmounting, cleaning up side effects');
    };
  }, [data]); // Dependency array, effect runs when data changes

  return <div>{data ? data.message : 'Loading...'}</div>;
}
```

**Explanation**:
- `useEffect` takes two arguments:
  - A callback function that executes the side effect logic (like data fetching, subscriptions, DOM manipulations).
  - An optional dependency array: the effect re-runs when values in this array change. If empty `[]`, the effect runs only on mount and unmount.
- Replaces `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`.

### 3. useContext

**Purpose**: Use React's Context to avoid prop drilling.

**Usage**:
```javascript
import React, { useContext } from 'react';

const MyContext = React.createContext('default value');

function Child() {
  const value = useContext(MyContext);
  return <p>{value}</p>;
}

function Parent() {
  return (
    <MyContext.Provider value="value from context">
      <Child />
    </MyContext.Provider>
  );
}
```

**Explanation**:
- `useContext` accepts a Context object and returns the current context value.
- Commonly used for global state management (like theme switching, user information).

### 4. useReducer

**Purpose**: Similar to Redux's state management approach, suitable for complex state logic.

**Usage**:
```javascript
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
      <button onClick={() => dispatch({ type: 'increment' })}>Increment</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Decrement</button>
    </div>
  );
}
```

**Explanation**:
- `useReducer` returns state and a dispatch function.
- Suitable as an alternative to `useState` when state logic is complex or has multiple sub-states.

## Other Common Hooks

### 1. useCallback

**Purpose**: Cache functions to prevent unnecessary recreations.

**Usage**:
```javascript
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]); // Function is recreated when dependencies change
```

### 2. useMemo

**Purpose**: Cache computed values to prevent unnecessary recalculations.

**Usage**:
```javascript
const memoizedValue = useMemo(() => expensiveComputation(a, b), [a, b]);
```

### 3. useRef

**Purpose**: Create mutable ref objects, commonly used for accessing DOM or storing values.

**Usage**:
```javascript
function TextInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```

## Rules of Hooks

React enforces strict rules for using Hooks:

### Only Call Hooks at the Top Level

Don't call Hooks inside loops, conditions, or nested functions. Ensure Hook call order remains consistent across renders.

```javascript
// Wrong
if (condition) {
  const [state, setState] = useState(0);
}

// Correct
const [state, setState] = useState(0);
```

### Only Call Hooks from React Function Components or Custom Hooks

Don't call Hooks from regular JavaScript functions.

## Custom Hooks

You can create your own Hooks to reuse logic. For example:

```javascript
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

function App() {
  const width = useWindowWidth();
  return <p>Window width: {width}px</p>;
}
```

Custom Hooks must start with `use`, which is React's convention for identifying Hooks.

## Advantages and Limitations

### Advantages:
- **Logic Reuse**: Reuse stateful logic through custom Hooks.
- **Code Simplicity**: Avoid complex lifecycle methods and `this` bindings of class components.
- **Clear Side Effects**: `useEffect` centralizes side effect management.

### Limitations:
- **Learning Curve**: Understanding dependency arrays and side effects takes time.
- **Debugging Complexity**: Strict Hook call order makes errors harder to track.

## Summary

React Hooks is a core tool in modern React development, making function components more flexible and powerful. Through `useState` for state management, `useEffect` for side effects, `useContext` for data sharing, and the combination of other Hooks, you can easily build complex applications.
