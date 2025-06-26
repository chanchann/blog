---
layout: post
title: "Sentry : Nextjs"
author: "chanchan"
categories: journal
tags: [business thinking]
image: mountains.jpg
toc: true
---

Integrating Sentry with a Next.js application for both frontend and backend error tracking and performance monitoring is a powerful way to gain insights into your application’s health. Below, I’ll provide a detailed, step-by-step guide on how to set up Sentry in a Next.js project, covering both the frontend (client-side) and backend (server-side), along with key concepts and best practices. The explanation will be in English, as requested, and will include code examples, configuration details, and advanced features to ensure comprehensive understanding.

---

### **Overview of Sentry and Next.js Integration**

Sentry is an error tracking and performance monitoring platform that helps developers identify, debug, and resolve issues in real time. It provides features like error tracking, performance monitoring (via distributed tracing), session replays, and logging. Next.js, a React-based framework, supports both client-side rendering (CSR), server-side rendering (SSR), and API routes, making it a hybrid framework. Integrating Sentry with Next.js allows you to monitor errors and performance across the entire application stack—frontend, backend, and edge runtime.

Key Sentry features for Next.js:
- **Error Tracking**: Capture unhandled exceptions and custom errors on both client and server.
- **Performance Monitoring**: Track page load times, API route performance, and distributed traces.
- **Session Replay**: Visualize user interactions to debug issues.
- **Logging**: Centralize application logs for correlation with errors.
- **Distributed Tracing**: Follow requests from frontend to backend for end-to-end visibility.

---

### **Step-by-Step Integration Guide**

#### **Step 1: Install the Sentry SDK**
To begin, install the Sentry Next.js SDK, which is specifically designed for Next.js and handles both client-side and server-side configurations.

Run the following command in your Next.js project directory:

```bash
npm install @sentry/nextjs
```

Alternatively, if you use Yarn:

```bash
yarn add @sentry/nextjs
```

The `@sentry/nextjs` package is tailored for Next.js and includes integrations for client-side (browser) and server-side (Node.js) environments, as well as support for Next.js-specific features like API routes and middleware.

#### **Step 2: Run the Sentry Wizard (Optional but Recommended)**
Sentry provides a wizard to automate the setup process. Run the following command:

```bash
npx @sentry/wizard -i nextjs
```

The wizard will:
- Prompt you to log in to your Sentry account and select a project.
- Create configuration files: `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`.
- Update `next.config.js` to include Sentry’s Webpack plugin for source map uploads.
- Add example files (e.g., `/app/api/sentry-example-api/route.js` and `/app/sentry-example-page/page.jsx`) to test error tracking.
- Provide a DSN (Data Source Name) for your Sentry project.

If you prefer manual setup, proceed to the next steps.

#### **Step 3: Configure Sentry for Frontend and Backend**

Sentry requires separate configurations for client-side (browser), server-side (Node.js), and edge runtime (if applicable). These configurations are typically stored in the following files:

1. **`sentry.client.config.ts` (Frontend)**:
   This file configures Sentry for client-side error tracking and performance monitoring. It runs in the browser when a user loads a page.

   ```javascript
   // sentry.client.config.ts
   import * as Sentry from '@sentry/nextjs';

   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, // Use environment variable
     tracesSampleRate: 1.0, // Capture 100% of transactions for tracing (adjust in production)
     replaysSessionSampleRate: 0.1, // Capture 10% of sessions for replay
     replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with errors
     integrations: [
       Sentry.replayIntegration({
         maskAllText: true, // Mask sensitive data in replays
         blockAllMedia: true, // Block media in replays
       }),
       Sentry.browserTracingIntegration(), // Enable performance tracing
     ],
     debug: process.env.NODE_ENV === 'development', // Enable debug logs in development
   });
   ```

   **Key Options**:
   - `dsn`: Your Sentry project’s DSN (public for client-side). Store it in `.env.local` as `NEXT_PUBLIC_SENTRY_DSN`.
   - `tracesSampleRate`: Controls the percentage of transactions sent to Sentry for performance monitoring. Set to `1.0` for development, lower (e.g., `0.2`) in production to reduce costs.
   - `replaysSessionSampleRate` and `replaysOnErrorSampleRate`: Control session replay sampling.
   - `integrations`: Enable features like `browserTracingIntegration` for performance and `replayIntegration` for session replays.
   - `debug`: Enable verbose logging during development.

