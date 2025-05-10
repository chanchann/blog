---
layout: post
title: "Sentry : React Native(Expo)"
author: "chanchan"
categories: journal
tags: [web]
image: mountains.jpg
toc: true
---

Integrating **Sentry** into a **React Native** app built with **Expo** and setting it up in a **CI/CD** pipeline requires some specific configurations due to Expo’s managed workflow and build process. 

---

### **Key Differences for Expo**

1. **Managed Workflow**:
   - Expo’s managed workflow abstracts native code (iOS/Android), so you don’t directly modify `ios/` or `android/` directories.
   - Sentry’s native crash reporting requires additional setup for Expo, as native modules are handled differently.
   - Expo uses its own build service (EAS Build) or Turtle CLI for generating native binaries.

2. **Source Maps and Artifacts**:
   - Expo generates JavaScript bundles and source maps differently, requiring specific commands to export and upload them to Sentry.
   - For native crash symbolication, you need to upload artifacts like dSYMs (iOS) or Proguard mappings (Android) from Expo’s build outputs.

3. **CI/CD Pipeline**:
   - Expo apps typically use **EAS Build** for CI/CD, which integrates with Sentry for automated source map and artifact uploads.
   - Configuration focuses on Expo CLI, EAS CLI, and Sentry CLI in the pipeline, rather than direct Xcode or Gradle modifications.

4. **Native Crash Reporting**:
   - Expo’s managed workflow limits direct access to native code, but Sentry’s React Native SDK supports Expo via the `@sentry/react-native` package with EAS Build or custom dev clients.

---

### **Best Practices for Sentry with Expo**

#### **1. Install and Configure Sentry**
The initial setup is similar to the React Native guide, but with Expo-specific considerations.

1. **Install Sentry SDK**:
   Install the Sentry React Native SDK:

   ```bash
   npm install @sentry/react-native
   ```
   
   - No native linking is required for Expo’s managed workflow, as Expo handles native dependencies.

2. **Run Sentry Wizard**:
   Use the Sentry Wizard to streamline setup:

   ```bash
   npx @sentry/wizard -i reactNative
   ```

   - The wizard will:
     - Create a `sentry.properties` file.
     - Prompt for your Sentry DSN and project.
     - Add example code to your app.
   - For Expo, the wizard may not modify `ios/` or `android/` (since they’re managed), but it sets up JavaScript-level integration.

3. **Initialize Sentry**:
   Create a `sentry.ts` file for initialization, as shown in the previous guide:

```typescript
import * as Sentry from '@sentry/react-native';
import { Integrations } from '@sentry/tracing';

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN || 'YOUR_SENTRY_DSN', // Use env variable
    integrations: [
      new Integrations.ReactNativeTracing({
        routingInstrumentation: new Sentry.ReactNavigationInstrumentation(),
      }),
    ],
    environment: process.env.NODE_ENV || 'development',
    release: `my-app@${process.env.EXPO_APP_VERSION || '1.0.0'}`, // Dynamic version from Expo
    tracesSampleRate: 1.0, // Adjust for production
    enableNative: true, // Required for native crash reporting
    enableNativeCrashHandling: true,
    debug: process.env.NODE_ENV === 'development',
  });
}
```

   - **Expo-Specific Notes**:
     - Use `process.env.EXPO_APP_VERSION` to dynamically set the `release` field, matching your `app.json` or `package.json` version.
     - Ensure `enableNative: true` for native crash reporting, which works with EAS Build or custom dev clients.

4. **Integrate in App**:
   Initialize Sentry in your `App.tsx` and set up an error boundary, as shown previously:

```typescript
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { initSentry } from './sentry';
import RootNavigator from './navigation/RootNavigator';

initSentry();

export default function App() {
  const navigationRef = React.useRef(null);

  useEffect(() => {
    Sentry.getCurrentHub()
      .getIntegration(Sentry.ReactNavigationInstrumentation)
      .registerNavigationContainer(navigationRef);
  }, []);

  return (
    <Sentry.ErrorBoundary
      fallback={({ error, componentStack }) => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong!</Text>
          <Text>{error.message}</Text>
          <Text>{componentStack}</Text>
        </View>
      )}
    >
      <NavigationContainer ref={navigationRef}>
        <RootNavigator />
      </NavigationContainer>
    </Sentry.ErrorBoundary>
  );
}
```

