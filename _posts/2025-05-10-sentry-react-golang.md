---
layout: post
title: "Sentry : Backend(Golang)"
author: "chanchan"
categories: journal
tags: [web]
image: mountains.jpg
toc: true
---

Integrating **Sentry** into a **Go** (Golang) backend application allows you to monitor errors, performance issues, and transactions in your server-side code. Sentry’s Go SDK (`sentry-go`) provides robust support for capturing exceptions, logging custom events, and tracking performance. 

---

### **Best Practices for Integrating Sentry into a Go Backend**

#### **1. Prerequisites**
- Ensure you have a Go project set up with a module (e.g., `go mod init`).
- Have a Sentry account and a project created at [sentry.io](https://sentry.io). Select **Go** as the platform when creating the project.
- Familiarity with your web framework (e.g., **Gin**, **Echo**, **Chi**, or standard `net/http`) for middleware integration.

---

#### **2. Install Sentry SDK**
1. **Add the Sentry Go SDK**:
   Run the following command to install the Sentry Go SDK:

   ```bash
   go get github.com/getsentry/sentry-go
   ```
   
   - This installs the core SDK and dependencies.

2. **Optional Framework Integrations**:
   - For specific web frameworks, install additional packages:
     - **Gin**: `github.com/getsentry/sentry-go/gin`
     - **Echo**: `github.com/getsentry/sentry-go/echo`
     - **Chi**: `github.com/getsentry/sentry-go/http`
     - **Negroni**: `github.com/getsentry/sentry-go/negroni`
   - Example for Gin:
   
     ```bash
     go get github.com/getsentry/sentry-go/gin
     ```

---

#### **3. Initialize Sentry**
Initialize Sentry early in your application to capture errors and performance data across your backend.

1. **Create a Sentry Configuration**:
   Create a function to initialize Sentry in your main package (e.g., `sentry.go`):

```go
package main

import (
	"fmt"
	"github.com/getsentry/sentry-go"
	"time"
)

func initSentry() error {
	err := sentry.Init(sentry.ClientOptions{
		Dsn:              "YOUR_SENTRY_DSN", // Replace with your Sentry DSN
		Environment:      getEnv("APP_ENV", "development"), // e.g., "production", "development"
		Release:          "my-app@1.0.0", // Replace with your app version
		TracesSampleRate: 1.0, // Adjust for performance monitoring (1.0 = 100% of transactions)
		Debug:            getEnv("APP_ENV", "development") == "development",
		EnableTracing:    true, // Enable performance tracing
	})
	if err != nil {
		return fmt.Errorf("sentry.Init: %w", err)
	}
	// Flush buffered events before the app terminates
	defer sentry.Flush(2 * time.Second)
	return nil
}

// Helper to get environment variables with fallback
func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
```

2. **Call Initialization in Main**:
   Call `initSentry` in your `main.go`:
```go
package main

import (
	"log"
)

func main() {
	if err := initSentry(); err != nil {
		log.Fatalf("Failed to initialize Sentry: %v", err)
	}

	// Your server setup (e.g., Gin, Echo, or net/http)
	// Example with net/http
	http.HandleFunc("/", handler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handler(w http.ResponseWriter, r *http.Request) {
	// Example error
	if _, err := fmt.Fprint(w, "Hello, World!"); err != nil {
		sentry.CaptureException(err)
	}
}
```

3. **Secure DSN**:
   - Store the DSN in an environment variable (e.g., via a `.env` file or CI/CD secrets).
   - Use a package like `github.com/joho/godotenv` to load environment variables:

     ```bash
     go get github.com/joho/godotenv
     ```

     Update `main.go`:

```go
package main

import (
	"log"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found: %v", err)
	}

	if err := initSentry(); err != nil {
		log.Fatalf("Failed to initialize Sentry: %v", err)
	}

	// Server setup
	http.HandleFunc("/", handler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

     - Create a `.env` file:

       ```
       SENTRY_DSN=https://your-dsn@sentry.io/123
       APP_ENV=production
       APP_VERSION=1.0.0
       ```

4. **Best Practices for Initialization**:
   - Initialize Sentry before starting your HTTP server to capture all errors.
   - Use `sentry.Flush` to ensure all buffered events are sent before the app terminates.
   - Set `Release` dynamically using your app’s version (e.g., from `git describe` or a build script).
   - Adjust `TracesSampleRate` (e.g., `0.2` for 20% of transactions) in production to manage costs.

---

#### **4. Integrate with Web Frameworks**
Sentry provides middleware for popular Go web frameworks to automatically capture HTTP request errors and performance data.

1. **Example with Gin**:
   Use the `sentrygin` middleware to capture request-level errors and transactions:

```go
package main

import (
	"github.com/getsentry/sentry-go"
	"github.com/getsentry/sentry-go/gin"
	"github.com/gin-gonic/gin"
	"log"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found: %v", err)
	}

	if err := initSentry(); err != nil {
		log.Fatalf("Failed to initialize Sentry: %v", err)
	}
	defer sentry.Flush(2 * time.Second)

	r := gin.Default()
	// Add Sentry middleware
	r.Use(sentrygin.New(sentrygin.Options{
		Repanic: true, // Continue panicking after capturing
	}))

	r.GET("/example", func(c *gin.Context) {
		// Example error
		if true {
			panic("Something went wrong!")
		}
		c.String(200, "Hello, World!")
	})

	log.Fatal(r.Run(":8080"))
}
```

2. **Example with net/http**:
   Use the `sentryhttp` middleware for standard HTTP servers:

```go
package main

