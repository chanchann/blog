---
layout: post
title: "SOCKS5 Proxy : Implementation"
author: "chanchan"
categories: journal
tags: [web]
image: mountains.jpg
toc: true
---

The SOCKS5 protocol (defined in [RFC 1928](https://datatracker.ietf.org/doc/html/rfc1928)) involves a handshake and data transfer process:

1. **Client Greeting**:
   - The client sends a greeting message listing supported authentication methods.
   - Format: `[VER, NMETHODS, METHODS...]`
     - `VER`: Protocol version (0x05 for SOCKS5).
     - `NMETHODS`: Number of authentication methods.
     - `METHODS`: List of supported methods (e.g., 0x00 for no authentication).

2. **Server Response**:
   - The server selects an authentication method (e.g., 0x00 for no authentication) or rejects the connection.
   - Format: `[VER, METHOD]`

3. **Client Request**:
   - After authentication (or none), the client sends a request to connect to a destination.
   - Format: `[VER, CMD, RSV, ATYP, DST.ADDR, DST.PORT]`
     - `CMD`: Command (0x01 for CONNECT, 0x02 for BIND, 0x03 for UDP ASSOCIATE).
     - `RSV`: Reserved (0x00).
     - `ATYP`: Address type (0x01 for IPv4, 0x03 for domain, 0x04 for IPv6).
     - `DST.ADDR`: Destination address.
     - `DST.PORT`: Destination port.

4. **Server Reply**:
   - The server responds with the result of the request.
   - Format: `[VER, REP, RSV, ATYP, BND.ADDR, BND.PORT]`
     - `REP`: Reply code (0x00 for success, others for errors).

5. **Data Transfer**:
   - If the request is successful, the server establishes a connection to the destination and relays data between the client and the destination.

For this implementation, we'll:
- Support **no authentication** (0x00).
- Handle the **CONNECT** command (0x01) for TCP.
- Support **IPv4** (0x01) and **domain names** (0x03) for destination addresses.
- Exclude UDP and BIND for simplicity.

---

### Step-by-Step Implementation

#### **Step 1: Set Up the Project**
1. Create a new directory for your project:
   ```bash
   mkdir socks5-proxy
   cd socks5-proxy
   go mod init socks5-proxy
   ```

2. Create a file named `main.go`.

#### **Step 2: Write the SOCKS5 Proxy Server Code**
We'll implement a SOCKS5 server that listens for client connections, handles the SOCKS5 handshake, and relays TCP traffic for the CONNECT command.

```go
package main

import (
	"fmt"
	"io"
	"net"
	"os"
)

// SOCKS5 constants
const (
	SOCKS5Version = 0x05
	NoAuth        = 0x00
	CmdConnect    = 0x01
	AtypIPv4      = 0x01
	AtypDomain    = 0x03
)

// handleClient handles a single SOCKS5 client connection
func handleClient(conn net.Conn) {
	defer conn.Close()

	// Step 1: Read client greeting
	greeting := make([]byte, 2)
	if _, err := io.ReadFull(conn, greeting); err != nil {
		fmt.Printf("Failed to read greeting: %v\n", err)
		return
	}

	if greeting[0] != SOCKS5Version {
		fmt.Printf("Unsupported version: %v\n", greeting[0])
		return
	}

	nmethods := int(greeting[1])
	methods := make([]byte, nmethods)
	if _, err := io.ReadFull(conn, methods); err != nil {
		fmt.Printf("Failed to read methods: %v\n", err)
		return
	}

	// Step 2: Respond with selected method (no authentication)
	response := []byte{SOCKS5Version, NoAuth}
	if _, err := conn.Write(response); err != nil {
		fmt.Printf("Failed to send method response: %v\n", err)
		return
	}

	// Step 3: Read client request
	request := make([]byte, 4)
	if _, err := io.ReadFull(conn, request); err != nil {
		fmt.Printf("Failed to read request: %v\n", err)
		return
	}

	if request[0] != SOCKS5Version || request[1] != CmdConnect {
		sendReply(conn, 0x07) // Command not supported
		return
	}

	var addr string
	switch request[3] { // ATYP
	case AtypIPv4:
		ipv4 := make([]byte, 4)
		if _, err := io.ReadFull(conn, ipv4); err != nil {
			fmt.Printf("Failed to read IPv4 address: %v\n", err)
			return
		}
		addr = net.IP(ipv4).String()
	case AtypDomain:
		length := make([]byte, 1)
		if _, err := io.ReadFull(conn, length); err != nil {
			fmt.Printf("Failed to read domain length: %v\n", err)
			return
		}
		domain := make([]byte, length[0])
		if _, err := io.ReadFull(conn, domain); err != nil {
			fmt.Printf("Failed to read domain: %v\n", err)
			return
		}
		addr = string(domain)
	default:
		sendReply(conn, 0x08) // Address type not supported
		return
	}

	// Read destination port
	port := make([]byte, 2)
	if _, err := io.ReadFull(conn, port); err != nil {
		fmt.Printf("Failed to read port: %v\n", err)
		return
	}
	portNum := int(port[0])<<8 | int(port[1])
	addr = fmt.Sprintf("%s:%d", addr, portNum)

	// Step 4: Connect to the destination
	dstConn, err := net.Dial("tcp", addr)
	if err != nil {
		fmt.Printf("Failed to connect to destination %s: %v\n", addr, err)
		sendReply(conn, 0x05) // Connection refused
		return
	}
	defer dstConn.Close()

	// Step 5: Send success reply
	if err := sendReply(conn, 0x00); err != nil {
		fmt.Printf("Failed to send reply: %v\n", err)
		return
	}

	// Step 6: Relay traffic
	go io.Copy(dstConn, conn)
	io.Copy(conn, dstConn)
}

// sendReply sends a SOCKS5 reply to the client
func sendReply(conn net.Conn, rep byte) error {
	reply := []byte{
		SOCKS5Version, // VER
		rep,           // REP
		0x00,          // RSV
		AtypIPv4,      // ATYP (dummy IPv4)
		0x00, 0x00, 0x00, 0x00, // BND.ADDR (dummy)
		0x00, 0x00,             // BND.PORT (dummy)
	}
	_, err := conn.Write(reply)
	return err
}

func main() {
	listener, err := net.Listen("tcp", ":1080")
	if err != nil {
		fmt.Printf("Failed to listen on port 1080: %v\n", err)
		os.Exit(1)
	}
	defer listener.Close()

	fmt.Println("SOCKS5 proxy server running on :1080")
	for {
		conn, err := listener.Accept()
		if err != nil {
			fmt.Printf("Failed to accept connection: %v\n", err)
			continue
		}
		go handleClient(conn)
	}
}
```

---

#### **Step 3: Explanation of the Code**

1. **Main Function**:
   - Creates a TCP listener on port `1080` (standard SOCKS5 port).
   - Accepts incoming client connections and spawns a goroutine (`handleClient`) for each.

2. **handleClient Function**:
   - **Client Greeting**:
     - Reads the greeting (`[VER, NMETHODS, METHODS...]`) to verify the SOCKS5 version and list of authentication methods.
     - For simplicity, we assume the client supports "no authentication" (0x00).
   - **Server Response**:
     - Sends `[VER, METHOD]` with `METHOD = 0x00` (no authentication).
   - **Client Request**:
     - Reads the request (`[VER, CMD, RSV, ATYP, DST.ADDR, DST.PORT]`).
     - Supports `CMD = CONNECT` (0x01) and address types `IPv4` (0x01) and `Domain` (0x03).
     - Parses the destination address and port.
   - **Destination Connection**:
     - Dials the destination address (e.g., `example.com:80`) using `net.Dial`.
   - **Server Reply**:
     - Sends a success reply (`REP = 0x00`) if the connection is established, or an error code (e.g., 0x05 for connection refused) if it fails.
     - Uses a dummy `BND.ADDR` and `BND.PORT` (0.0.0.0:0) for simplicity, as they are often ignored by clients.
   - **Data Relay**:
     - Uses `io.Copy` to relay data bidirectionally between the client and destination.
     - Runs one direction in a goroutine to avoid blocking.

3. **sendReply Function**:
   - Constructs and sends the SOCKS5 reply (`[VER, REP, RSV, ATYP, BND.ADDR, BND.PORT]`).
   - Uses a fixed `ATYP = IPv4` with dummy values for simplicity.

4. **Constants**:
   - Defines SOCKS5 protocol constants (e.g., `SOCKS5Version = 0x05`, `CmdConnect = 0x01`).

---

#### **Step 4: Run the Proxy Server**
1. Save the code in `main.go`.
2. Build and run the server:
   ```bash
   go run main.go
   ```
   - The server will listen on `localhost:1080` and print "SOCKS5 proxy server running on :1080".

3. Handle errors:
   - If port 1080 is in use, change the port in `net.Listen("tcp", ":1080")` (e.g., to `:8080`).

---

#### **Step 5: Test the Proxy**
1. **Using curl**:
   - Test the SOCKS5 proxy with a command like:
     ```bash
     curl -x socks5://localhost:1080 https://api.ipify.org
     ```
     - This should return the server's public IP (or the same IP if running locally).

2. **Using a Browser**:
   - Configure your browser (e.g., Firefox) to use the SOCKS5 proxy:
     - Go to **Settings > General > Network Settings > Manual Proxy Configuration**.
     - Set:
       - SOCKS Host: `127.0.0.1`
       - Port: `1080`
       - SOCKS v5
       - Enable "Proxy DNS when using SOCKS v5" for domain resolution.
     - Visit a site like `whatismyipaddress.com` to verify the proxy is working.

3. **Using a SOCKS5 Client Library**:
   - Use a Python script with `PySocks` to test:
     ```python
     import socks
     import socket
     import requests

     socks.set_default_proxy(socks.SOCKS5, "127.0.0.1", 1080)
     socket.socket = socks.socksocket
     response = requests.get("https://api.ipify.org")
     print(response.text)
     ```

---

#### **Step 6: Limitations and Potential Enhancements**
This implementation is minimal for educational purposes. Here are its limitations and possible improvements:

- **Limitations**:
  - Supports only **no authentication** (0x00). Real-world proxies often require username/password authentication (0x02).
  - Handles only the **CONNECT** command. SOCKS5 also supports **BIND** and **UDP ASSOCIATE**.
  - Supports only **IPv4** and **domain** address types, not **IPv6** (0x04).
  - Lacks error handling for edge cases (e.g., malformed requests).
  - No logging or configuration options.

- **Enhancements**:
  1. **Add Authentication**:
     - Implement username/password authentication (RFC 1929) by reading sub-negotiation packets after selecting method 0x02.
  2. **Support UDP**:
     - Add support for `UDP ASSOCIATE` using `net.PacketConn` for UDP relaying.
  3. **Support IPv6**:
     - Handle `ATYP = 0x04` by parsing 16-byte IPv6 addresses.
  4. **Add Configuration**:
     - Use flags or a config file for port, authentication, and logging.
  5. **Improve Error Handling**:
     - Add detailed error replies (e.g., 0x03 for network unreachable) and logging.
  6. **Add TLS**:
     - Wrap connections with TLS for encrypted SOCKS5 communication.

---

#### **Step 7: Security Considerations**
- **No Authentication**: This proxy allows anyone to connect, which is insecure for public servers. Add authentication for production use.
- **No Encryption**: SOCKS5 does not encrypt traffic. Use TLS or pair with an SSH tunnel for security.
- **Listen Address**: The server listens on `0.0.0.0:1080` by default, making it accessible externally. Bind to `127.0.0.1:1080` for local-only access:
  ```go
  listener, err := net.Listen("tcp", "127.0.0.1:1080")
  ```
- **Firewall**: Restrict access to the proxy port using a firewall (e.g., `ufw` or `iptables`).

---

#### **Step 8: Example Output**
When you run the server and test it:
- Server output:
  ```
  SOCKS5 proxy server running on :1080
  ```
- If a client connects and requests an invalid destination:
  ```
  Failed to connect to destination example.com:80: dial tcp: lookup example.com: no such host
  ```

- Successful `curl` test:
  ```bash
  $ curl -x socks5://localhost:1080 https://api.ipify.org
  <your_server_ip>
  ```

---

#### **Conclusion**
This Go implementation provides a minimal but functional SOCKS5 proxy server that supports the CONNECT command for TCP connections with IPv4 and domain addresses. It’s suitable for learning the SOCKS5 protocol and basic proxying. For production use, you should add authentication, error handling, and possibly UDP support. You can test it with tools like `curl`, browsers, or SOCKS5 client libraries.

