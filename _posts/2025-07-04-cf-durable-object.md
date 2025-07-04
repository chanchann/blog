---
layout: post
title: "cloudflare - durable object"
author: "chanchan"
categories: journal
tags: [web]
image: mountains.jpg
toc: true
---

Cloudflare Durable Objects is a powerful feature of the Cloudflare Workers platform that enables developers to build stateful, serverless applications with consistent, low-latency storage and coordination capabilities. Below, I’ll provide a detailed explanation of Durable Objects, their key concepts, features, use cases, and limitations, drawing from the provided reference and general knowledge about the platform.[](https://developers.cloudflare.com/durable-objects/)[](https://developers.cloudflare.com/durable-objects/get-started/)[](https://developers.cloudflare.com/durable-objects/what-are-durable-objects/)

---

### **What Are Durable Objects?**

Durable Objects are a special type of Cloudflare Worker that combines serverless compute with persistent, strongly consistent storage. Unlike traditional Workers, which are stateless and handle requests in a distributed manner across Cloudflare’s global network, Durable Objects provide a way to maintain state and coordinate interactions between multiple clients or Workers. Each Durable Object is a globally unique instance of a JavaScript (or WebAssembly) class with its own private storage, making it ideal for building distributed, stateful applications without managing infrastructure.[](https://developers.cloudflare.com/durable-objects/what-are-durable-objects/)[](https://www.cloudflare.com/developer-platform/products/durable-objects/)

Key characteristics of Durable Objects include:
- **Globally Unique Instances**: Each Durable Object has a unique identifier, ensuring all requests for a specific object are routed to the same instance, regardless of the requester’s location. This enables consistent state management and coordination.[](https://developers.cloudflare.com/durable-objects/what-are-durable-objects/)
- **Persistent Storage**: Each Durable Object has its own private, transactional, and strongly consistent storage (up to 10 GB per object with SQLite backend), which is co-located with the compute for low-latency access.[](https://developers.cloudflare.com/durable-objects/what-are-durable-objects/)[](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/)
- **Serverless**: Like Workers, Durable Objects are automatically provisioned, scaled, and managed by Cloudflare, requiring no infrastructure management. They are instantiated close to the first request and can migrate to healthy servers as needed.[](https://developers.cloudflare.com/durable-objects/what-are-durable-objects/)[](https://blog.cloudflare.com/durable-objects-ga/)
- **Single-Threaded Execution**: Each Durable Object processes requests sequentially, avoiding race conditions and simplifying concurrent programming.[](https://www.reddit.com/r/softwarearchitecture/comments/nouf3p/cloudflares_durable_objects_seem_interesting_from/)[](https://flaredup.substack.com/p/the-ultimate-guide-to-cloudflares)
- **WebSocket Support**: Durable Objects can act as WebSocket servers, enabling real-time, bidirectional communication for applications like chat or multiplayer games.[](https://www.cloudflare.com/developer-platform/products/durable-objects/)[](https://developers.cloudflare.com/durable-objects/examples/)

---

### **How Durable Objects Work**

Durable Objects are designed to align with the logical units of an application’s state. For example, in a chat application, a Durable Object might represent a single chat room, or in an e-commerce platform, it might represent a shopping cart. This alignment simplifies state management and coordination compared to traditional databases or stateless serverless architectures.[](https://blog.cloudflare.com/introducing-workers-durable-objects/)

#### **Key Components**
1. **Globally Unique Identifier**:
   - Each Durable Object is identified by a unique name or ID, which allows requests from anywhere in the world to be routed to the same instance. This ensures consistency for operations like updating state or coordinating clients.[](https://developers.cloudflare.com/durable-objects/what-are-durable-objects/)
   - Example: A Durable Object for a chat room named "room123" will handle all requests for that room, regardless of where the clients are located.

2. **Storage API**:
   - Durable Objects provide two storage backends: key-value (KV) and SQLite. Cloudflare recommends using the SQLite backend for new projects due to its flexibility and features like Point-in-Time Recovery.[](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/)
   - **Key-Value Storage**: Suitable for simple key-value pairs but limited to 128 KiB per key.[](https://tinybase.org/guides/integrations/cloudflare-durable-objects/)
   - **SQLite Storage**: Supports complex data structures (e.g., tables) and up to 10 GB of storage per object. It also offers Point-in-Time Recovery for restoring data to any point in the last 30 days.[](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/)
   - Storage is strongly consistent, meaning reads and writes are immediately reflected, avoiding the eventual consistency issues common in distributed systems.[](https://developers.cloudflare.com/durable-objects/what-are-durable-objects/)
   - Data written to storage persists across restarts or evictions, unlike in-memory state, which may be lost if the object is idle or evicted.[](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/)

3. **Alarms API**:
   - Durable Objects support an Alarms API, allowing you to schedule future tasks (e.g., waking up the object to perform work like batch processing or queue management). Alarms are set using the Storage API and have guaranteed at-least-once execution with automatic retries using exponential backoff.[](https://developers.cloudflare.com/durable-objects/api/alarms/)
   - Example: A Durable Object can use an alarm to periodically aggregate data or process a queue without requiring an external trigger.[](https://blog.cloudflare.com/durable-objects-alarms/)

4. **WebSocket Hibernation**:
   - For WebSocket-based applications, the WebSocket Hibernation API reduces costs by allowing Durable Objects to "hibernate" when idle, maintaining WebSocket connections without incurring continuous compute charges.[](https://developers.cloudflare.com/durable-objects/platform/pricing/)[](https://tinybase.org/guides/integrations/cloudflare-durable-objects/)
   - This is particularly useful for applications like chat or gaming, where WebSocket connections may remain open for long periods with sporadic activity.[](https://developers.cloudflare.com/durable-objects/platform/pricing/)

5. **Remote Procedure Call (RPC)**:
   - Durable Objects support Workers RPC, enabling JavaScript-native method calls between Workers and Durable Objects. This simplifies communication and makes it more intuitive than traditional HTTP or WebSocket messaging.[](https://developers.cloudflare.com/durable-objects/what-are-durable-objects/)[](https://developers.cloudflare.com/durable-objects/examples/)

#### **Lifecycle and Management**
- **Instantiation**: Durable Objects are created on first access and remain active as long as they process requests. They hibernate after a few seconds of inactivity to save resources.[](https://developers.cloudflare.com/durable-objects/what-are-durable-objects/)
- **Eviction**: Inactive Durable Objects may be evicted from memory, losing in-memory state. Persistent data must be written to the Storage API to survive evictions or restarts.[](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/)
- **Migration**: Durable Objects can migrate across Cloudflare’s network to optimize latency or handle server failures. Developers don’t need to manage this process.[](https://developers.cloudflare.com/durable-objects/what-are-durable-objects/)
- **Deletion**: A Durable Object ceases to exist if its storage is empty (e.g., no data written, no alarms set). To delete an object, you must explicitly call `storage.deleteAll()` and `storage.deleteAlarm()`.[](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/)

---

### **Use Cases**

Durable Objects are well-suited for applications requiring stateful coordination or real-time collaboration. Common use cases include:

1. **Real-Time Applications**:
   - **Chat Applications**: A Durable Object can represent a chat room, managing WebSocket connections and storing message history.[](https://developers.cloudflare.com/durable-objects/demos/)
   - **Multiplayer Games**: Durable Objects can coordinate game state and player interactions in real time.[](https://blog.cloudflare.com/durable-objects-ga/)[](https://developers.cloudflare.com/durable-objects/demos/)
   - **Live Notifications**: Durable Objects can broadcast updates to connected clients, such as in a live dashboard or notification system.[](https://www.cloudflare.com/developer-platform/products/durable-objects/)

2. **Stateful Serverless Applications**:
   - **Shopping Carts**: Each cart can be a Durable Object, ensuring consistent updates and preventing double bookings.[](https://blog.cloudflare.com/introducing-workers-durable-objects/)[](https://flaredup.substack.com/p/the-ultimate-guide-to-cloudflares)
   - **Collaborative Tools**: Applications like whiteboards or document editors can use Durable Objects to manage shared state across users.[](https://blog.cloudflare.com/introducing-workers-durable-objects/)[](https://blog.cloudflare.com/durable-objects-alarms/)

3. **Distributed Systems**:
   - **Queues and Workflows**: Durable Objects can implement reliable queues or batch processing using the Alarms API.[](https://blog.cloudflare.com/durable-objects-ga/)[](https://blog.cloudflare.com/durable-objects-alarms/)
   - **CRDTs**: For advanced use cases, Conflict-Free Replicated Data Types (CRDTs) can be built on top of Durable Objects for distributed state synchronization.[](https://blog.cloudflare.com/introducing-workers-durable-objects/)

4. **AI Agents**:
   - Durable Objects can give AI agents memory and coordination capabilities, enabling tasks like personalized responses or task orchestration without external infrastructure.[](https://www.cloudflare.com/developer-platform/products/durable-objects/)

---

### **Getting Started with Durable Objects**

To use Durable Objects, you need a Cloudflare account and the Workers CLI (Wrangler). Here’s a high-level overview of the setup process:[](https://developers.cloudflare.com/durable-objects/get-started/)

1. **Set Up a Cloudflare Account**:
   - Sign up for a Cloudflare account and install Node.js. A version manager like Volta or nvm is recommended to avoid permission issues.[](https://developers.cloudflare.com/durable-objects/get-started/)

2. **Create a Project**:
   - Run `create cloudflare@latest` and select the "Worker + Durable Objects" template. Choose TypeScript or JavaScript and set up git for version control. This creates a project with a `wrangler.jsonc` configuration file and a source file (`index.js` or `index.ts`).[](https://developers.cloudflare.com/durable-objects/get-started/)

3. **Define a Durable Object**:
   - Create a JavaScript or TypeScript class that extends `DurableObject`. Define methods like `fetch` for HTTP requests or `webSocketMessage` for WebSocket handling. Example:
     ```javascript
     import { DurableObject } from "cloudflare:workers";
     export class MyDurableObject extends DurableObject {
       async fetch(request) {
         let count = (await this.ctx.storage.get("count")) || 0;
         count += 1;
         await this.ctx.storage.put("count", count);
         return new Response(`Count: ${count}`);
       }
     }
     ```
   - Configure the Durable Object in `wrangler.jsonc` with a binding name (e.g., `MY_DURABLE_OBJECT`) and class name (e.g., `MyDurableObject`).[](https://developers.cloudflare.com/durable-objects/get-started/)

4. **Access from a Worker**:
   - A Worker can communicate with a Durable Object using its binding. Example:
     ```javascript
     export default {
       async fetch(request, env) {
         let id = env.MY_DURABLE_OBJECT.idFromName("counter");
         let stub = env.MY_DURABLE_OBJECT.get(id);
         return await stub.fetch(request);
       }
     };
     ```

5. **Deploy**:
   - Run `npm run deploy` to deploy the Worker and Durable Object to Cloudflare’s global network. You can test locally with `npm run dev`.[](https://developers.cloudflare.com/durable-objects/get-started/)[](https://flaredup.substack.com/p/the-ultimate-guide-to-cloudflares)

6. **Testing and Debugging**:
   - Use `wrangler dev` for local testing and `wrangler tail` for live debugging. The Cloudflare dashboard provides visibility into deployed Durable Objects.[](https://blog.cloudflare.com/durable-objects-ga/)

---

### **Durable Objects vs. Other Cloudflare Products**

1. **Durable Objects vs. D1**:
   - **D1**: A managed SQLite database designed for traditional database use cases, with support for external HTTP API access and schema management. It’s not co-located with compute, which may introduce latency.[](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/)
   - **Durable Objects**: Co-locate compute and storage for low-latency access, ideal for stateful, real-time applications. SQLite in Durable Objects is private to each object, unlike D1’s shared database model.[](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/)
   - Use D1 for applications needing a centralized database; use Durable Objects for distributed, stateful logic.

2. **Durable Objects vs. Workers KV**:
   - **Workers KV**: A globally distributed key-value store with eventual consistency, suitable for read-heavy workloads.[](https://dev.to/bascodes/when-the-internet-melted-down-cloudflares-outage-and-the-magic-of-durable-objects-1i9h)
   - **Durable Objects**: Provide strongly consistent storage and compute, better for coordination and real-time updates.[](https://www.answeroverflow.com/m/1299372336675426395)

3. **Durable Objects vs. Queues**:
   - **Queues**: Designed for asynchronous messaging and task processing, with no persistent state.[](https://www.answeroverflow.com/m/1299372336675426395)
   - **Durable Objects**: Combine state and compute, making them better for applications requiring coordination or persistent state, such as chat or game servers.[](https://www.answeroverflow.com/m/1299372336675426395)

---

### **Pricing and Limits**

Durable Objects are available on both Workers Free and Paid plans, with specific constraints:[](https://developers.cloudflare.com/durable-objects/platform/pricing/)[](https://developers.cloudflare.com/durable-objects/platform/limits/)

- **Pricing**:
  - **Compute**: Billed based on the duration a Durable Object is active in memory. WebSocket Hibernation reduces costs for idle WebSocket connections.[](https://developers.cloudflare.com/durable-objects/platform/pricing/)
  - **Storage**: SQLite-backed Durable Objects currently incur no storage charges, but this will change with advance notice. Key-value storage incurs charges on the Paid plan.[](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/)[](https://developers.cloudflare.com/durable-objects/platform/pricing/)
  - Example: A moderately trafficked application with 100 Durable Objects and 100 WebSocket connections per object (using hibernation) might cost ~$416.51/month, primarily due to compute duration.[](https://developers.cloudflare.com/durable-objects/platform/pricing/)

- **Limits**:
  - **Storage**: Up to 10 GB per Durable Object (SQLite backend). Free plan accounts are limited to 5 GB total across all objects.[](https://developers.cloudflare.com/durable-objects/platform/limits/)
  - **Compute**: 30 seconds of CPU time per request invocation, resettable by new requests. Exceeding this increases eviction risk.[](https://developers.cloudflare.com/durable-objects/platform/limits/)
  - **Requests**: Soft limit of 1,000 requests per second per object. Horizontal scaling is unlimited by creating more objects.[](https://developers.cloudflare.com/durable-objects/platform/limits/)
  - **SQLite Limits**: Apply to SQLite-backed Durable Objects (e.g., 2 MB row limit in JSON mode, mitigated by fragmented mode).[](https://tinybase.org/guides/integrations/cloudflare-durable-objects/)
  - Free plan supports only SQLite-backed Durable Objects; Paid plan supports both SQLite and key-value backends.[](https://developers.cloudflare.com/durable-objects/platform/limits/)

To increase limits, submit a Limit Increase Request Form.[](https://developers.cloudflare.com/durable-objects/platform/limits/)

---

### **Advantages and Challenges**

#### **Advantages**
- **Stateful Serverless**: Combines the simplicity of serverless with persistent state, reducing the need for external databases.[](https://www.cloudflare.com/developer-platform/products/durable-objects/)[](https://flaredup.substack.com/p/the-ultimate-guide-to-cloudflares)
- **Low Latency**: Co-located compute and storage, plus automatic provisioning near users, minimize latency.[](https://developers.cloudflare.com/durable-objects/what-are-durable-objects/)
- **Simplified Concurrency**: Single-threaded execution eliminates race conditions, making it easier to build correct concurrent applications.[](https://flaredup.substack.com/p/the-ultimate-guide-to-cloudflares)
- **Global Scalability**: Cloudflare’s network supports millions of Durable Objects worldwide with automatic scaling and migration.[](https://developers.cloudflare.com/durable-objects/what-are-durable-objects/)
- **WebSocket and Alarms**: Enable real-time applications and scheduled tasks without external infrastructure.[](https://www.cloudflare.com/developer-platform/products/durable-objects/)[](https://developers.cloudflare.com/durable-objects/api/alarms/)

#### **Challenges**
- **Learning Curve**: The concept of Durable Objects can be complex for developers unfamiliar with stateful serverless architectures.[](https://www.answeroverflow.com/m/1299372336675426395)[](https://flaredup.substack.com/p/the-ultimate-guide-to-cloudflares)
- **Single-Threaded Limitation**: Each object processes requests sequentially, which may bottleneck high-throughput applications. Horizontal scaling (more objects) is required for high concurrency.[](https://developers.cloudflare.com/durable-objects/platform/limits/)
- **In-Memory State**: In-memory state is lost on eviction or restart, requiring careful use of the Storage API for persistence.[](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/)
- **Cost Considerations**: Compute duration charges can accumulate for applications with long-running WebSocket connections, though hibernation helps mitigate this.[](https://developers.cloudflare.com/durable-objects/platform/pricing/)
- **Schema Evolution**: Managing changes to Durable Object schemas over time requires migrations, which can be complex.[](https://www.answeroverflow.com/m/1345077794245316740)

---

### **Example Applications and Demos**

Cloudflare provides several demos showcasing Durable Objects:
- **Chat Demo**: A real-time chat application using Durable Objects for WebSocket coordination and message history storage.[](https://developers.cloudflare.com/durable-objects/demos/)
- **Multiplayer Doom**: A WebAssembly port of Doom with multiplayer support using Durable Objects and WebSockets.[](https://developers.cloudflare.com/durable-objects/demos/)
- **Wildebeest**: An ActivityPub and Mastodon-compatible server running on Durable Objects.[](https://developers.cloudflare.com/durable-objects/demos/)
- **Rate Limiter and Counter**: Simple examples demonstrating state persistence and RPC.[](https://developers.cloudflare.com/durable-objects/examples/)

---

### **Best Practices**

1. **Persist Critical State**: Always write critical state to the Storage API to survive evictions or restarts.[](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/)
2. **Use SQLite Backend**: Prefer SQLite for new projects due to its flexibility and features like Point-in-Time Recovery.[](https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/)
3. **Leverage WebSocket Hibernation**: For WebSocket applications, use the Hibernation API to reduce costs.[](https://developers.cloudflare.com/durable-objects/platform/pricing/)
4. **Optimize for Single-Threading**: Design applications to minimize heavy computation within a single Durable Object, and scale horizontally by creating more objects.[](https://developers.cloudflare.com/durable-objects/platform/limits/)
5. **Test Locally**: Use `wrangler dev` to simulate Durable Objects locally, but test deployed performance due to latency differences.[](https://flaredup.substack.com/p/the-ultimate-guide-to-cloudflares)
6. **Monitor Costs**: Track compute duration and request volume in the Cloudflare dashboard to manage billing.[](https://developers.cloudflare.com/durable-objects/platform/pricing/)

---

### **Conclusion**

Cloudflare Durable Objects offer a unique approach to building stateful, serverless applications with strong consistency, low latency, and global scalability. By combining compute and storage in a single-threaded, globally unique instance, they simplify the development of real-time, collaborative, and distributed systems. While they require careful design to manage limitations like single-threaded execution and in-memory state, their integration with Cloudflare’s global network and features like WebSocket Hibernation and Alarms make them a powerful tool for modern applications. For more details, explore the Cloudflare Durable Objects documentation and try the provided templates to get started.[](https://developers.cloudflare.com/durable-objects/)[](https://github.com/cloudflare/durable-objects-template)