import (
	"net/http"
	"github.com/getsentry/sentry-go"
	"github.com/getsentry/sentry-go/http"
	"log"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("No .env file found: %v", err)
	}

	if err := initSentry(); err != nil {
		log.Fatalf("Failed to initialize Sentry: %v", err)
	}
	defer sentry.Flush(2 * time.Second)

	// Create Sentry HTTP middleware
	sentryHandler := sentryhttp.New(sentryhttp.Options{
		Repanic: true,
	})

	http.HandleFunc("/", sentryHandler.HandleFunc(func(w http.ResponseWriter, r *http.Request) {
		// Example error
		if true {
			panic("Something went wrong!")
		}
		http.Error(w, "Hello, World!", http.StatusOK)
	}))

	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

3. **Best Practices for Middleware**:
   - Enable `Repanic: true` to ensure panics are captured and propagated for proper error handling.
   - Use middleware at the top of your handler chain to capture all request-related errors.
   - Configure `WaitForDelivery` in `sentryhttp` or `sentrygin` if you need to wait for Sentry to send events before responding (use sparingly to avoid latency).

---

#### **5. Capture Custom Events and Context**
Enhance error reports with custom metadata, user context, and performance transactions.

1. **Capture Exceptions**:
   Manually capture errors in your code:

   ```go
   func someFunction() error {
       err := errors.New("database query failed")
       if err != nil {
           sentry.CaptureException(err)
           return err
       }
       return nil
   }
   ```

2. **Set User Context**:
   Track which users are affected by errors:

   ```go
   func handleRequest(w http.ResponseWriter, r *http.Request) {
       sentry.ConfigureScope(func(scope *sentry.Scope) {
           scope.SetUser(sentry.User{
               ID:    "user123",
               Email: "user@example.com",
           })
       })
       // Rest of the handler
   }
   ```

3. **Add Custom Tags and Data**:
   Attach metadata for better filtering:

   ```go
   sentry.CaptureException(err, &sentry.EventHint{
       Extra: map[string]interface{}{
           "query": "SELECT * FROM users",
       },
       Tags: map[string]string{
           "module": "database",
           "endpoint": "/api/users",
       },
   })
   ```

4. **Performance Transactions**:
   Track performance for specific operations (e.g., database queries, API calls):

   ```go
   func fetchData(ctx context.Context) error {
       // Start a transaction
       transaction := sentry.StartTransaction(ctx, "fetch-data", sentry.Op("db.query"))
       defer transaction.Finish()

       // Simulate a database query
       time.Sleep(100 * time.Millisecond)
       return nil
   }
   ```

5. **Best Practices for Context**:
   - Use `ConfigureScope` to set request-specific data like user IDs or request IDs.
   - Add tags to categorize errors by module, endpoint, or service.
   - Scrub sensitive data using `BeforeSend`:

     ```go
     sentry.Init(sentry.ClientOptions{
         Dsn: "YOUR_SENTRY_DSN",
         BeforeSend: func(event *sentry.Event, hint *sentry.EventHint) *sentry.Event {
             // Remove sensitive data
             for _, breadcrumb := range event.Breadcrumbs {
                 if breadcrumb.Data != nil {
                     delete(breadcrumb.Data, "password")
                 }
             }
             return event
         },
     })
     ```

---

#### **6. Enable Source Context**
Sentry can include source code snippets in stack traces for better debugging.

1. **Enable Source Context**:
   The Go SDK automatically includes source context if the source files are available at runtime.
   - Ensure your application binary is built with debug information (default in Go).
   - Avoid stripping debug symbols during deployment.

2. **Best Practices**:
   - Deploy your application with source files accessible (e.g., in a container) for local debugging.
   - Use Sentry’s **suspect commits** feature to map errors to specific Git commits:
     - Configure your repository integration in Sentry (e.g., GitHub, GitLab).
     - Set the `Release` field to match your Git tag or commit hash.

---