5. **Use Environment Variables**:
   Store your DSN securely using `react-native-dotenv` or Expo’s configuration:
   - Install `react-native-dotenv`:

     ```bash
     npm install react-native-dotenv
     ```
   
   - Add to `babel.config.js`:
   
     ```javascript
     module.exports = {
       presets: ['module:metro-react-native-babel-preset'],
       plugins: [
         ['module:react-native-dotenv', {
           moduleName: '@env',
           path: '.env',
         }],
       ],
     };
     ```

   - Create a `.env` file:
     
     ```
     SENTRY_DSN=https://your-dsn@sentry.io/123
     EXPO_APP_VERSION=1.0.0
     
     ```
   - Import in `sentry.ts`:
     
     ```typescript
     import { SENTRY_DSN } from '@env';
     Sentry.init({ dsn: SENTRY_DSN, ... });
     ```

6. **Best Practices**:
   - Use `app.json` or `app.config.js` to define your app version and ensure it matches the `release` in Sentry.
   - Test initialization in development using Expo Go (JavaScript errors only) and in a production build for native crashes.

---

#### **2. Enable Native Crash Reporting**
Expo’s managed workflow requires EAS Build or a custom dev client for native crash reporting, as Expo Go does not support native modules.

1. **Use EAS Build**:
   - Set up **Expo Application Services (EAS)** for building your app:
     
     ```bash
     npm install -g eas-cli
     eas login
     eas build:configure
     ```
   
   - Create an `eas.json` file to define build profiles:
     
     ```json
     {
       "build": {
         "production": {
           "releaseChannel": "production",
           "distribution": "store",
           "env": {
             "SENTRY_DSN": "https://your-dsn@sentry.io/123",
             "EXPO_APP_VERSION": "1.0.0"
           }
         },
         "preview": {
           "releaseChannel": "preview",
           "distribution": "internal"
         }
       }
     }
     ```

   - Run a build:
     
     ```bash
     eas build --platform all --profile production
     ```

2. **Enable Native Crashes**:
   - Ensure `enableNative: true` in your Sentry configuration.
   - With EAS Build, Sentry’s native crash reporting is automatically enabled, as the `@sentry/react-native` SDK includes native dependencies.

3. **Custom Dev Client (Optional)**:
   - If you need native modules in development, create a custom dev client:
     
     ```bash
     expo prebuild
     expo run:ios
     expo run:android
     ```
   
   - This generates `ios/` and `android/` directories, allowing native crash testing in development.

4. **Best Practices**:
   - Test native crashes in a production build, as Expo Go does not support native crash reporting.
   - Use EAS Build for consistent production builds with Sentry integration.
   - Verify native crash reporting by triggering a test crash (see below).

---

#### **3. Source Maps and Symbolication**
Expo handles JavaScript bundles and native artifacts differently, requiring specific steps for source maps and symbolication.

1. **Generate and Upload JavaScript Source Maps**:
   - Export your app bundle with source maps:
     
     ```bash
     expo export --dev --sourcemaps
     ```
     
     - This generates a `dist/` folder with bundles and source maps (e.g., `ios/index.bundle` and `ios/index.bundle.map`).
   - Upload source maps to Sentry using Sentry CLI:
     
     ```bash
     npm install -g @sentry/cli
     export SENTRY_AUTH_TOKEN=YOUR_AUTH_TOKEN
     sentry-cli sourcemaps upload \
       --org YOUR_ORG \
       --project YOUR_PROJECT \
       --release my-app@1.0.0 \
       ./dist
     ```

2. **Upload Native Artifacts**:
   - **iOS (dSYMs)**:
     - After an EAS Build, download the build artifacts:
       
       ```bash
       eas build --platform ios --profile production
       ```
     
     - Extract dSYMs from the `.ipa` or build artifacts (usually in a `.dSYM` folder).
     - Upload to Sentry:
       
       ```bash
       sentry-cli upload-dif \
         --org YOUR_ORG \
         --project YOUR_PROJECT \
         ./path/to/dSYMs
       ```

   - **Android (Proguard Mappings)**:
     - If using code obfuscation, retrieve Proguard mappings from EAS Build artifacts (in `android/app/build/outputs/mapping/`).
     - Upload to Sentry:

       ```bash
       sentry-cli upload-proguard \
         --org YOUR_ORG \
         --project YOUR_PROJECT \
         ./path/to/mapping.txt
       ```

