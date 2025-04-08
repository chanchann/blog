---
layout: post
title: "Redering"
author: "chanchan"
categories: journal
tags: [js]
image: mountains.jpg
toc: true
---

Server-Side Rendering (SSR), Static Site Generation (SSG), and Client-Side Rendering (CSR). These are common techniques used in modern web development frameworks (like Next.js, React, or others) to determine *when* and *where* the HTML content of a webpage is generated. 

---

### 1. **Server-Side Rendering (SSR)**  
#### How It Works:
With SSR, the HTML content of a page is generated on the server for *each request*. When a user navigates to a webpage, the server processes the request, fetches any necessary data (e.g., from a database or API), renders the page into HTML, and sends it back to the browser. JavaScript may then "hydrate" the page on the client side, adding interactivity.

#### Step-by-Step Process:
1. **User Request**: The user’s browser sends an HTTP request to the server (e.g., visiting `example.com/about`).
2. **Server Processing**: The server receives the request and runs the application logic. This typically involves:
   - Fetching data (e.g., querying a database or calling an external API).
   - Executing the rendering logic (e.g., a React component tree) on the server.
3. **HTML Generation**: The server converts the application’s components into fully-formed HTML.
4. **Response**: The server sends the HTML (along with CSS and optionally some JavaScript) to the browser.
5. **Hydration (Optional)**: Once the HTML loads in the browser, JavaScript takes over, attaching event listeners and making the page interactive.

#### Key Characteristics:
- **Dynamic**: Content is generated per request, so it can reflect real-time data (e.g., user-specific content).
- **Initial Load**: The browser receives a fully-rendered HTML page, which is great for SEO and fast First Contentful Paint (FCP).
- **Server Load**: Requires a server to handle rendering for every request, which can increase latency or resource usage under heavy traffic.

#### Use Case:
- Pages that need real-time or user-specific data, like a social media feed or an e-commerce product page with live pricing.
- Applications where SEO is critical, as search engines can crawl the fully-rendered HTML.

#### Example:
In a Next.js app with SSR, you might use `getServerSideProps` to fetch data and render the page on each request:

```javascript
export async function getServerSideProps(context) {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();
  return { props: { data } };
}
```

---

### 2. **Static Site Generation (SSG)**  
#### How It Works:
With SSG, the HTML content is pre-rendered at *build time* rather than on every request. The pages are generated once when the application is built, and the resulting static HTML files are served to users. This approach is highly efficient since no server-side computation is needed at runtime.

#### Step-by-Step Process:
1. **Build Time**: During the build process (e.g., running `npm run build`), the framework:
   - Fetches any required data (e.g., from APIs or a CMS).
   - Renders all pages or specific pages into static HTML files.
2. **Static Files**: The output is a set of static assets (HTML, CSS, JS) stored on a server or CDN.
3. **User Request**: When a user visits the site, the pre-generated HTML is served directly from the server or CDN.
4. **Hydration (Optional)**: JavaScript can hydrate the static HTML in the browser to add interactivity.

#### Key Characteristics:
- **Static**: Content is fixed at build time, so it’s not ideal for frequently changing data unless paired with incremental updates.
- **Performance**: Extremely fast delivery since the server just serves pre-built files, often cached on a CDN.
- **Scalability**: No server computation per request, making it cost-effective and resilient to traffic spikes.

#### Use Case:
- Blogs, documentation sites, marketing pages, or any site where content doesn’t change often.
- Scenarios prioritizing performance and SEO with mostly static content.

#### Example:
In Next.js, you might use `getStaticProps` to fetch data at build time:

```javascript
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();
  return { props: { posts } };
}
```
For dynamic routes (e.g., `/posts/[id]`), you’d pair it with `getStaticPaths` to define which pages to pre-render.

---

### 3. **Client-Side Rendering (CSR)**  
#### How It Works:
With CSR, the server sends a minimal HTML file (often just a shell with a `<div id="root">`) along with JavaScript. The browser then executes the JavaScript, fetches data, and renders the page entirely on the client side.

#### Step-by-Step Process:
1. **User Request**: The browser requests a page from the server.
2. **Server Response**: The server sends a lightweight HTML file with a JavaScript bundle (and maybe some CSS).
3. **JavaScript Execution**: The browser downloads and runs the JavaScript.
4. **Data Fetching**: The JavaScript makes API calls to fetch data.
5. **Rendering**: The JavaScript renders the components and populates the DOM with the final content.

#### Key Characteristics:
- **Dynamic**: Content is fetched and rendered after the page loads, making it great for highly interactive apps.
- **Initial Load**: Slower First Contentful Paint (FCP) since the browser must wait for JS and data, but subsequent interactions can be fast (e.g., via caching or SPA navigation).
- **SEO Challenge**: Search engines may struggle to index content unless mitigated with tools like prerendering.

#### Use Case:
- Single Page Applications (SPAs) like dashboards, admin panels, or apps with heavy client-side interactivity.
- Situations where SEO is less important than user experience after the initial load.

#### Example:
In a React app using CSR, you might fetch data with `useEffect`:

```javascript
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return <div>{data ? data.message : 'Loading...'}</div>;
}
```

---

### Comparison Summary:
| Aspect              | SSR                       | SSG                      | CSR                      |
|---------------------|---------------------------|--------------------------|--------------------------|
| **Rendering Time**  | On each request (server)  | At build time           | After page load (client) |
| **Performance**     | Moderate (server latency) | Very fast (static files)| Slower initial load      |
| **SEO**             | Excellent                 | Excellent                | Poor (unless prerendered)|
| **Dynamic Data**    | Real-time                | Static (unless updated)  | Real-time                |
| **Use Case**        | Dynamic pages            | Static content           | Interactive SPAs         |

---

Each method has its strengths depending on the application’s needs. SSR balances dynamism and SEO, SSG excels in performance and simplicity, and CSR shines for rich, interactive experiences. Frameworks like Next.js often let you mix them within a single app (e.g., SSG for blog posts, SSR for user profiles, CSR for a dashboard), giving you flexibility to optimize for both users and search engines.