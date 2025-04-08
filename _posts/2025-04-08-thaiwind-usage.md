---
layout: post
title: "Tailwind Usage"
author: "chanchan"
categories: journal
tags: [css]
image: mountains.jpg
toc: true
---

Tailwind CSS is a utility-first CSS framework that works seamlessly with React and TypeScript, allowing you to style components directly in your JSX/TSX files. Below, I'll cover some of the most frequently used Tailwind utilities, explain their purpose, and provide practical examples.

### Prerequisites
To use Tailwind CSS in your TypeScript + React project:
1. Install Tailwind CSS:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
2. Configure `tailwind.config.js`:
   ```javascript
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: ["./src/**/*.{ts,tsx}"],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```
3. Add Tailwind directives to your `src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
4. Import the CSS in your `src/index.tsx`:
   ```tsx
   import './index.css';
   ```

Now, let’s dive into commonly used Tailwind utilities with TypeScript + React examples.

---

### 1. **Layout and Spacing**
Tailwind provides utilities for controlling layout (flexbox, grid) and spacing (padding, margin).

#### Flexbox
- `flex`, `flex-row`, `flex-col`, `justify-between`, `items-center`
- Used to create flexible layouts.

**Demo**:
```tsx
import React from 'react';

const FlexDemo: React.FC = () => {
  return (
    <div className="flex flex-row justify-between items-center p-4 bg-gray-100">
      <div className="bg-blue-500 text-white p-2">Item 1</div>
      <div className="bg-green-500 text-white p-2">Item 2</div>
      <div className="bg-red-500 text-white p-2">Item 3</div>
    </div>
  );
};

export default FlexDemo;
```
- `flex`: Enables flexbox.
- `flex-row`: Sets direction to horizontal.
- `justify-between`: Distributes items with space between.
- `items-center`: Vertically centers items.
- `p-4`: Adds padding (1rem).

#### Grid
- `grid`, `grid-cols-3`, `gap-4`
- Used for grid layouts.

**Demo**:
```tsx
import React from 'react';

const GridDemo: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <div className="bg-purple-500 text-white p-4">Grid 1</div>
      <div className="bg-purple-500 text-white p-4">Grid 2</div>
      <div className="bg-purple-500 text-white p-4">Grid 3</div>
    </div>
  );
};

export default GridDemo;
```
- `grid-cols-3`: Creates a 3-column grid.
- `gap-4`: Adds a 1rem gap between grid items.

#### Padding and Margin
- `p-4`, `m-2`, `px-6`, `my-3`
- Controls padding (`p-`) and margin (`m-`).

**Demo**:
```tsx
const SpacingDemo: React.FC = () => {
  return (
    <div className="p-4 m-2 bg-gray-200">
      <button className="px-6 py-2 bg-blue-500 text-white">Click Me</button>
    </div>
  );
};
```

---

### 2. **Typography**
Tailwind offers utilities for text styling.

- `text-lg`, `font-bold`, `text-center`, `text-blue-600`
- Controls size, weight, alignment, and color.

**Demo**:
```tsx
import React from 'react';

const TypographyDemo: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center text-blue-600">Welcome</h1>
      <p className="text-lg text-gray-700 mt-2">This is a demo paragraph.</p>
    </div>
  );
};

export default TypographyDemo;
```
- `text-3xl`: Large text size.
- `font-bold`: Bold text.
- `text-blue-600`: Blue text color.
- `mt-2`: Margin-top of 0.5rem.

---

### 3. **Backgrounds and Colors**
- `bg-`, `text-`, `border-` with color scales (e.g., `bg-blue-500`).

**Demo**:
```tsx
import React from 'react';

const ColorDemo: React.FC = () => {
  return (
    <div className="p-4 bg-gray-100">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Hover Me
      </button>
    </div>
  );
};
```
- `bg-blue-500`: Blue background.
- `hover:bg-blue-700`: Darker blue on hover.
- `rounded`: Rounded corners.

---

### 4. **Borders**
- `border`, `border-2`, `border-gray-300`, `rounded-lg`

**Demo**:
```tsx
import React from 'react';

const BorderDemo: React.FC = () => {
  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Enter text"
        className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
      />
    </div>
  );
};
```
- `border-2`: 2px border width.
- `focus:border-blue-500`: Blue border on focus.

---

### 5. **Responsive Design**
Tailwind uses prefixes like `sm:`, `md:`, `lg:` for responsive styling.

**Demo**:
```tsx
import React from 'react';

const ResponsiveDemo: React.FC = () => {
  return (
    <div className="p-4 bg-gray-100">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="bg-yellow-500 p-4">Box 1</div>
        <div className="bg-yellow-500 p-4">Box 2</div>
        <div className="bg-yellow-500 p-4">Box 3</div>
      </div>
    </div>
  );
};
```
- `md:flex-row`: Switches to row layout on medium screens and above.

---

### 6. **Interactivity**
- `hover:`, `focus:`, `active:`
- Adds interactive states.

**Demo**:
```tsx
import React from 'react';

const InteractiveDemo: React.FC = () => {
  return (
    <div className="p-4">
      <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 active:bg-green-900">
        Click Me
      </button>
    </div>
  );
};
```
- `hover:bg-green-700`: Changes background on hover.
- `active:bg-green-900`: Changes background when clicked.

---

### 7. **Custom Components**
You can combine Tailwind classes into reusable components.

**Demo**:
```tsx
import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const CustomButton: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-800 transition duration-300"
    >
      {label}
    </button>
  );
};

const App: React.FC = () => {
  return (
    <div className="p-4">
      <CustomButton label="Submit" onClick={() => alert('Clicked!')} />
    </div>
  );
};

export default App;
```
- `transition duration-300`: Smooth color transition.

---

### 8. **Utilities for Sizing**
- `w-`, `h-`, `max-w-`, `min-h-`
- Controls width and height.

**Demo**:
```tsx
import React from 'react';

const SizingDemo: React.FC = () => {
  return (
    <div className="p-4">
      <div className="w-64 h-32 bg-teal-500 text-white flex items-center justify-center">
        Fixed Size Box
      </div>
    </div>
  );
};
```
- `w-64`: Width of 16rem (256px).
- `h-32`: Height of 8rem (128px).

---

### Conclusion
These are some of the most commonly used Tailwind CSS utilities in a TypeScript + React project. Tailwind’s strength lies in its flexibility and composability—combine these utilities to create complex layouts and styles without writing custom CSS. 
