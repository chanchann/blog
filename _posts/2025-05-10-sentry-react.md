---
layout: post
title: "Sentry : React"
author: "chanchan"
categories: journal
tags: [web]
image: mountains.jpg
toc: true
---

Integrating Sentry into a **React + TypeScript** web application is straightforward and can significantly enhance your ability to monitor errors and performance.

---

### **Best Practices for Integrating Sentry into a React + TypeScript Web Application**

#### **1. Project Setup**
Ensure your React + TypeScript project is set up with a modern build tool like Vite, Create React App, or Next.js. The following steps assume a typical setup with `npm` or `yarn` as the package manager.

---

#### **2. Install Sentry SDK**
Sentry provides a dedicated SDK for JavaScript applications, with specific integrations for React.

1. **Install the Sentry SDK**:
   Run the following command to install the necessary packages:

   ```bash
   npm install @sentry/react @sentry/tracing
   ```
   
   - `@sentry/react`: Core SDK for React with error boundary support.
   - `@sentry/tracing`: Optional, for performance monitoring and distributed tracing.

2. **Verify TypeScript Support**:
   The `@sentry/react` package includes TypeScript type definitions out of the box, so no additional `@types` packages are needed.

---

#### **3. Initialize Sentry**
Initialize Sentry early in your application to capture errors and performance metrics across your app.

1. **Create a Sentry Configuration File**:
   Create a file (e.g., `src/sentry.ts`) to centralize Sentry initialization:
   
   ```typescript
   import * as Sentry from '@sentry/react';
   import { BrowserTracing } from '@sentry/tracing';

   export function initSentry() {
     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
       integrations: [
         new BrowserTracing({
           // Optional: Configure tracing for specific routes
           routingInstrumentation: Sentry.reactRouterV6Instrumentation(
             // If using React Router v6
             import('react-router-dom').then((mod) => mod.useLocation),
             import('react-router-dom').then((mod) => mod.useNavigationType),
             import('react-router-dom').then((mod) => mod.createRoutesFromChildren),
             import('react-router-dom').then((mod) => mod.matchRoutes)
           ),
         }),
       ],
       environment: process.env.NODE_ENV, // e.g., 'production', 'development'
       release: process.env.REACT_APP_VERSION || 'my-app@1.0.0', // Track releases
       tracesSampleRate: 1.0, // Adjust for performance monitoring (1.0 = 100% of transactions)
       replaysSessionSampleRate: 0.1, // Optional: Session replay sampling
       replaysOnErrorSampleRate: 1.0, // Replay on errors
       debug: process.env.NODE_ENV === 'development', // Enable debug in dev
     });
   }
   ```

2. **Call Initialization in Your App**:
   Import and call `initSentry` in your main entry file (e.g., `src/index.tsx` or `src/main.tsx`):

   ```typescript
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import { initSentry } from './sentry';

   // Initialize Sentry before rendering the app
   initSentry();

   const root = ReactDOM.createRoot(document.getElementById('root')!);
   root.render(
     <React.StrictMode>
       <App />
     </React.StrictMode>
   );
   ```

