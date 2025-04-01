---
layout: post
title: "React Basic Concepts"
author: "chanchan"
categories: journal
tags: [documentation,sample]
image: mountains.jpg
toc: true
---

The following is a detailed expansion of the React + TypeScript development guide, designed to help React beginners gain a deeper understanding of each core concept, and to provide specific examples and explanations of TypeScript features.

## 1. React Basic Concepts

### Components

The core idea of React is to break down UI into reusable components. Components can be function components or class components, but modern React recommends function components because they are more concise and work better with Hooks.

- **Function Components**: When using TypeScript, you can define component types using React.FC (short for FunctionComponent). React.FC implicitly includes the type of children.
- **Props**: Components receive external data through props. TypeScript requires defining types for props.

#### Detailed Example:

```tsx
import React from 'react';

// Define Props type
interface GreetingProps {
  name: string;
  age?: number; // Optional property
}

// Use React.FC to define component
const Greeting: React.FC<GreetingProps> = ({ name, age }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>You are {age} years old.</p>}
    </div>
  );
};

// Use component
const App: React.FC = () => {
  return <Greeting name="Alice" age={25} />;
};
```

#### Notes:

- React.FC is not mandatory; you can also use a regular function with type annotation: `(props: GreetingProps) => JSX.Element`.
- Try to keep components simple, with single responsibility, for easier reuse.

## 2. React Hooks

Hooks are the core tools of React function components, allowing you to manage state and side effects without using classes.

### useState

Used to manage a component's local state.

#### Detailed Example:

```tsx
import { useState } from 'react';

const Counter: React.FC = () => {
  const [count, setCount] = useState<number>(0); // Specify state type

  const increment = () => setCount(prev => prev + 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Add</button>
    </div>
  );
};
```

Type inference: TypeScript can usually infer types, but complex states (like objects) need to be explicitly defined:

```tsx
interface User {
  name: string;
  age: number;
}
const [user, setUser] = useState<User>({ name: '', age: 0 });
```

### useEffect

Used to handle side effects, such as data fetching, subscriptions, or DOM operations.

#### Detailed Example:

```tsx
import { useEffect, useState } from 'react';

const DataFetcher: React.FC = () => {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/data');
        const result: string[] = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array, only runs on mount

  if (loading) return <p>Loading...</p>;
  return (
    <ul>
      {data.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};
```

Cleaning up side effects: If you have subscriptions or timers, remember to return a cleanup function:

```tsx
useEffect(() => {
  const timer = setInterval(() => console.log('Tick'), 1000);
  return () => clearInterval(timer); // Clean up when component unmounts
}, []);
```

### useContext

Used to share global state in the component tree, avoiding prop drilling.

#### Detailed Example:

{% raw %}
```tsx
import { createContext, useContext, useState } from 'react';

// Define Context type
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemedComponent />
    </ThemeContext.Provider>
  );
};

const ThemedComponent: React.FC = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('ThemedComponent must be used within ThemeContext.Provider');
  const { theme, toggleTheme } = context;

  return (
    <div style={{ background: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#000' : '#fff' }}>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};
```
{% endraw %}

## 3. TypeScript and React Integration

### Type Definitions

The core advantage of TypeScript is providing type checking for variables, functions, props, etc.

#### Props Types:

```tsx
interface CardProps {
  title: string;
  content: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void; // Optional event
}

const Card: React.FC<CardProps> = ({ title, content, onClick }) => (
  <div onClick={onClick}>
    <h2>{title}</h2>
    <p>{content}</p>
  </div>
);
```

#### Event Types:

```tsx
const Input: React.FC = () => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return <input type="text" onChange={handleChange} />;
};
```

### Interfaces and Types

#### Interfaces: Suitable for object structures, support extension.

```tsx
interface User {
  id: number;
  name: string;
}
interface Admin extends User {
  role: string;
}
```

#### Type Aliases: More flexible, support union types.

```tsx
type Status = 'idle' | 'loading' | 'success' | 'error';
const [status, setStatus] = useState<Status>('idle');
```

### Generics

In custom Hooks or components, generics improve code reusability.

#### Detailed Example (Custom Hook):

```tsx
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData);
  }, [url]);

  return data;
}

const UserList: React.FC = () => {
  interface User { id: number; name: string }
  const users = useFetch<User[]>('https://api.example.com/users');
  return <ul>{users?.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
};
```

## 4. Component Lifecycle

Modern React uses Hooks to simulate lifecycle:

### Mounting:

```tsx
useEffect(() => {
  console.log('Component mounted');
}, []);
```

### Updating:

```tsx
useEffect(() => {
  console.log('Count updated:', count);
}, [count]);
```

### Unmounting:

```tsx
useEffect(() => {
  const subscription = subscribeToSomething();
  return () => {
    subscription.unsubscribe();
    console.log('Component unmounted');
  };
}, []);
```

## 5. Routing (React Router)

React Router is a routing solution for single-page applications.

### Detailed Example:

```tsx
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

const Home: React.FC = () => <h1>Home Page</h1>;
const About: React.FC = () => <h1>About Page</h1>;

const App: React.FC = () => (
  <BrowserRouter>
    <nav>
      <Link to="/">Home</Link> | <Link to="/about">About</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </BrowserRouter>
);
```

### Dynamic Routing:

```tsx
<Route path="/user/:id" element={<UserProfile />} />

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Type annotation
  return <p>User ID: {id}</p>;
};
```

## 6. State Management

### Simple State

Use useState and useContext.

### Complex State (Redux Toolkit)

#### Installation:

```bash
npm install @reduxjs/toolkit react-redux @types/react-redux
```