2. **`sentry.server.config.ts` (Backend)**:
   This file configures Sentry for server-side environments, such as API routes and server-side rendering.

   ```javascript
   // sentry.server.config.ts
   import * as Sentry from '@sentry/nextjs';

   Sentry.init({
     dsn: process.env.SENTRY_DSN, // Use environment variable
     tracesSampleRate: 1.0, // Capture 100% of transactions
     debug: process.env.NODE_ENV === 'development',
     integrations: [], // Add server-specific integrations (e.g., Prisma)
     _experiments: {
       enableLogs: true, // Enable logging to Sentry
     },
   });
   ```

   **Key Options**:
   - `dsn`: Use a private DSN for server-side (store in `.env.local` as `SENTRY_DSN`).
   - `integrations`: Add server-specific integrations, such as `Sentry.Integrations.Prisma` for database query monitoring.
   - `_experiments.enableLogs`: Enable sending logs to Sentry (experimental feature).

3. **`sentry.edge.config.ts` (Optional for Edge Runtime)**:
   This file is used for Next.js middleware or edge functions. It’s optional unless you use edge runtime.

   ```javascript
   // sentry.edge.config.ts
   import * as Sentry from '@sentry/nextjs';

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     tracesSampleRate: 1.0,
     debug: process.env.NODE_ENV === 'development',
   });
   ```

4. **Environment Variables**:
   Store your DSNs in `.env.local`:

   ```env
   NEXT_PUBLIC_SENTRY_DSN=https://your-public-dsn@o0.ingest.sentry.io/0
   SENTRY_DSN=https://your-private-dsn@o0.ingest.sentry.io/0
   ```

   - Use `NEXT_PUBLIC_` prefix for client-side variables, as Next.js requires this for browser-exposed variables.
   - Keep the server-side DSN private to avoid exposure.

#### **Step 4: Update `next.config.js`**
To enable source map uploads and optimize Sentry integration, update your `next.config.js` to include the Sentry Webpack plugin:

```javascript
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withSentryConfig(nextConfig, {
  org: 'your-org-slug',
  project: 'your-project-slug',
  silent: !process.env.CI, // Suppress logs outside CI
  disableLogger: true, // Tree-shake Sentry logger to reduce bundle size
});
```

**Key Options**:
- `org` and `project`: Your Sentry organization and project slugs.
- `silent`: Suppresses logs in non-CI environments.
- `disableLogger`: Reduces bundle size by removing unnecessary logging.

If the wizard created a `next.config.wizardcopy.js`, manually merge its contents into `next.config.js`.

#### **Step 5: Capture Errors**
Sentry automatically captures unhandled exceptions, but you can also manually capture errors or add context.

1. **Frontend Error Handling**:
   For client-side errors, create a global error boundary in `app/global-error.tsx` (for Next.js App Router):

   ```javascript
   // app/global-error.tsx
   'use client';
   import * as Sentry from '@sentry/nextjs';
   import NextError from 'next/error';
   import { useEffect } from 'react';

   export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
     useEffect(() => {
       Sentry.captureException(error);
     }, [error]);

     return (
       <html>
         <body>
           <NextError statusCode={0} />
         </body>
       </html>
     );
   }
   ```

   For testing, add a button to trigger an error:

   ```javascript
   // app/sentry-example-page/page.jsx
   'use client';
   export default function Page() {
     return (
       <button
         type="button"
         onClick={() => {
           throw new Error('Sentry Frontend Error');
         }}
       >
         Throw Error
       </button>
     );
   }
   ```

2. **Backend Error Handling**:
   For API routes, wrap handlers with Sentry’s `withSentry` or manually capture errors:

   ```javascript
   // app/api/sentry-example-api/route.ts
   import { withSentry } from '@sentry/nextjs';
   import { NextResponse } from 'next/server';

   async function handler(req: Request) {
     throw new Error('Sentry Example API Route Error');
     return NextResponse.json({ name: 'Example' });
   }

   export const GET = withSentry(handler);
   ```

   Alternatively, use a try-catch block:

   ```javascript
   // app/api/some-route/route.ts
   import * as Sentry from '@sentry/nextjs';
   import { NextResponse } from 'next/server';

   export async function GET(req: Request) {
     try {
       // Your logic here
       return NextResponse.json({ data: 'Success' });
     } catch (error) {
       Sentry.captureException(error);
       await Sentry.flush(2000); // Ensure errors are sent before response
       throw error;
     }
   }
   ```

