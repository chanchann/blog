---
layout: post
title: "CROS : Examples"
author: "chanchan"
categories: journal
tags: [web]
image: mountains.jpg
toc: true
---

CORS (Cross-Origin Resource Sharing) is a web security mechanism that allows servers to declare which external domains can access their resources. It primarily implements secure cross-origin data access through HTTP response headers.

## 1. Examples

In a typical frontend-backend separation project, where the frontend uses TypeScript + React and the backend uses Golang, both components are usually deployed on different ports or domains, leading to **cross-origin (CORS)** issues. Here's how to configure and implement it:

### 1.1 Frontend (TypeScript + React)

During development, the frontend typically runs on a local development server (e.g., `localhost:3000`), while the backend API server might be on `localhost:8080`. This creates a cross-origin request scenario.

**Development Solutions:**

#### Method 1: Configure `proxy` in `package.json`
If you're using [Create React App](https://create-react-app.dev/), add this line to your `package.json`:

```json
"proxy": "http://localhost:8080"
```

This automatically proxies all unmatched static file requests to your backend API server during development, avoiding CORS issues.

#### Method 2: Direct API Requests (Requires Backend CORS Support)
If you make direct fetch/axios requests to your backend API (e.g., `http://localhost:8080/api/user`), the backend must be configured for CORS (see below).

### 1.2 Backend (Golang)

The Golang backend needs to allow cross-origin requests from the frontend. Common CORS middleware includes:

- [github.com/rs/cors](https://github.com/rs/cors)
- [github.com/gin-contrib/cors](https://github.com/gin-contrib/cors) (if using Gin framework)

#### Example 1: Standard Library net/http + rs/cors

```go
import (
    "net/http"
    "github.com/rs/cors"
)

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Hello, world!"))
    })

    // Configure CORS
    handler := cors.New(cors.Options{
        AllowedOrigins:   []string{"http://localhost:3000"}, // Allowed frontend address
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
        AllowedHeaders:   []string{"Content-Type", "Authorization"},
        AllowCredentials: true,
    }).Handler(mux)

    http.ListenAndServe(":8080", handler)
}
```

#### Example 2: Gin Framework

```go
import (
    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
    "time"
)

func main() {
    r := gin.Default()
    r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"},
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge: 12 * time.Hour,
    }))
    r.GET("/api/hello", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "Hello, world!"})
    })
    r.Run(":8080")
}
```

### 1.3 Production Deployment Recommendations

- After frontend build (`npm run build`), deploy static files using a web server like nginx.
- Deploy backend API separately, ensuring CORS is configured to allow your frontend domain.
- Alternatively, use nginx as a proxy to forward API requests to the backend, avoiding CORS (though backend support is still required).

### 1.4 Deployment Scenario
Your deployment scenario includes:
- **Frontend**: **Web** (React) and **App** (e.g., React Native, Flutter, or native apps)
- **Backend**: **Golang service**
- **Production deployment**

## 2. Is Nginx Recommended?

### Strongly Recommended!

Nginx offers significant advantages for deploying frontend-backend separation projects:

### 2.1 Benefits of Using Nginx

#### 1. Static Resource Hosting (Web)
- Nginx efficiently hosts and distributes your frontend static files (HTML, JS, CSS, images, etc.) after build.
- Enables fast frontend access with optimizations like caching, compression, and HTTPS.

#### 2. Backend API Reverse Proxy
- Nginx proxies API requests to your Golang service, providing secure and flexible traffic forwarding and load balancing.
- Hides backend real ports and IPs, enhancing security.
- Centralizes HTTPS certificate configuration, simplifying backend services.

#### 3. CORS Resolution
- Through Nginx configuration, all frontend `/api` requests can be forwarded to the backend, making frontend and backend appear as the same domain, completely avoiding CORS issues.
- Nginx can also add CORS response headers uniformly.

#### 4. App API Support
- App clients (e.g., iOS/Android) typically make direct API requests. With proper domain and SSL certificate configuration, Nginx serves as a unified traffic entry point for security control.

#### 5. Security and High Availability
- Nginx supports various security strategies including HTTPS, rate limiting, hotlink protection, and access control.
- Supports load balancing for horizontal scaling of multiple backend Golang services.

### 2.2 Recommended Production Architecture

```
┌──────────────┐
│ User Browser │
└─────┬────────┘
      │
      ▼
┌──────────────┐
│    Nginx     │
│ (Unified Entry) │
├───────┬──────┤
│ Static │ API  │
│ Assets │ Proxy│
│        │      │
▼        ▼      ▼
Web Static    Golang Backend
Files (/dist)  API (Multiple
              Servers for Load
              Balancing)
```

### 2.3 Example Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Static Resources
    location / {
        root /var/www/your-web-dist; # Frontend build directory
        try_files $uri $uri/ /index.html;
    }

    # API Reverse Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8080; # Golang service port
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 2.4 App Integration

- App clients can directly request `https://yourdomain.com/api/xxx`.
- Nginx automatically forwards API requests to the backend Golang service.

### 2.5 Summary

- **Use Nginx** as a unified traffic entry point to host web static files and reverse proxy APIs, enhancing security and maintainability.
- Enable HTTPS (SSL certificates) in production to protect data security.
- Backend Golang services can focus on business logic without handling static resources and CORS.

## 3. Do You Still Need CORS After Using Nginx?

### 3.1 If Nginx is Used as API Reverse Proxy:
**Frontend (Web) and backend (Golang) appear as the same domain and port**, for example:

- Frontend access `https://yourdomain.com/` (static resources)
- API requests `https://yourdomain.com/api/xxx` (Nginx forwards to backend)

**In this case, frontend requests to backend** are considered "same-origin" by the browser, **CORS mechanism is not triggered**, and **backend does not need CORS configuration**.

### 3.2 If Frontend and Backend are Still Different Domains/Ports:
For example:

- Frontend access `https://web.yourdomain.com`
- API requests `https://api.yourdomain.com`

**In this case, browser will detect cross-origin**, and **backend must enable CORS**.

### 3.3 App (Native/React Native) API Requests:
- App API requests are not subject to browser CORS restrictions (App can directly request API), **backend CORS configuration is optional**.

### 3.4 Conclusion

- **When using Nginx reverse proxy to the same domain, backend does not need CORS configuration.**
- **If frontend and backend are not on the same domain, backend still needs CORS configuration.**
- **App requests are not affected by CORS.**

### 3.5 Recommendations

- **Recommended to use Nginx reverse proxy to unify Web and API under one domain, simplifying CORS issues.**
- If you need to support third-party website API calls later, backend can flexibly enable CORS.

## 4. Can Nginx Support Multiple Backend Servers Under One Domain?

### 4.1 Answer: Yes!

Nginx supports **reverse proxy and load balancing**, allowing API requests under the same domain to be distributed to multiple backend servers, enabling them to provide services together.

### 4.2 Typical Architecture

```
        ┌─────────────┐
        │   Users     │
        └─────┬───────┘
              │
              ▼
        ┌─────────────┐
        │   Nginx     │ yourdomain.com
        └─────┬───────┘
   ┌──────────┴──────────┐
   │         │           │
┌─────┐  ┌─────┐    ┌─────┐
│Backend A│  │Backend B│... │Backend N│
└─────┘  └─────┘    └─────┘
```

### 4.3 Nginx Load Balancing Configuration Example

Assuming you have three backend services with IPs 10.0.0.1, 10.0.0.2, 10.0.0.3, all on port 8080:

```nginx
http {
    upstream backend_servers {
        server 10.0.0.1:8080;
        server 10.0.0.2:8080;
        server 10.0.0.3:8080;
        # Can also configure weights, health checks, etc.
    }

    server {
        listen 80;
        server_name yourdomain.com;

        location /api/ {
            proxy_pass http://backend_servers;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        location / {
            root /var/www/your-web-dist;
            try_files $uri $uri/ /index.html;
        }
    }
}
```

**When users request `yourdomain.com/api/`, Nginx will automatically distribute requests to Backend A/B/C in round-robin fashion.**

### 4.4 Benefits

- **Single domain externally**, users and frontend don't need to care about how many backend machines there are.
- **Load balancing**, automatically distributes pressure, improves performance and high availability.
- **Backend horizontal scaling**, just add/remove backend servers in Nginx configuration.
- **Failover**, partial backend failures won't affect overall service.

### 4.5 Advanced Features

- Supports **health checks**, automatically removes failed backends
- Supports **session persistence** (sticky session)
- Supports **SSL termination**, **rate limiting**, **access control**, etc.

### 4.6 Summary

**Nginx can completely support multiple backend services under one unified domain, automatically distributing requests to achieve high availability and high performance backend services.**

## 5. Best Practices

1. **Development Phase**: Use frontend `proxy` or backend CORS middleware to resolve cross-origin issues.
2. **Production Phase**: Configure CORS on the backend or use nginx as a reverse proxy.
3. **Security**: In production, strictly specify frontend domains in `AllowedOrigins`; avoid using `*`.
