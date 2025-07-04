---
layout: post
title: "Sentry : cloudflare worker"
author: "chanchan"
categories: journal
tags: [web]
image: mountains.jpg
toc: true
---

Integrating Sentry with a TypeScript Next.js project deployed on Cloudflare Pages, which operates without a Node.js environment, requires using the `@sentry/nextjs` SDK tailored for Cloudflare's edge runtime. Below is a step-by-step guide to help you set it up effectively.

---

### Steps to Integrate Sentry with a TypeScript Next.js Project on Cloudflare Pages

1. **Install the Sentry SDK**

   First, install the `@sentry/nextjs` package in your Next.js project:

   ```bash
   npm install @sentry/nextjs
   ```

   This SDK supports both browser and edge environments, which is compatible with Cloudflare Pages' edge runtime.[](https://www.npmjs.com/package/%40sentry/nextjs)

2. **Run the Sentry Wizard**

   Use the Sentry wizard to automate the setup process. Run the following command in your project directory:

   ```bash
   npx @sentry/wizard -i nextjs
   ```

   The wizard will:
   - Create configuration files: `sentry.client.config.ts`, `sentry.server.config.ts`, and `sentry.edge.config.ts`.
   - Add an example page (`/sentry-example-page`) and API route to test error tracking.
   - Update `next.config.js` with Sentry settings.
   - Create a `.sentryclirc` file with an auth token for source map uploads (added to `.gitignore`).
   - Prompt you to log into Sentry and select a project to generate a DSN (Data Source Name).[](https://dev.to/max24816/how-to-integrate-sentry-to-nextjs-application-52a0)

   After running the wizard, verify the generated files in your project root or `src` directory.

3. **Configure Sentry for Cloudflare's Edge Runtime**

   Cloudflare Pages uses the edge runtime, not Node.js, so you need to ensure Sentry is configured for the edge. The wizard generates `sentry.edge.config.ts` for this purpose. A typical configuration looks like this:

   ```typescript
   // sentry.edge.config.ts
   import * as Sentry from "@sentry/nextjs";

   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, // Use environment variable for DSN
     tracesSampleRate: 1.0, // Capture 100% of transactions for tracing
     debug: process.env.NODE_ENV === "development", // Enable debug in development
   });
   ```

   Key points:
   - Use `NEXT_PUBLIC_SENTRY_DSN` as an environment variable to securely store your DSN. Since this is a client-side variable, it’s safe for front-end exposure.[](https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/)
   - Set `tracesSampleRate` to control performance tracing (adjust in production to reduce noise, e.g., `0.2` for 20% sampling).

4. **Update `next.config.js`**

   Ensure your `next.config.js` is configured to support Sentry and Cloudflare Pages. The wizard adds Sentry’s Webpack plugin for source map uploads. You also need to ensure compatibility with Cloudflare’s edge runtime:

   ```javascript
   // next.config.js
   const { withSentryConfig } = require("@sentry/nextjs");

   const nextConfig = {
     reactStrictMode: true,
     // Ensure edge runtime is used for routes
     experimental: {
       runtime: "edge",
     },
   };

   module.exports = withSentryConfig(nextConfig, {
     org: "your-org",
     project: "your-project",
     authToken: process.env.SENTRY_AUTH_TOKEN, // For source map uploads
     silent: true, // Suppress logs during build
     widenClientFileUpload: true, // Upload more source maps for better stack traces
     hideSourceMaps: true, // Hide source maps from client bundles
   });
   ```

   Add `SENTRY_AUTH_TOKEN` to your environment variables for source map uploads.[](https://www.shubhdeepchhabra.in/blog/sentry-for-nextjs-portfolio)

5. **Set Up Environment Variables**

   In Cloudflare Pages, add the following environment variables in the Cloudflare dashboard under `Settings > Environment Variables`:
   - `NEXT_PUBLIC_SENTRY_DSN`: Your Sentry DSN from the Sentry dashboard.
   - `SENTRY_AUTH_TOKEN`: Your Sentry auth token for source map uploads (found in Sentry’s project settings or `.sentryclirc`).

   For local development, add these to your `.env.local` file:

   ```env
   NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@o123.ingest.sentry.io/123
   SENTRY_AUTH_TOKEN=your-auth-token
   ```

   Note: `NEXT_PUBLIC_` prefix is required for client-side variables in Next.js.[](https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/)

6. **Configure Source Maps for Cloudflare**

   Since Cloudflare Pages doesn’t use Node.js, source maps are critical for readable stack traces. The Sentry wizard configures source map uploads, but you need to ensure your build process supports Cloudflare’s requirements. Install the Cloudflare Next.js adapter:

   ```bash
   npm install --save-dev @cloudflare/next-on-pages
   ```

   Update your `package.json` scripts to build for Cloudflare Pages:

   ```json
   {
     "scripts": {
       "dev": "next dev",
       "build": "next build",
       "pages:build": "npx @cloudflare/next-on-pages",
       "deploy": "npm run pages:build"
     }
   }
   ```

   Add the `nodejs_compat` flag in your Cloudflare Pages settings (`Settings > Bindings > Compatibility Flags`) to ensure compatibility with Sentry’s AsyncLocalStorage requirements.[](https://docs.sentry.io/platforms/javascript/guides/cloudflare/)[](https://medium.com/%40valoherie/how-to-host-and-deploy-next-js-app-on-cloudflare-a224b06d73d3)

7. **Add Sentry Middleware for Cloudflare Pages**

   To capture errors across your application, add the Sentry Pages Plugin as middleware in `functions/_middleware.ts`:

   ```typescript
   // functions/_middleware.ts
   import * as Sentry from "@sentry/nextjs";

   export const onRequest = [
     Sentry.sentryPagesPlugin({
       dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
       tracesSampleRate: 1.0,
     }),
     // Add other middlewares here
   ];
   ```

   If you need to access environment variables dynamically, use a function:

   ```typescript
   export const onRequest = Sentry.sentryPagesPlugin((context) => ({
     dsn: context.env.NEXT_PUBLIC_SENTRY_DSN,
     tracesSampleRate: 1.0,
   }));
   ```

   Ensure this middleware is the first in the array to capture all exceptions in the execution chain.[](https://www.npmjs.com/package/%40sentry/cloudflare)[](https://developers.cloudflare.com/pages/functions/plugins/sentry/)

8. **Test Sentry Integration**

   The Sentry wizard creates an example page (`/sentry-example-page`) with a button to trigger a test error. Visit this page in your local development environment (`next dev`) or after deployment to Cloudflare Pages:

   - Open `http://localhost:3000/sentry-example-page` (or your deployed URL).
   - Click the “Throw error” button to trigger a test error.
   - Check your Sentry dashboard (`sentry.io`) under the Issues page to verify the error was captured.[](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

   You can also manually capture errors in your code:

   ```typescript
   import * as Sentry from "@sentry/nextjs";

   try {
     // Your code
     throw new Error("Test error");
   } catch (error) {
     Sentry.captureException(error);
   }
   ```

9. **Deploy to Cloudflare Pages**

   Deploy your Next.js app to Cloudflare Pages using either the Cloudflare dashboard or CLI:

   - **Via Dashboard**: Connect your GitHub repository in the Cloudflare Pages tab, select your branch, and configure build settings (use `npm run pages:build` as the build command).[](https://medium.com/%40valoherie/how-to-host-and-deploy-next-js-app-on-cloudflare-a224b06d73d3)
   - **Via CLI**: Run `npx @cloudflare/next-on-pages` to build, then deploy using `wrangler pages deploy`.

   Ensure the `nodejs_compat` compatibility flag is enabled in Cloudflare Pages settings.[](https://medium.com/%40valoherie/how-to-host-and-deploy-next-js-app-on-cloudflare-a224b06d73d3)

10. **Verify and Monitor**

    After deployment, visit your deployed app, trigger errors, and check the Sentry dashboard for captured errors and performance traces. Use Sentry’s Issues, Traces, and Replays pages to analyze errors and performance metrics.[](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

### Additional Notes

- **Edge Runtime Limitation**: Cloudflare Pages uses the edge runtime, so avoid Node.js-specific APIs in your Sentry configuration (e.g., `fs` or Node.js-only `@sentry/node` integrations). The `@sentry/nextjs` SDK handles this automatically.[](https://stackoverflow.com/questions/57195586/integrating-sentry-in-next-js-project)
- **Source Maps**: Ensure source maps are uploaded correctly for readable stack traces. The `SENTRY_AUTH_TOKEN` and `withSentryConfig` in `next.config.js` handle this. If stack traces are unreadable, verify the `widenClientFileUpload` option and check your build logs.[](https://docs.sentry.io/platforms/javascript/guides/cloudflare/)
- **Performance Monitoring**: Adjust `tracesSampleRate` in production to balance performance data collection and Sentry quota usage. A value of `0.2` is often sufficient.[](https://codingcat.dev/podcast/how-to-add-sentry-to-next-js-the-right-way)
- **Troubleshooting**: If errors aren’t appearing in Sentry, ensure the DSN is correct, the middleware is loaded first, and the `nodejs_compat` flag is set. Enable `debug: true` in Sentry’s configuration for local debugging.[](https://github.com/getsentry/sentry-javascript/issues/11920)

---

### Example Manual Error Capture

To capture custom events or add context:

```typescript
import * as Sentry from "@sentry/nextjs";

// Set user context
Sentry.setUser({ id: "user123", email: "user@example.com" });

// Add breadcrumbs
Sentry.addBreadcrumb({
  message: "User clicked checkout",
  category: "user.action",
});

// Capture a manual error
Sentry.captureException(new Error("Custom error in checkout flow"));
```

This helps provide richer context in Sentry’s dashboard.[](https://www.npmjs.com/package/%40sentry/nextjs)

---

