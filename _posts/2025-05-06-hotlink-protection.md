---
layout: post
title: "Hotlink protection : Basic"
author: "chanchan"
categories: journal
tags: [web]
image: mountains.jpg
toc: true
---

Hotlink protection is a security mechanism used to prevent unauthorized websites from directly linking to files (such as images, videos, or other media) hosted on your server. When another site links directly to your content, it consumes your server's bandwidth and resources without contributing to your site's traffic or revenue.

---

### **1. What is Hotlinking?**
Hotlinking (also called inline linking or direct linking) occurs when a website embeds or links directly to a resource (e.g., an image, video, or file) hosted on another server using its URL. For example:
- Your website hosts an image at `https://yourdomain.com/images/photo.jpg`.
- Another website includes this image in their HTML code using `<img src="https://yourdomain.com/images/photo.jpg">`.
- When their visitors load the page, the image is served from *your server*, consuming your bandwidth.

**Consequences of Hotlinking:**
- **Bandwidth Theft**: Your server handles the traffic for someone else's site, potentially increasing hosting costs.
- **Performance Impact**: Excessive requests can slow down your server.
- **Loss of Control**: Your content may be used in contexts you don't approve of (e.g., on inappropriate or competing sites).
- **Copyright Issues**: Unauthorized use of your content may violate intellectual property rights.

---

### **2. What is Hotlink Protection?**
Hotlink protection restricts access to your files so that only authorized websites (typically your own) can serve them. It works by checking the HTTP **referer header** (or other methods) to determine the source of the request. If the request comes from an unauthorized domain, the server blocks access or serves an alternative response (e.g., an error message or a placeholder image).

---

### **3. How Hotlink Protection Works**
Hotlink protection typically relies on server-side configurations to control access to files. Here's how it generally operates:

1. **Referer Header Check**:
   - When a browser requests a file, it sends an HTTP **referer header** indicating the URL of the page making the request (e.g., `https://otherdomain.com/page.html`).
   - The server checks this header against a list of allowed domains (e.g., `yourdomain.com`).
   - If the referer is missing, invalid, or from an unauthorized domain, the server denies the request.

2. **Response Options**:
   - **Block the Request**: Return a 403 Forbidden error.
   - **Redirect**: Serve a different file (e.g., a "hotlinking not allowed" image).
   - **Allow Limited Access**: Permit certain file types or specific domains.

3. **File Type Targeting**:
   - Hotlink protection is typically applied to specific file extensions (e.g., `.jpg`, `.png`, `.mp4`, `.pdf`) to avoid blocking legitimate site functionality.

---

### **4. Implementation Methods**
Hotlink protection can be implemented in several ways, depending on your server setup and hosting environment. Below are the most common approaches:

#### **a. Using .htaccess (Apache Servers)**
The `.htaccess` file is a configuration file for Apache servers that can be used to enable hotlink protection. Here's an example configuration:

```apache
RewriteEngine On
RewriteCond %{HTTP_REFERER} !^$
RewriteCond %{HTTP_REFERER} !^https?://(www\.)?yourdomain\.com [NC]
RewriteRule \.(jpg|jpeg|png|gif|mp4|pdf)$ - [NC,F,L]
```

**Explanation**:
- `RewriteEngine On`: Enables URL rewriting.
- `RewriteCond %{HTTP_REFERER} !^$`: Allows requests with no referer (e.g., direct browser access).
- `RewriteCond %{HTTP_REFERER} !^https?://(www\.)?yourdomain\.com [NC]`: Blocks requests from domains other than `yourdomain.com` (case-insensitive).
- `RewriteRule \.(jpg|jpeg|png|gif|mp4|pdf)$ - [NC,F,L]`: Denies access to specified file types with a 403 Forbidden error.

**Custom Response Example** (redirect to a placeholder image):
```apache
RewriteRule \.(jpg|jpeg|png|gif)$ https://yourdomain.com/images/no-hotlinking.jpg [NC,L]
```

#### **b. Using Nginx Configuration**
For Nginx servers, hotlink protection is implemented in the server configuration file. Example:

```nginx
location ~* \.(jpg|jpeg|png|gif|mp4|pdf)$ {
    valid_referers none blocked yourdomain.com www.yourdomain.com;
    if ($invalid_referer) {
        return 403;
    }
}
```

**Explanation**:
- `location ~* \.(jpg|jpeg|png|gif|mp4|pdf)$`: Targets specific file types (case-insensitive).
- `valid_referers none blocked yourdomain.com www.yourdomain.com`: Allows requests with no referer (`none`), blocked referers, or from your domain.
- `return 403`: Denies invalid requests with a 403 error.

**Custom Response Example**:
```nginx
if ($invalid_referer) {
    rewrite ^(.*)$ /images/no-hotlinking.jpg last;
}
```

#### **c. Content Delivery Networks (CDNs)**
Many CDNs (e.g., Cloudflare, Akamai, Amazon CloudFront) offer built-in hotlink protection:
- Configure a hotlink protection policy in the CDN dashboard.
- Specify allowed domains and file types.
- The CDN handles referer checks and blocks unauthorized requests before they reach your server.

