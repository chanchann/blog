---
layout: post
title: "React 03-03 : useContext"
author: "chanchan"
categories: journal
tags: [react]
image: mountains.jpg
toc: true
---

`useContext` is a hook provided by React for accessing React's Context in function components. Context is a React mechanism that allows you to share data throughout the component tree without having to pass props down manually at every level. It's particularly suitable for handling global state such as themes, user information, language settings, etc.

Before `useContext` was introduced, accessing Context required using the `Context.Consumer` component, while `useContext` provides a more concise approach, especially in function components.

---

### Basic Components of Context
Before using `useContext`, we need to understand the three core parts of Context:
1. **`createContext`**: Creates a Context object.
2. **`Provider`**: The Context provider, used to wrap the component tree and provide shared data.
3. **`Consumer` or `useContext`**: Used to consume data from the Context.

`useContext` is essentially a replacement for `Consumer`, simplifying the code.

---

### How to Use `useContext`?
Here is the complete process for using `useContext`:

#### 1. Create Context
Use `createContext` to create a Context object:
```jsx
import { createContext } from 'react';

// Create Context, you can specify a default value (optional)
const MyContext = createContext('Default value');
```

#### 2. Provide Context Data
Use the `Provider` component to wrap the component tree that needs to share data, and pass data through the `value` prop:
```jsx
import React from 'react';

function App() {
  const value = 'Hello from Context';

  return (
    <MyContext.Provider value={value}>
      <Child />
    </MyContext.Provider>
  );
}
```

#### 3. Consume Data with `useContext`
In a function component, access the Context value using `useContext`:
```jsx
import { useContext } from 'react';

function Child() {
  const contextValue = useContext(MyContext);
  return <p>{contextValue}</p>; // Output: Hello from Context
}
```

#### Complete Example
```jsx
import React, { createContext, useContext } from 'react';

const MyContext = createContext('Default value');

function App() {
  const value = 'Hello from Context';

  return (
    <MyContext.Provider value={value}>
      <Parent />
    </MyContext.Provider>
  );
}

function Parent() {
  return <Child />;
}

function Child() {
  const contextValue = useContext(MyContext);
  return <p>{contextValue}</p>;
}

export default App;
```
Result: The page displays "Hello from Context".

---

### A More Practical Example: Managing Global State
`useContext` is commonly used for managing global state, such as theme switching. Here's a complete theme switching example:

```jsx
import React, { createContext, useContext, useState } from 'react';

// Create Context
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  return <ThemedButton />;
}

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  const style = {
    background: theme === 'light' ? '#fff' : '#333',
    color: theme === 'light' ? '#000' : '#fff',
  };

  return (
    <button style={style}>
      Current Theme: {theme}
    </button>
  );
}

export default App;
```
- The `App` component provides `theme` and `setTheme` through the `Provider`.
- `ThemedButton` uses `useContext` to access and use these values.
- Clicking the button toggles the theme, and the button style changes accordingly.

---

### How `useContext` Works
1. **Find the Nearest Provider**: When `useContext(MyContext)` is called, React searches up the component tree for the nearest `MyContext.Provider` and returns its `value`.
2. **Default Value**: If no matching `Provider` is found in the component tree, it returns the default value specified when `createContext` was called.
3. **Dynamic Updates**: When the `Provider`'s `value` changes, all components using `useContext` will re-render.

**Note**: If you use Context directly without a `Provider`, you'll get the default value:
```jsx
const MyContext = createContext('Default value');

function Child() {
  const value = useContext(MyContext);
  return <p>{value}</p>; // Output: Default value
}

function App() {
  return <Child />;
}
```

---

### Advantages of `useContext`
1. **Avoids Props Drilling**: No need to pass data through props layer by layer, simplifying code.
2. **Concise and Easy to Use**: Compared to `Consumer`, the syntax of `useContext` is more intuitive.
3. **Global State Management**: Combined with `useState` or `useReducer`, it can implement simple global state management.

---

### Limitations of `useContext`
1. **Performance Issues**:
   - Every time a `Provider`'s `value` changes, all components depending on that Context will re-render.
   - If `value` is an object, a new reference is generated with each render, potentially triggering unnecessary re-renders even if the content hasn't changed.
   **Solution**: Optimize `value` using `useMemo`:
   ```jsx
   const value = useMemo(() => ({ theme, setTheme }), [theme]);
   ```

2. **Not Suitable for Complex State Logic**:
   - When state logic becomes complex (e.g., requiring multiple reducers or middleware), `useContext` may fall short. In such cases, consider Redux or other state management libraries.

3. **Single Context Limitations**:
   - If a Context contains too much data, it becomes difficult to modularize. You can use multiple Contexts to separate concerns.

---

### Using with `useReducer`
`useContext` is often paired with `useReducer` for more complex state management:

```jsx
import React, { createContext, useContext, useReducer } from 'react';

const CountContext = createContext();

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

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CountContext.Provider value={{ state, dispatch }}>
      <Counter />
    </CountContext.Provider>
  );
}

function Counter() {
  const { state, dispatch } = useContext(CountContext);
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Add 1</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>Subtract 1</button>
    </div>
  );
}

export default App;
```
- `useReducer` manages state logic, while `useContext` handles cross-component sharing.

---

### Important Considerations
1. **Ensure Provider Exists**: If a component uses `useContext` without a corresponding `Provider`, it will use the default value, which may lead to unexpected behavior.
2. **Avoid Frequent Updates**: If `value` changes frequently, consider splitting the Context or using alternative state management solutions.
3. **Debugging**: Use React DevTools to check if Context values are being correctly passed.

---

### Summary
- **Purpose of `useContext`**: Provides a concise way to share data throughout the component tree, particularly suitable for global state.
- **Use Cases**: Theme switching, user information, simple cross-component state sharing.
- **Alternatives**: For complex applications, consider combining with `useReducer` or using libraries like Redux or Zustand.