3. **Automate in CI/CD**:
   See the CI/CD section below for integrating source map and artifact uploads into your pipeline.

4. **Best Practices**:
   - Ensure the `release` name in Sentry matches your app version (e.g., `my-app@1.0.0`).
   - Upload source maps and artifacts for every build to ensure readable stack traces.
   - Store `SENTRY_AUTH_TOKEN` securely in your CI/CD environment variables.

---

#### **4. CI/CD Configuration with Expo**
Expo apps typically use **EAS Build** in CI/CD pipelines (e.g., GitHub Actions, CircleCI). Below is a guide to configure Sentry in a CI/CD pipeline, focusing on differences from a standard React Native setup.

1. **Set Up GitHub Actions**:
   Create a `.github/workflows/build.yml` file for your pipeline:

```yaml
name: Build and Deploy with Sentry

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Install EAS CLI
        run: npm install -g eas-cli

      - name: Install Sentry CLI
        run: npm install -g @sentry/cli

      - name: Configure EAS
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
        run: eas login

      - name: Build iOS and Android
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: your-org
          SENTRY_PROJECT: your-project
          APP_VERSION: ${{ github.sha }} # Or use package.json version
        run: |
          eas build --platform all --profile production --non-interactive
          # Export bundle with source maps
          expo export --dev --sourcemaps
          # Create Sentry release
          sentry-cli releases new my-app@$APP_VERSION
          # Upload source maps
          sentry-cli sourcemaps upload \
            --org $SENTRY_ORG \
            --project $SENTRY_PROJECT \
            --release my-app@$APP_VERSION \
            ./dist
          # Upload dSYMs (iOS)
          sentry-cli upload-dif \
            --org $SENTRY_ORG \
            --project $SENTRY_PROJECT \
            ./path/to/dSYMs
          # Upload Proguard mappings (Android, if applicable)
          sentry-cli upload-proguard \
            --org $SENTRY_ORG \
            --project $SENTRY_PROJECT \
            ./path/to/mapping.txt
          # Finalize release
          sentry-cli releases finalize my-app@$APP_VERSION

      - name: Submit to App Store/Play Store (Optional)
        run: eas submit --platform all
```

2. **Store Secrets**:
   - Add the following secrets in your GitHub repository settings:
     - `EXPO_TOKEN`: Generate via `eas login` and copy the token.
     - `SENTRY_AUTH_TOKEN`: Generate from Sentry’s account settings.
     - `SENTRY_ORG` and `SENTRY_PROJECT`: Your Sentry organization and project slugs.

3. **Key CI/CD Differences for Expo**:
   - **EAS Build**: Use `eas build` instead of direct Xcode/Gradle builds. This handles native compilation and artifact generation.
   - **Source Map Export**: Use `expo export --sourcemaps` to generate bundles and source maps, as Expo manages the bundling process.
   - **Artifact Retrieval**: Download dSYMs and Proguard mappings from EAS Build artifacts (via `eas build:download` or the EAS dashboard).
   - **Release Creation**: Automate Sentry release creation with `sentry-cli releases new` to match your app version.
   - **Dynamic Versioning**: Use `github.sha` or `package.json` version for the `release` field to ensure unique releases per build.

4. **Best Practices for CI/CD**:
   - Run `expo export` in the same environment as your EAS Build to ensure bundle consistency.
   - Use `--non-interactive` for EAS commands in CI/CD to avoid prompts.
   - Cache dependencies (e.g., `npm cache`) to speed up builds.
   - Test your pipeline with a preview build before deploying to production.
   - Monitor Sentry’s quota usage in CI/CD logs to avoid exceeding limits.

---

#### **5. Test Your Integration**
1. **Test JavaScript Errors**:
   Add a test button to trigger a JavaScript error:

   ```typescript
   import * as Sentry from '@sentry/react-native';

   function TestSentry() {
     return (
       <Button
         title="Test Sentry"
         onPress={() => {
           throw new Error('Test Sentry Error');
         }}
       />
     );
   }
   ```