#### **d. Server-Side Scripts**
For dynamic control, you can use server-side scripting to check the referer header and serve files conditionally. Example in Golang:

```go
package main

import (
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
)

func serveProtectedFile(w http.ResponseWriter, r *http.Request) {
	allowedDomains := []string{"yourdomain.com", "www.yourdomain.com"}
	
	// Get referer from request header
	referer := r.Header.Get("Referer")
	refererHost := ""
	
	if referer != "" {
		if parsedURL, err := url.Parse(referer); err == nil {
			refererHost = parsedURL.Host
		}
	}
	
	// Check if referer is allowed
	isAllowed := refererHost == "" // Allow empty referers
	if !isAllowed && refererHost != "" {
		for _, domain := range allowedDomains {
			if refererHost == domain {
				isAllowed = true
				break
			}
		}
	}
	
	// Block unauthorized access
	if !isAllowed {
		w.WriteHeader(http.StatusForbidden)
		w.Write([]byte("Hotlinking not allowed"))
		return
	}
	
	// Serve the file
	file, err := os.Open("path/to/file.jpg")
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	defer file.Close()
	
	w.Header().Set("Content-Type", "image/jpeg")
	io.Copy(w, file)
}

func main() {
	http.HandleFunc("/images/", serveProtectedFile)
	http.ListenAndServe(":8080", nil)
}
```

#### **e. Hosting Provider Control Panels**
Many hosting providers (e.g., cPanel, Plesk) offer hotlink protection tools in their control panels, allowing you to enable it without manual configuration.

---

### **5. Considerations and Limitations**
While hotlink protection is effective, there are some important considerations:

#### **a. Referer Header Issues**
- **Missing Referers**: Some browsers, proxies, or security software strip the referer header, causing legitimate requests to be blocked. Allowing empty referers (`none`) mitigates this.
- **Spoofed Referers**: Malicious users can forge the referer header, bypassing basic protection.
- **HTTPS vs. HTTP**: Ensure your configuration supports both protocols.

#### **b. False Positives**
- Blocking legitimate traffic (e.g., from social media, RSS feeds, or email clients) can occur if referer rules are too strict.
- Test thoroughly to avoid disrupting user experience.

#### **c. Alternative Methods**
Hotlink protection based on referer headers is not foolproof. Advanced alternatives include:
- **Signed URLs**: Generate temporary, unique URLs for files (e.g., using AWS S3 presigned URLs).
- **Token-Based Access**: Require authentication or tokens to access files.
- **Watermarking**: Add visible or invisible watermarks to discourage unauthorized use.

#### **d. Performance**
- Hotlink protection adds server overhead due to referer checks. Use CDNs to offload this processing.
- Cache static files to reduce server load.

#### **e. File Type Scope**
- Be selective about protected file types to avoid breaking site functionality (e.g., CSS or JavaScript files).
- Common targets include media files (`.jpg`, `.png`, `.mp4`) and downloadable content (`.pdf`, `.zip`).

---

### **6. Best Practices**
- **Whitelist Trusted Domains**: Allow hotlinking from specific partners, social media, or analytics tools (e.g., `google.com`, `facebook.com`).
- **Test Configurations**: Verify that hotlink protection doesn't block legitimate traffic (e.g., RSS feeds, email clients).
- **Monitor Logs**: Check server logs for blocked requests to identify false positives or abuse patterns.
- **Use CDNs**: Offload hotlink protection to a CDN for better performance and scalability.
- **Combine Methods**: Use referer-based protection alongside signed URLs or watermarks for stronger security.
- **Inform Users**: If redirecting hotlinked requests, use a friendly placeholder image or message to explain the restriction.

---

### **7. Example Scenario**
Suppose you run a photography website (`yourdomain.com`) and notice other sites hotlinking your high-resolution images, causing high bandwidth usage. You decide to enable hotlink protection:
1. Add an `.htaccess` rule to block unauthorized access to `.jpg` and `.png` files.
2. Allow empty referers to support direct browser access.
3. Redirect hotlinked requests to a branded "Please visit our site" image.
4. Monitor traffic to ensure RSS feeds and social media previews aren't blocked.

This setup reduces bandwidth theft while maintaining accessibility for legitimate users.

---

### **8. Tools and Resources**
- **CDNs**: Cloudflare, Amazon CloudFront, Akamai.
- **Server Software**: Apache, Nginx.
- **Testing Tools**: Browser developer tools, curl, or Postman to simulate requests with different referers.
- **Monitoring**: Server logs, Google Analytics, or CDN dashboards to track hotlinking attempts.

---

### **Conclusion**
Hotlink protection is an essential tool for website owners to prevent unauthorized use of their resources, reduce bandwidth costs, and maintain control over content. By leveraging server configurations, CDNs, or scripting, you can effectively block hotlinking while ensuring legitimate users retain access. However, careful configuration and testing are crucial to avoid false positives and maintain a seamless user experience.
