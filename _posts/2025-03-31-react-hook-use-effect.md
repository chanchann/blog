---
layout: post
title: "React Hook: useEffect Explained"
author: "chanchan"
categories: journal
tags: [react]
image: mountains.jpg
toc: true
---

Let me explain the key points of useEffect: side effects, component mounting and unmounting, and the dependency array. I'll use simple, straightforward language with examples to help you understand.

## 1. What are Side Effects?

Side effects are operations that happen "outside" of component rendering. React's main task is to render UI based on state and props, but sometimes we need to perform operations that aren't directly related to rendering - these are side effects.

### Example:

You have a component that displays a counter:

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  return <p>Count: {count}</p>;
}
```

Here, React only cares about rendering the `<p>` tag - this is the "main effect."

But if we want to save the count value to localStorage or fetch data from a server whenever count changes, these operations are unrelated to rendering itself - they are "side effects."

### Common Side Effects Include:

- Data fetching: Getting data from APIs
- Event subscriptions: Listening for window size changes, keyboard input, etc.
- Manual DOM manipulation: Like modifying element styles
- Timers: Setting up setTimeout or setInterval

### The Purpose of useEffect:

It provides a place to safely execute these side effects after component rendering, without interfering with React's rendering process.

## 2. What are Component Mounting and Unmounting?

These concepts come from component "lifecycle." React components have "birth" and "death" processes.

### Component Mounting

- **Meaning**: When a component is first created and rendered to the page
- **When it happens**: For example, when you add a `<Counter />` component to your page, React first calls this function component to display it

#### Capturing with useEffect:

```javascript
useEffect(() => {
  console.log('Component mounted!');
}, []); // Empty dependency array, runs only once on mount
```

### Component Unmounting

- **Meaning**: When a component is removed from the page and no longer displayed
- **When it happens**: For example, when you use conditional rendering `if (show) return <Counter />`, and show becomes false, `<Counter />` will be removed

#### Capturing with useEffect:

```javascript
useEffect(() => {
  console.log('Component mounted!');
  return () => {
    console.log('Component unmounted!');
  };
}, []); // Return function runs on unmount
```

### Complete Example:

```javascript
function Counter() {
  useEffect(() => {
    console.log('Component mounted');
    return () => {
      console.log('Component unmounted');
    };
  }, []);

  return <p>I am a counter</p>;
}

function App() {
  const [show, setShow] = useState(true);
  return (
    <div>
      {show && <Counter />}
      <button onClick={() => setShow(false)}>Hide Counter</button>
    </div>
  );
}
```

After clicking the button, show becomes false, `<Counter />` is removed, and "Component unmounted" will be logged to the console.

### Component Lifecycle Flow

#### 1. During Initial Render:
- The `App` component renders, with the initial value of `show` as `true`
- Because `show` is `true`, the `Counter` component is rendered to the DOM
- After the `Counter` component mounts, `useEffect` executes, printing `"Component mounted"` to the console
- Since the dependency array is empty `[]`, this effect will only execute once when the component first renders

#### 2. When Button is Clicked:
- User clicks the "Hide Counter" button
- `setShow(false)` is called, changing the `show` state to `false`
- React re-renders the `App` component
- Since `show` is now `false`, the `Counter` component will be removed from the DOM (unmounted)
- **Before removing the `Counter` component**, React will execute the cleanup function returned in `useEffect`
- The cleanup function executes, printing `"Component unmounted"` to the console

### Cleanup Function Call Mechanism

React calls the cleanup function in the following situations:

1. **When the component unmounts**: Before the component is removed from the DOM, React automatically calls the cleanup function
2. **Before re-executing the effect due to dependency changes**: If the effect's dependencies change, React will call the cleanup function from the previous effect before executing the new effect

In your example, since the dependency array is empty `[]`, the effect only executes once at mount, and the cleanup function only executes once at unmount.

### Internal Working Mechanism

React internally maintains the lifecycle state of components. When it detects that a component needs to be unmounted (e.g., conditional rendering becomes false), React will:

1. Mark the component for removal
2. Before removing the component, look for all cleanup functions registered with `useEffect` in that component
3. Execute these cleanup functions in the order they were registered
4. Finally remove the component from the DOM

This mechanism ensures that components can "clean up after themselves" before being removed, preventing memory leaks and other resource issues.

## 3. What is the Dependency Array?

The dependency array is useEffect's second parameter. It tells React: "Hey, only run the side effect when these values change." Without a dependency array, the side effect runs after every render.

### Usage:

```javascript
useEffect(() => {
  console.log('Side effect ran');
}, [dependency1, dependency2]);
```

`dependency1` and `dependency2` are dependencies. If their values haven't changed, useEffect won't run again.

### Three Cases:

#### 1. Empty Array []:
Side effect runs only once on mount and cleanup runs on unmount.

```javascript
useEffect(() => {
  console.log('Runs only on mount');
  return () => console.log('Runs only on unmount');
}, []);
```

#### 2. With Dependencies [count]:
Side effect runs every time count changes.

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]); // Only updates title when count changes

  return (
    <button onClick={() => setCount(count + 1)}>Click to add 1</button>
  );
}
```

#### 3. No Dependency Array:
Side effect runs after every component render.

```javascript
useEffect(() => {
  console.log('Runs on every render');
});
```

This case is generally not recommended as it can lead to performance issues.

### Why Do We Need the Dependency Array?

React needs to know which values the side effect depends on to trigger it at the right time.

If you forget to include dependencies, it can lead to bugs. For example:

```javascript
const [count, setCount] = useState(0);
useEffect(() => {
  console.log(count); // count is a dependency
}, []); // Forgot count, will always log 0
```

## Comprehensive Example

Here's a complete example combining side effects, mounting/unmounting, and the dependency array:

```javascript
function UserProfile() {
  const [userId, setUserId] = useState(1);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Side effect: Fetch user data
    fetch(`https://api.example.com/users/${userId}`)
      .then(response => response.json())
      .then(data => setUserData(data));

    // Cleanup side effect (e.g., cancel request, this is just a simulation)
    return () => {
      console.log('Cancelling previous request, userId changed or component unmounting');
    };
  }, [userId]); // Depends on userId, only refetches when it changes

  return (
    <div>
      <p>{userData ? userData.name : 'Loading...'}</p>
      <button onClick={() => setUserId(userId + 1)}>Next User</button>
    </div>
  );
}
```

- **Side Effect**: Sending network request to fetch user data
- **Mounting**: Component first loads and requests data for userId=1
- **Unmounting**: Component prints cleanup message when removed
- **Dependency Array**: `[userId]` ensures data is refetched when userId changes

## Summary

- **Side Effects**: Operations outside of rendering, like data fetching and event listening
- **Mounting**: Component first appears on page; Unmounting: Component is removed from page
- **Dependency Array**: Controls when side effects run - empty array runs once, with values runs when values change