#### **7. CI/CD Integration**
Automate Sentry release tracking and source map uploads (if using WebAssembly or JavaScript in your backend).

1. **Set Up GitHub Actions**:
   Create a `.github/workflows/deploy.yml` file:

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

      - name: Set up Go
        uses: actions/setup-go@v3
        with:
          go-version: '1.21'

      - name: Build
        run: go build -o my-app

      - name: Install Sentry CLI
        run: npm install -g @sentry/cli

      - name: Create Sentry Release
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          SENTRY_ORG: your-org
          SENTRY_PROJECT: your-project
          APP_VERSION: ${{ github.sha }} # Or use a tag like v1.0.0
        run: |
          sentry-cli releases new my-app@$APP_VERSION
          sentry-cli releases set-commits --commit "repo@commit" my-app@$APP_VERSION
          sentry-cli releases finalize my-app@$APP_VERSION

      - name: Deploy (Example)
        run: scp my-app user@server:/path/to/deploy
```

2. **Store Secrets**:
   - Add `SENTRY_AUTH_TOKEN` to your GitHub repository secrets (generate from Sentry’s account settings).
   - Optionally, store `SENTRY_DSN` and `APP_VERSION` as environment variables.

3. **Key CI/CD Considerations**:
   - **Release Creation**: Automate release creation with `sentry-cli releases new` to track errors by version.
   - **Commit Integration**: Use `set-commits` to link releases to specific Git commits for suspect commit detection.
   - **Source Maps (if applicable)**: If your Go backend serves JavaScript (e.g., via WebAssembly), upload source maps using `sentry-cli sourcemaps upload`.

4. **Best Practices for CI/CD**:
   - Use a dynamic `Release` value based on `github.sha` or a semantic version.
   - Run tests before creating a Sentry release to ensure build stability.
   - Monitor Sentry’s quota usage in CI/CD logs to avoid exceeding limits.

---

#### **8. Test Your Integration**
1. **Trigger a Test Error**:
   Add a test endpoint to throw an error:

   ```go
   r.GET("/test-error", func(c *gin.Context) {
       err := errors.New("Test Sentry error")
       sentry.Capture  }
   ```

2. **Check Sentry Dashboard**:
   - Verify that the error appears with a readable stack trace, tags, and context.
   - Test performance transactions by checking the “Performance” tab.

3. **Best Practices for Testing**:
   - Test in both development and production environments.
   - Simulate edge cases like database failures or network timeouts.
   - Verify source context and commit integration in Sentry.

---

#### **9. Configure Alerts and Integrations**
1. **Create Alert Rules**:
   - In Sentry, go to **Alerts** > **Create Alert Rule**.
   - Example: Notify via Slack for new errors in `production` with >10 occurrences in 5 minutes.

2. **Integrate with Tools**:
   - Connect to Slack, Jira, or PagerDuty for incident management.
   - Example: Create Jira tickets for critical errors.

3. **Best Practices for Alerts**:
   - Use specific conditions to avoid notification overload.
   - Assign issues to team members in Sentry for triage.

---

#### **10. Monitor and Optimize**
1. **Track Release Health**:
   - Monitor error trends and performance metrics per release.
   - Use `sentry-cli` to automate release creation in CI/CD.

2. **Optimize Event Volume**:
   - Set `TracesSampleRate` to a lower value (e.g., `0.2`) in production.
   - Use `ignoreErrors` to filter low-value errors:

     ```go
     sentry.Init(sentry.ClientOptions{
         IgnoreErrors: []string{"TimeoutError", "NetworkError"},
     })
     ```

3. **Best Practices**:
   - Regularly resolve or ignore issues to keep your dashboard clean.
   - Use Sentry’s **Discover** feature to analyze trends by endpoint, module, or user.
   - Combine Sentry with logging tools (e.g., Zap, Logrus) for comprehensive observability.

---

### **Summary of Best Practices**
- **Initialize Early**: Set up Sentry before starting your server.
- **Use Middleware**: Integrate with your web framework for request-level error and performance tracking.
- **Capture Context**: Set user data, tags, and metadata for better debugging.
- **Secure Data**: Scrub sensitive information and store credentials securely.
- **Enable Source Context**: Ensure source files are available for stack traces.
- **Automate CI/CD**: Create releases and link commits in your pipeline.
- **Test Thoroughly**: Verify errors, performance, and integrations in development and production.
- **Set Up Alerts**: Configure targeted alerts and integrations for incident response.
- **Optimize Quotas**: Use sampling and filtering to manage event volume.
- **Monitor Releases**: Track errors and performance by version.

---

### **Next Steps**
- Refer to the [Sentry Go Documentation](https://docs.sentry.io/platforms/go/) for advanced features like distributed tracing or custom integrations.
- Explore performance monitoring for database queries or external API calls.