3. **Get Your DSN**:
   - Log in to your Sentry account (or create one at [sentry.io](https://sentry.io)).
   - Create a new project for your React app.
   - Copy the **DSN** (Data Source Name) from the project settings and paste it into the `dsn` field in your configuration.

---

#### **4. Set Up Error Boundaries**
Sentry’s React SDK provides an `ErrorBoundary` component to catch and report errors in your component tree.

1. **Wrap Your App with ErrorBoundary**:
   Modify your `App.tsx` to include Sentry’s `ErrorBoundary`:

   ```typescript
   import * as Sentry from '@sentry/react';
   import { BrowserRouter } from 'react-router-dom'; // If using React Router
   import Routes from './Routes'; // Your routes component

   function App() {
     return (
       <Sentry.ErrorBoundary
         fallback={({ error, componentStack }) => (
           <div>
             <h1>Something went wrong.</h1>
             <p>{error.message}</p>
             <pre>{componentStack}</pre>
           </div>
         )}
         onError={(error, componentStack, eventId) => {
           console.error('ErrorBoundary caught an error:', error, componentStack);
         }}
       >
         <BrowserRouter>
           <Routes />
         </BrowserRouter>
       </Sentry.ErrorBoundary>
     );
   }

   export default App;
   ```

   - The `fallback` prop renders a custom UI when an error occurs.
   - The `onError` prop allows logging or custom handling of caught errors.

2. **Best Practice**:
   - Customize the fallback UI to match your app’s design and provide a user-friendly message.
   - Consider adding a “Report Feedback” button in the fallback UI to collect user input via Sentry’s user feedback feature.

---

#### **5. Enable Source Maps for Readable Stack Traces**
Minified JavaScript code produces unreadable stack traces. Source maps allow Sentry to map minified code back to your TypeScript source.

1. **Generate Source Maps**:
   - If using **Vite**, ensure `sourcemap: true` is set in `vite.config.ts`:

     ```typescript
     export default defineConfig({
       build: {
         sourcemap: true,
       },
     });
     ```

   - If using **Create React App**, source maps are generated by default in production builds.

2. **Upload Source Maps to Sentry**:
   Use the Sentry CLI or Webpack plugin to upload source maps during your build process.

   **Using Sentry CLI**:
   - Install the Sentry CLI:

     ```bash
     npm install -g @sentry/cli
     ```
   
   - Add a script to your `package.json` to upload source maps:
   
     ```json
     "scripts": {
       "build": "vite build",
       "sentry:upload": "sentry-cli sourcemaps upload --org YOUR_ORG --project YOUR_PROJECT dist"
     }
     ```
   
   - Set environment variables for authentication:
   
     ```bash
     export SENTRY_AUTH_TOKEN=YOUR_AUTH_TOKEN
     ```
   
   - Run the upload command after building:
   
     ```bash
     npm run build && npm run sentry:upload
     ```

   **Using Sentry Webpack Plugin**:
   - Install the plugin:
   
     ```bash
     npm install @sentry/webpack-plugin
     ```
   
   - Add the plugin to your `vite.config.ts` (via Vite’s Webpack compatibility) or Webpack config:
   
     ```typescript
     import { sentryWebpackPlugin } from '@sentry/webpack-plugin';

     export default defineConfig({
       plugins: [
         // Other plugins
         sentryWebpackPlugin({
           org: 'YOUR_ORG',
           project: 'YOUR_PROJECT',
           authToken: process.env.SENTRY_AUTH_TOKEN,
           release: process.env.REACT_APP_VERSION,
         }),
       ],
     });
     ```

3. **Best Practice**:
   - Store sensitive credentials (e.g., `SENTRY_AUTH_TOKEN`) in environment variables using a `.env` file.
   - Ensure source maps are not publicly accessible in your production build (e.g., exclude them from your `dist` folder served by your web server).

---

#### **6. Enable Performance Monitoring**
Sentry’s performance monitoring helps track slow API calls, page loads, and other transactions.

1. **Configure BrowserTracing**:
   The `BrowserTracing` integration (added in `sentry.ts`) automatically tracks page loads and navigation events if you’re using a router like React Router.

2. **Manually Capture Transactions**:
   For custom performance tracking (e.g., API calls), use Sentry’s manual transaction API:
   
   ```typescript
   import * as Sentry from '@sentry/react';

   async function fetchData() {
     const transaction = Sentry.startTransaction({ name: 'fetch-data' });
     try {
       const response = await fetch('/api/data');
       return await response.json();
     } catch (error) {
       Sentry.captureException(error);
       throw error;
     } finally {
       transaction.finish();
     }
   }
   ```

3. **Best Practice**:
   - Set `tracesSampleRate` to a lower value (e.g., `0.2` for 20% of transactions) in production to manage costs and quota usage.
   - Use distributed tracing for APIs by ensuring your backend also uses Sentry with compatible SDKs.

---

#### **7. Capture Custom Events and Context**
Enhance error reports with custom metadata and user context.

1. **Set User Context**:
   Set user information to track which users are affected by errors:
   
   ```typescript
   import * as Sentry from '@sentry/react';

   function loginUser(user: { id: string; email: string }) {
     Sentry.setUser({ id: user.id, email: user.email });
   }
   ```

2. **Add Custom Tags and Data**:
   Attach metadata to errors for better filtering:
   
   ```typescript
   Sentry.captureException(new Error('Something broke'), {
     tags: { feature: 'auth', component: 'LoginButton' },
     extra: { additionalData: 'Some context' },
   });
   ```

3. **Best Practice**:
   - Use tags to categorize errors by feature, module, or environment.
   - Scrub sensitive data (e.g., passwords, tokens) using Sentry’s `beforeSend` hook:
   
     ```typescript
     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN',
       beforeSend(event) {
         // Remove sensitive data
         if (event.request?.headers?.Authorization) {
           delete event.request.headers.Authorization;
         }
         return event;
       },
     });
     ```

---

#### **8. Test Your Integration**
1. **Trigger a Test Error**:
   Add a button to your app to throw an error and verify it appears in Sentry:
   
   ```typescript
   function TestSentry() {
     return (
       <button onClick={() => { throw new Error('Test Sentry Error'); }}>
         Test Sentry
       </button>
     );
   }
   ```

2. **Check Sentry Dashboard**:
   - Log in to Sentry and navigate to your project.
   - Verify that the test error appears with a readable stack trace and correct environment/release tags.
   - Test performance monitoring by checking the “Performance” tab for page load or API transactions.

3. **Best Practice**:
   - Test in both development and production environments to ensure proper configuration.
   - Simulate network failures or edge cases to validate error reporting.

---

#### **9. Configure Alerts and Integrations**
Set up alerts to stay informed about issues.

1. **Create Alert Rules**:
   - In Sentry, go to **Alerts** > **Create Alert Rule**.
   - Example: Notify via Slack when a new error occurs in the `production` environment with a frequency of >10 events in 5 minutes.

2. **Integrate with Tools**:
   - Connect Sentry to Slack, Jira, or PagerDuty for seamless incident management.
   - Example: Automatically create Jira tickets for high-priority errors.

3. **Best Practice**:
   - Use specific alert conditions to avoid notification fatigue (e.g., only alert on critical errors or regressions).
   - Assign issues to team members directly in Sentry to streamline triage.

---

#### **10. Monitor and Optimize**
1. **Track Release Health**:
   - Use Sentry’s release tracking to monitor crash-free sessions and user impact after deployments.
   - Configure your CI/CD pipeline to create releases in Sentry:
   
     ```bash
     sentry-cli releases new $RELEASE_VERSION
     sentry-cli releases finalize $RELEASE_VERSION
     ```

2. **Optimize Event Volume**:
   - Monitor your Sentry quota usage in the dashboard.
   - Use `tracesSampleRate` and event filtering to reduce low-value events.
   - Example: Ignore known errors using `ignoreErrors` in `Sentry.init`:
   
     ```typescript
     Sentry.init({
       dsn: 'YOUR_SENTRY_DSN',
       ignoreErrors: ['NetworkError', 'TimeoutError'],
     });
     ```

3. **Best Practice**:
   - Regularly review unresolved issues and mark them as resolved or ignored to keep your dashboard clean.
   - Use Sentry’s **Discover** feature to analyze trends and identify recurring issues.

---

#### **11. Additional Features (Optional)**
1. **Session Replay**:
   - Enable session replays to visualize user interactions before errors:
   
     ```typescript
     Sentry.init({
       integrations: [new Sentry.Replay()],
       replaysSessionSampleRate: 0.1,
       replaysOnErrorSampleRate: 1.0,
     });
     ```
   
   - Requires additional setup and quota considerations.

2. **User Feedback Widget**:
   - Add a feedback widget to collect user reports:
   
     ```typescript
     import * as Sentry from '@sentry/react';

     function showFeedbackForm() {
       Sentry.showReportDialog({
         eventId: Sentry.lastEventId(),
         title: 'Report an Issue',
         subtitle: 'Tell us what happened.',
       });
     }
     ```

---

### **Summary of Best Practices**
- **Initialize Early**: Set up Sentry at the app’s entry point to capture all errors and performance data.
- **Use ErrorBoundary**: Wrap your app to catch React-specific errors gracefully.
- **Enable Source Maps**: Upload source maps for readable stack traces in production.
- **Optimize Performance Monitoring**: Use sampling to balance insights and quota usage.
- **Add Context**: Set user data, tags, and custom metadata for better debugging.
- **Secure Data**: Scrub sensitive information and store credentials securely.
- **Test Thoroughly**: Verify integration in development and production environments.
- **Set Up Alerts**: Configure targeted alerts and integrations for efficient incident response.
- **Monitor Releases**: Track release health and associate errors with specific commits.
- **Maintain Clean Dashboard**: Regularly resolve or ignore issues to focus on critical problems.

---

### **Next Steps**
- Refer to the [Sentry React Documentation](https://docs.sentry.io/platforms/javascript/guides/react/) for advanced configuration options.
- Explore Sentry’s performance and release health features to gain deeper insights.
- If you encounter issues, check Sentry’s community forums or contact support (for hosted plans).

