---
layout: post
title: "React 05 : Basic Concepts of React Routing"
author: "chanchan"
categories: journal
tags: [react]
image: mountains.jpg
toc: true
---

React Router is the standard library for implementing client-side routing in React applications. In Single Page Applications (SPAs), React Router allows you to render different components based on URL changes without refreshing the entire page.

```jsx
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
```

### Key React Concepts (Related to Routing)

Before understanding React Router, let's review some basic concepts:

- **Component**: React's core is components, which are reusable UI blocks. Routing's purpose is to render different components based on the URL.
- **Single Page Application (SPA)**: React is typically used to build SPAs where pages don't refresh, and content is dynamically updated through JavaScript. Routing simulates a multi-page experience in SPAs.
- **JSX**: A syntax similar to HTML used in React to define component structure. Routing components (like `<Route>`) are also nested in JSX.

## II. Core Components of React Router

### 1. BrowserRouter (alias Router)

**What is it**: A routing container that manages URLs using browser history (History API).

**Purpose**: It serves as the "root" of the routing system, wrapping the entire application and providing routing functionality.

**Use case**: Typically placed at the outermost layer of the application.

**Example**:
```jsx
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      {/* Routing-related components */}
    </Router>
  );
}
```

**Related concepts**:
- **History API**: A built-in browser API for manipulating forward/backward navigation and URL changes (pushState, popState, and replaceState).
- **HashRouter**: Another router type (based on URL # hash) similar to BrowserRouter but with better compatibility in older browsers.

### 2. Routes

**What is it**: A collection of routing rules that matches the current URL and renders the corresponding component.

**Purpose**: Manages all `<Route>` components and ensures only the matching route is rendered.

**Use case**: Wraps multiple `<Route>` components.

**Example**:
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
</Routes>
```

**Related concepts**:
- **Switch** (old component in v5): Routes is the v6 upgrade with more powerful features, including support for relative paths.
- **Path matching**: Routes matches paths from top to bottom, finding the first match.

### 3. Route

**What is it**: Defines a single routing rule, specifying the path and corresponding component.

**Purpose**: Renders the specified element when the URL matches the path.

**Use case**: Define specific pages within `<Routes>`.

**Properties**:
- **path**: The matching URL path (e.g., /about).
- **element**: The React component to render when the path matches.

**Example**:
```jsx
<Route path="/profile" element={<Profile />} />
```

**Related concepts**:
- **Dynamic routing**: Parameters can be defined using :param, e.g., /user/:id.
- **Nested routes**: `<Route>` can be nested for complex page layouts.

### 4. Navigate

**What is it**: A component used for redirections.

**Purpose**: Immediately redirects users to another path when rendered.

**Use case**: Protecting routes (e.g., redirecting to login page when not logged in).

**Properties**:
- **to**: The target path.
- **replace** (optional): If true, replaces the current history entry instead of adding a new one (default is false).

**Example**:
```jsx

function ProtectedRoute({ isLoggedIn }) {
  return isLoggedIn ? <Dashboard /> : <Navigate to="/login" />;
}

```

**Related concepts**:
- **useNavigate**: A Hook providing programmatic navigation (e.g., `navigate('/login')`).
- **Redirect** (old component in v5): Navigate is its replacement.

### 5. Link

**What is it**: A component for navigation, similar to HTML's `<a>` tag but doesn't refresh the page.

**Purpose**: Provides declarative navigation, updating the URL and rendering the corresponding component when clicked.

**Example**:
```jsx
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}
```

## III. Important Routing Concepts

Besides the core components above, several concepts are closely related to routing:

### Path
- The path portion of a URL, such as /about, /user/123.
- Supports wildcards * (match all) and parameters :id (dynamic segments).

### Navigation
- Users navigate to other pages by clicking links or through code.
- Component form: `<Link>` (similar to HTML's `<a>` tag but doesn't refresh the page).
- Hook form: useNavigate() for event-based navigation.

### Protected Routes
- Restricts access to certain pages based on specific conditions (like login status).
- Implementation: Combined with `<Navigate>` or conditional rendering.

### Route Parameters
- Extracts dynamic values from URLs, like the id in /user/:id.
- Using Hook: useParams() to access parameters.

### Query Parameters
- The ?key=value portion of a URL, like /search?q=react.
- Using Hook: useSearchParams() to read and manipulate.

## IV. Comprehensive Example

Here's a complete code snippet showing how these components work together:

```jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <h1>Home</h1>
      <Link to="/about">Go to About Page</Link>
    </>
  );
}

function About() {
  return <h1>About Us</h1>;
}

function ProtectedPage() {
  const isLoggedIn = false; // Simulating login status
  return isLoggedIn ? <h1>Protected Page</h1> : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/protected" element={<ProtectedPage />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* 404 redirect */}
      </Routes>
    </Router>
  );
}

```

## V. React Router Workflow

Here's the typical workflow of react-router-dom:

1. **Configure Routing Environment**
   - Wrap the entire application with `<BrowserRouter>` (or Router).

2. **Define Routing Rules**
   - Specify paths and components using `<Route>` within `<Routes>`.

3. **Navigation & Redirection**
   - Users switch pages by clicking `<Link>`.
   - Conditions trigger redirects using `<Navigate>` or useNavigate.

4. **Dynamic Handling**
   - Process dynamic paths and query parameters with useParams or useSearchParams.

## VI. Beginner Tips

- **Start Simple**: First implement basic page switching using `<Route>` and `<Link>`.
- **Understand SPAs**: Routing doesn't refresh the page; all changes rely on component rendering.
- **Use Documentation**: React Router's official website (https://reactrouter.com) has detailed tutorials.
- **Practice**: Create a small project, such as "Home-About-404" page navigation.

## Summary

React Router provides a complete client-side routing solution with core components including:

- **BrowserRouter (Router)**: Provides the routing environment.
- **Routes**: Manages a set of routing rules.
- **Route**: Defines specific path-to-component mappings.
- **Navigate**: Used for redirections.
- **Link**: Provides navigation functionality.

Together, these tools form the core of routing management in React applications, allowing you to easily implement page navigation and dynamic rendering.