3. **Server Component Error Handling** (Next.js 15+):
   For React Server Components, use the `onRequestError` hook in `instrumentation.ts`:

   ```javascript
   // instrumentation.ts
   import * as Sentry from '@sentry/nextjs';
   import type { Instrumentation } from 'next';

   export const onRequestError: Instrumentation.onRequestError = (...args) => {
     Sentry.captureRequestError(...args);
   };
   ```

#### **Step 6: Enable Logging**
Sentry supports logging integration to centralize application logs. Enable it in `sentry.server.config.ts` or `sentry.client.config.ts`:

```javascript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  _experiments: {
    enableLogs: true,
  },
  integrations: [
    Sentry.consoleLoggingIntegration({
      levels: ['log', 'error', 'warn'], // Capture console.log, console.error, etc.
    }),
  ],
});
```

Use the logger for structured logging:

```javascript
const { logger } = Sentry;
logger.fmt`User {userId} failed to login due to {error}`;
```

#### **Step 7: Test and Deploy**
- **Test Locally**: Run `npm run dev` and trigger errors (e.g., click the error button or call the API route). Check your Sentry dashboard to confirm errors are reported.
- **Deploy**: If deploying to Vercel, add the `SENTRY_AUTH_TOKEN` environment variable in Vercel’s project settings (found in your Sentry project’s settings or `.sentryclirc` file). This enables source map uploads for better stack traces.
- **Verify**: Check the Sentry dashboard for errors, performance metrics, and session replays.

---

### **Key Knowledge Points**

