---
layout: post
title: "Next.js Usage"
author: "chanchan"
categories: journal
tags: [js]
image: mountains.jpg
toc: true
---

Next.js is a powerful React-based framework designed to simplify web development with optimized performance and a great developer experience. Below are its key features, explained from a programmer’s perspective, along with practical code examples to get you started.

#### 1. **Server-Side Rendering (SSR)**
- **Description**: Renders pages on the server per request, improving SEO and initial load speed.
- **Code Demo**:
  ```javascript
  // pages/ssr-example.js
  export async function getServerSideProps() {
    const res = await fetch("https://api.example.com/data");
    const data = await res.json();
    return { props: { data } };
  }

  export default function SSRPage({ data }) {
    return <h1>SSR Data: {data.message}</h1>;
  }
  ```
- **Access**: `/ssr-example` – data fetched on each request.

#### 2. **Static Site Generation (SSG)**
- **Description**: Pre-renders pages at build time into static HTML, ideal for fast, cacheable sites.
- **Code Demo**:
  ```javascript
  // pages/ssg-example.js
  export async function getStaticProps() {
    const res = await fetch("https://api.example.com/data");
    const data = await res.json();
    return { props: { data } };
  }

  export default function SSGPage({ data }) {
    return <h1>SSG Data: {data.message}</h1>;
  }
  ```
  **Dynamic Routes**:
  ```javascript
  // pages/posts/[id].js
  export async function getStaticPaths() {
    return {
      paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
      fallback: false,
    };
  }

  export async function getStaticProps({ params }) {
    const res = await fetch(`https://api.example.com/posts/${params.id}`);
    const post = await res.json();
    return { props: { post } };
  }

  export default function Post({ post }) {
    return <h1>Post: {post.title}</h1>;
  }
  ```
- **Access**: `/posts/1` or `/posts/2`.

#### 3. **File-System Based Routing**
- **Description**: Automatically generates routes based on the `pages` directory structure.
- **Code Demo**:
  ```javascript
  // pages/about.js
  export default function About() {
    return <h1>About Page</h1>;
  }
  ```
- **Access**: `/about` – no manual routing needed.

#### 4. **API Routes**
- **Description**: Build backend endpoints within `pages/api` to handle HTTP requests.
- **Code Demo**:
  ```javascript
  // pages/api/hello.js
  export default function handler(req, res) {
    res.status(200).json({ message: "Hello from API!" });
  }
  ```
- **Access**: `/api/hello` – returns JSON.

#### 5. **Automatic Code Splitting**
- **Description**: Splits JavaScript by page, loading only what’s needed, with dynamic imports for further optimization.
- **Code Demo**:

  ```javascript
  // pages/dynamic.js
  import dynamic from "next/dynamic";

  const HeavyComponent = dynamic(() => import("../components/HeavyComponent"));

  export default function DynamicPage() {
    return (
      <div>
        <h1>Dynamic Import</h1>
        <HeavyComponent />
      </div>
    );
  }
  ```

- **Effect**: `HeavyComponent` loads only when required.

#### 6. **Built-in CSS and Sass Support**
- **Description**: Supports global CSS, modular CSS, and Sass out of the box.
- **Code Demo** (Modular CSS):

  ```css
  /* styles/Home.module.css */
  .title {
    color: blue;
  }
  ```
  ```javascript
  // pages/index.js
  import styles from "../styles/Home.module.css";

  export default function Home() {
    return <h1 className={styles.title}>Hello Next.js</h1>;
  }
  ```

  **Sass** (requires `sass` package):

  ```scss
  // styles/global.scss
  $primary: #0070f3;
  .title {
    color: $primary;
  }
  ```

  ```javascript
  // pages/_app.js
  import "../styles/global.scss";

  export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />;
  }
  ```

#### 7. **Image Optimization**
- **Description**: Built-in `<Image>` component optimizes images (lazy loading, resizing, format conversion).
- **Code Demo**:
  ```javascript
  // pages/image-example.js
  import Image from "next/image";

  export default function ImagePage() {
    return (
      <Image
        src="/example.jpg"
        alt="Example"
        width={500}
        height={300}
        priority
      />
    );
  }
  ```

#### 8. **Incremental Static Regeneration (ISR)**
- **Description**: Combines SSG with runtime updates, regenerating pages as needed.
- **Code Demo**:
  ```javascript
  // pages/isr-example.js
  export async function getStaticProps() {
    const res = await fetch("https://Aapi.example.com/data");
    const data = await res.json();
    return {
      props: { data },
      revalidate: 10, // Regenerate every 10 seconds
    };
  }

  export default function ISRPage({ data }) {
    return <h1>ISR Data: {data.message}</h1>;
  }
  ```

#### 9. **Client-Side Rendering (CSR)**
- **Description**: Traditional React client-side rendering for dynamic interactions.
- **Code Demo**:
  ```javascript
  // pages/csr-example.js
  import { useState, useEffect } from "react";

  export default function CSRPage() {
    const [data, setData] = useState(null);

    useEffect(() => {
      fetch("https://api.example.com/data")
        .then((res) => res.json())
        .then((data) => setData(data));
    }, []);

    return <h1>{data ? data.message : "Loading..."}</h1>;
  }
  ```

#### 10. **Middleware**
- **Description**: Custom logic before requests reach pages or APIs (e.g., redirects, authentication).
- **Code Demo**:
  ```javascript
  // middleware.js
  import { NextResponse } from "next/server";

  export function middleware(req) {
    if (req.nextUrl.pathname === "/admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }
  ```
- **Effect**: Redirects `/admin` to `/`.

#### 11. **TypeScript Support**
- **Description**: Native TypeScript support with minimal setup.
- **Code Demo**:
  ```typescript
  // pages/index.tsx
  import type { NextPage } from "next";

  const Home: NextPage = () => {
    return <h1>Hello TypeScript</h1>;
  };

  export default Home;
  ```
- **Setup**: Create `tsconfig.json`, and Next.js configures it.

#### 12. **Developer Experience Enhancements**
- **Description**: Hot reloading, Fast Refresh, and built-in ESLint/Prettier.
- **Code Demo**: No code needed – edit `pages/index.js` and save to see changes instantly.

#### 13. **Easy Deployment**
- **Description**: Seamless deployment, especially with Vercel, but works with other platforms.
- **Steps**: Push to GitHub, import to Vercel – no code demo required.

---

### Getting Started
1. Create a project: `npx create-next-app@latest my-app`
2. Navigate: `cd my-app`
3. Run: `npm run dev`
4. Experiment with the above examples in the `pages` directory.

---

### Summary
Next.js integrates SSR, SSG, and CSR into a single framework, with features like file-system routing, API routes, and image optimization reducing boilerplate and boosting performance. 