2. **Test Native Crashes**:
   - Native crashes require an EAS Build or custom dev client (not Expo Go).
   - Trigger a native crash using:

     ```typescript
     import * as Sentry from '@sentry/react-native';
     Sentry.nativeCrash();
     ```

   - Build and run the app via EAS:
     
     ```bash
     eas build --platform ios --profile production
     ```

   - Verify the crash in Sentry’s dashboard.

3. **Test in Expo Go**:
   - Expo Go supports JavaScript error tracking but not native crashes.
   - Use `expo start` and test JavaScript errors to verify basic setup.

4. **Best Practices for Testing**:
   - Test JavaScript errors in Expo Go during development.
   - Test native crashes in a production build via EAS.
   - Verify source maps and symbolication by checking stack traces in Sentry.
   - Simulate offline scenarios to ensure events are cached and synced.

---

#### **6. Additional Expo-Specific Configurations**
1. **Update `app.json`**:
   Ensure your `app.json` or `app.config.js` includes the correct version and build settings:

   ```json
   {
     "expo": {
       "name": "MyApp",
       "slug": "my-app",
       "version": "1.0.0",
       "sentry": {
         "hooks": true
       }
     }
   }
   ```

   - The `sentry.hooks` field enables Sentry’s auto-instrumentation during EAS builds.

2. **Performance Monitoring**:
   - The `ReactNativeTracing` integration works the same as in the React Native guide.
   - For React Navigation, ensure the navigation ref is registered (see previous `App.tsx` example).
   - Monitor **App Start** and **Slow/Frozen Frames** in Sentry, as these are critical for mobile UX.

3. **User Feedback**:
   Add a feedback form, as shown previously:

   ```typescript
   import * as Sentry from '@sentry/react-native';

   function showFeedbackForm() {
     Sentry.showReportDialog({
       eventId: Sentry.lastEventId(),
       title: 'Report an Issue',
     });
   }
   ```

4. **Best Practices**:
   - Use EAS Build for production to ensure native crash reporting and performance tracking.
   - Sync your `app.json` version with Sentry’s `release` field.
   - Customize the feedback form to match your app’s branding.

---

#### **7. Monitor and Optimize**
1. **Track Release Health**:
   - Use Sentry’s release tracking to monitor crash-free sessions:

     ```bash
     sentry-cli releases new my-app@1.0.0
     sentry-cli releases set-commits --commit "repo@commit" my-app@1.0.0
     sentry-cli releases finalize my-app@1.0.0
     ```

   - Automate this in your CI/CD pipeline (see GitHub Actions example).

2. **Optimize Event Volume**:
   - Set `tracesSampleRate` to a lower value (e.g., `0.2`) in production:

     ```typescript
     Sentry.init({
       tracesSampleRate: 0.2,
     });
     ```

   - Ignore low-value errors:
   
     ```typescript
     Sentry.init({
       ignoreErrors: ['NetworkError', 'TimeoutError'],
     });
     ```

3. **Best Practices**:
   - Regularly review Sentry’s dashboard to resolve or ignore issues.
   - Use **Discover** to analyze crashes by device, OS, or app version.
   - Monitor EAS Build logs for errors during source map or artifact uploads.

---

### **Summary of Expo and CI/CD Differences**
- **Managed Workflow**: Use EAS Build or custom dev clients for native crash reporting, as Expo Go is limited to JavaScript errors.
- **Source Maps**: Generate with `expo export --sourcemaps` and upload via Sentry CLI.
- **Native Artifacts**: Download dSYMs and Proguard mappings from EAS Build artifacts for symbolication.
- **CI/CD**: Use EAS CLI in pipelines (e.g., GitHub Actions) to automate builds, source map uploads, and release creation.
- **Versioning**: Sync `app.json` version with Sentry’s `release` field for accurate release tracking.
- **Testing**: Test JavaScript errors in Expo Go, but use EAS builds for native crashes and performance metrics.
- **Security**: Store `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, and `EXPO_TOKEN` in environment variables or CI secrets.

---

### **Next Steps**
- Refer to the [Sentry Expo Documentation](https://docs.sentry.io/platforms/react-native/expo/) for additional details.
- Explore EAS Build’s advanced features, like custom build hooks, for deeper Sentry integration.
- If you need help with specific CI/CD setups (e.g., CircleCI, Bitrise) or troubleshooting, let me know!