1. **Distributed Tracing**:
   - Sentry’s distributed tracing tracks requests across frontend and backend. Enable it with `Sentry.browserTracingIntegration()` (client) and appropriate server-side configurations.
   - Configure `tracePropagationTargets` to include your API endpoints:

     ```javascript
     // sentry.client.config.ts
     Sentry.init({
       tracePropagationTargets: ['https://yourdomain.com', /^\/api\//],
     });
     ```

   - Ensure all services in your stack use Sentry for full trace propagation.[](https://docs.sentry.io/platforms/javascript/guides/nextjs/tracing/trace-propagation/)

2. **Session Replay**:
   - Session replays capture user interactions as video-like reproductions to debug issues.
   - Configure with `replayIntegration` and adjust `replaysSessionSampleRate` and `replaysOnErrorSampleRate` to balance quota usage.[](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

3. **Performance Monitoring**:
   - Sentry tracks page load times, API route performance, and database queries (e.g., with Prisma integration).
   - Use `tracesSampleRate` to control sampling. Lower it in production to reduce costs while maintaining sufficient data.[](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

4. **Error Context and Breadcrumbs**:
   - Add context to errors using `Sentry.setTag`, `Sentry.setUser`, or `Sentry.setContext`:

     ```javascript
     Sentry.setUser({ id: '123', email: 'user@example.com' });
     Sentry.setTag('environment', 'production');
     Sentry.addBreadcrumb({ message: 'User clicked checkout' });
     ```

   - Breadcrumbs provide a trail of user actions leading to an error, aiding debugging.[](https://www.npmjs.com/package/%40sentry/nextjs)

5. **Source Maps**:
   - Sentry uses source maps to map minified production code to readable source code. The `withSentryConfig` Webpack plugin uploads source maps during builds. Ensure `SENTRY_AUTH_TOKEN` is set for CI/CD pipelines.[](https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/)

6. **Self-Hosted vs. SaaS**:
   - For self-hosted Sentry, remove the `tunnelRoute` option in `next.config.js`, as it’s designed for Sentry’s SaaS solution and may cause issues (e.g., 405 errors with nginx).[](https://github.com/getsentry/sentry-javascript/discussions/10140)

7. **Single vs. Multiple Projects**:
   - Use a single Sentry project with one DSN for both frontend and backend to simplify distributed tracing and reduce context-switching in the Sentry dashboard.
   - Separate projects for development and production to isolate environments.[](https://github.com/getsentry/sentry/issues/62029)

8. **Integrations**:
   - Sentry supports integrations like `Sentry.Integrations.Prisma` for database query monitoring or `Sentry.consoleLoggingIntegration` for logging. Lazy-load integrations to reduce bundle size if needed.[](https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/integrations/)

9. **Ad Blocker Issues**:
   - Sentry’s scripts may be blocked by ad blockers. Use the `tunnelRoute` option in `next.config.js` to proxy events through your domain, or inform users about potential issues.[](https://codingcat.dev/podcast/how-to-add-sentry-to-next-js-the-right-way)

---

### **Best Practices**

- **Environment Separation**: Create separate Sentry projects for development and production to avoid mixing error data. Use environment variables to switch DSNs dynamically.
- **Optimize Sampling Rates**: Set `tracesSampleRate` and `replaysSessionSampleRate` to lower values in production (e.g., `0.2` and `0.1`) to manage costs while capturing meaningful data.
- **Secure DSNs**: Store DSNs in environment variables and never hardcode them. Use `NEXT_PUBLIC_` for client-side DSNs only.
- **Test Errors Early**: Use Sentry’s example files or manually trigger errors to verify integration before deploying.
- **Monitor Quotas**: Session replays and high `tracesSampleRate` can consume quotas quickly. Monitor usage in the Sentry dashboard and adjust settings as needed.
- **Use Alerts**: Configure Sentry alerts (e.g., via Slack or email) for critical errors to enable rapid response.[](https://dev.to/turingvangisms/nextjs-sentry-5ha4)

---

### **Common Issues and Solutions**

1. **Errors Not Appearing in Sentry**:
   - Verify DSNs are correct and environment variables are loaded.
   - Ensure `Sentry.init` is called in the correct files.
   - Check for ad blockers or network issues blocking Sentry’s API.

2. **Self-Hosted Sentry Issues**:
   - Remove `tunnelRoute` from `next.config.js` if using a self-hosted Sentry instance.[](https://github.com/getsentry/sentry-javascript/discussions/10140)

3. **Performance Impact**:
   - Sentry is designed to be non-blocking and has minimal performance impact. Adjust sampling rates to reduce overhead.[](https://sentry.io/for/nextjs/)

4. **Module Not Found Errors**:
   - Ensure `@sentry/nextjs` is compatible with your Next.js version (e.g., `@sentry/nextjs@9.32.0` for Next.js 15).[](https://www.npmjs.com/package/%40sentry/nextjs)

---

### **Advanced Features**

1. **Cron Monitoring**:
   - Monitor scheduled tasks (e.g., Vercel cron jobs) to ensure they run without errors. Configure via Sentry’s cron monitoring integration.[](https://sentry.io/for/nextjs/)

2. **Hydration Error Debugging**:
   - Sentry’s hydration error diff tools help identify mismatches between server-rendered and client-rendered HTML. Enable via `browserTracingIntegration`.[](https://sentry.io/for/nextjs/)

3. **Custom Integrations**:
   - Add third-party filters to reduce noise from external libraries:

     ```javascript
     import { Integrations } from '@sentry/nextjs';
     Sentry.init({
       integrations: [new Integrations.ThirdPartyFilter({ filterKeys: ['third-party-lib'] })],
     });
     ```

   - Lazy-load integrations to optimize bundle size:

     ```javascript
     import('@sentry/nextjs').then((lazyLoadedSentry) => {
       Sentry.addIntegration(lazyLoadedSentry.replayIntegration());
     });
     ```

    [](https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/integrations/)

4. **Feedback Integration**:
   - Allow users to submit feedback directly to Sentry:

     ```javascript
     Sentry.init({
       integrations: [
         Sentry.feedbackIntegration({
           colorScheme: 'system',
         }),
       ],
     });
     ```

    [](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

### **Conclusion**

Integrating Sentry with Next.js provides comprehensive error tracking and performance monitoring for both frontend and backend. By following the steps above—installing the SDK, configuring client and server files, updating `next.config.js`, and leveraging advanced features like distributed tracing and session replays—you can gain deep insights into your application’s behavior. Always test your setup locally and in production, optimize sampling rates, and use environment-specific projects to keep your monitoring clean and effective.

For further details, refer to:
- Sentry’s official Next.js documentation: https://docs.sentry.io/platforms/javascript/guides/nextjs/[](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- Sentry pricing and quotas: https://sentry.io/pricing/[](https://sentry.io/for/nextjs/)
- API documentation for custom integrations: https://x.ai/api

