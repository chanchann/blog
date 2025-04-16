---
layout: post
title: "Mongodb : Basic"
author: "chanchan"
categories: journal
tags: [db]
image: mountains.jpg
toc: true
---

MongoDB is a **NoSQL**, **document-oriented** database designed for scalability, flexibility, and high performance. Unlike traditional relational databases (e.g., MySQL, PostgreSQL) that use tables and rows, MongoDB stores data in **JSON-like documents** (BSON, a binary JSON format). This makes it ideal for handling unstructured or semi-structured data and modern applications requiring rapid development and scaling.

---

### **Core Concepts of MongoDB**

1. **Document**:
   - A document is the basic unit of data in MongoDB, similar to a row in a relational database.
   - It is a JSON-like structure (BSON) consisting of key-value pairs.
   - Example:
     ```json
     {
       "_id": "123",
       "name": "John Doe",
       "age": 30,
       "city": "New York"
     }
     ```

2. **Collection**:
   - A collection is a group of MongoDB documents, analogous to a table in a relational database.
   - Collections are **schema-less**, meaning documents in a collection can have different structures.
   - Example: A `users` collection might contain documents with varying fields.

3. **Database**:
   - A database is a container for collections. A single MongoDB server can host multiple databases.
   - Example: A database named `myApp` might contain collections like `users`, `products`, and `orders`.

4. **_id Field**:
   - Every document in MongoDB has a unique `_id` field, which serves as the primary key.
   - If not provided, MongoDB automatically generates an **ObjectId** (a 12-byte unique identifier).

5. **BSON**:
   - MongoDB stores data in **BSON** (Binary JSON), which extends JSON to include additional data types like `Date`, `Binary Data`, and `ObjectId`.
   - BSON is lightweight, traversable, and efficient for storage and querying.

---

### **Key Features of MongoDB**

1. **Schema Flexibility**:
   - MongoDB is schema-less, allowing documents in the same collection to have different fields or structures.
   - This is ideal for applications with evolving data models, such as e-commerce or content management systems.

2. **Scalability**:
   - **Horizontal Scaling**: MongoDB supports **sharding**, which distributes data across multiple servers to handle large datasets and high traffic.
   - **Replica Sets**: MongoDB provides high availability through replica sets, which are groups of MongoDB servers maintaining copies of the same data for redundancy and failover.

3. **High Performance**:
   - MongoDB is optimized for read and write operations, especially for large-scale, real-time applications.
   - It supports **in-memory storage** and indexing for faster queries.

4. **Querying**:
   - MongoDB provides a rich query language supporting CRUD operations (Create, Read, Update, Delete).
   - Queries can filter, sort, and aggregate data using operators like `$eq`, `$gt`, `$in`, etc.
   - Example:
     ```javascript
     db.users.find({ age: { $gt: 25 } }).sort({ name: 1 });
     ```

5. **Indexing**:
   - MongoDB supports various index types (e.g., single-field, compound, geospatial, text) to optimize query performance.
   - Example:
     ```javascript
     db.users.createIndex({ email: 1 });
     ```

6. **Aggregation Framework**:
   - MongoDB’s aggregation pipeline allows complex data processing, such as filtering, grouping, and transforming data.
   - Example:
     ```javascript
     db.orders.aggregate([
       { $match: { status: "completed" } },
       { $group: { _id: "$customerId", total: { $sum: "$amount" } } }
     ]);
     ```

7. **Geospatial Queries**:
   - MongoDB supports geospatial data and queries, useful for location-based applications (e.g., finding nearby restaurants).
   - Example:
     ```javascript
     db.places.find({
       location: {
         $near: {
           $geometry: { type: "Point", coordinates: [-73.992, 40.758] },
           $maxDistance: 1000
         }
       }
     });
     ```

8. **Transactions**:
   - MongoDB supports **multi-document ACID transactions** (since version 4.0) for use cases requiring data consistency, such as financial applications.
   - Example:
     ```javascript
     const session = db.getMongo().startSession();
     session.startTransaction();
     db.accounts.updateOne({ _id: "A" }, { $inc: { balance: -100 } }, { session });
     db.accounts.updateOne({ _id: "B" }, { $inc: { balance: 100 } }, { session });
     session.commitTransaction();
     ```

---

### **MongoDB Architecture**

1. **Storage Engine**:
   - MongoDB uses **WiredTiger** as its default storage engine, which provides high performance, compression, and concurrency control.
   - Other storage engines (e.g., In-Memory, Encrypted) are available for specific use cases.

2. **Replication**:
   - Replica sets consist of a **primary node** (handles writes) and **secondary nodes** (replicate data for reads and failover).
   - If the primary fails, a secondary is elected as the new primary.

3. **Sharding**:
   - Sharding partitions data across multiple servers (shards) based on a **shard key**.
   - A **mongos** router directs queries to the appropriate shard.
   - Example: Sharding a `users` collection by `country` to distribute data geographically.

4. **Cluster Components**:
   - **mongod**: The MongoDB daemon process that handles database operations.
   - **mongos**: The query router for sharded clusters.
   - **Config Servers**: Store metadata for sharded clusters.

---

### **MongoDB Use Cases**

1. **Content Management**:
   - Flexible schema for storing articles, media, and metadata.
2. **E-Commerce**:
   - Handling product catalogs, user profiles, and orders with varying structures.
3. **Real-Time Analytics**:
   - Fast writes and aggregation for tracking user behavior or IoT data.
4. **IoT Applications**:
   - Storing and querying time-series or sensor data.
5. **Mobile Apps**:
   - Scalable backend for user data and app interactions.

---

### **CRUD Operations in MongoDB**

1. **Create**:
   - Insert a single document:
     ```javascript
     db.users.insertOne({ name: "Alice", age: 25 });
     ```
   - Insert multiple documents:
     ```javascript
     db.users.insertMany([{ name: "Bob", age: 30 }, { name: "Charlie", age: 35 }]);
     ```

2. **Read**:
   - Find all documents:
     ```javascript
     db.users.find();
     ```
   - Find with a condition:
     ```javascript
     db.users.find({ age: { $gte: 30 } });
     ```
   - Find one document:
     ```javascript
     db.users.findOne({ name: "Alice" });
     ```

3. **Update**:
   - Update a single document:
     ```javascript
     db.users.updateOne({ name: "Alice" }, { $set: { age: 26 } });
     ```
   - Update multiple documents:
     ```javascript
     db.users.updateMany({ age: { $lt: 30 } }, { $set: { status: "young" } });
     ```

4. **Delete**:
   - Delete a single document:
     ```javascript
     db.users.deleteOne({ name: "Bob" });
     ```
   - Delete multiple documents:
     ```javascript
     db.users.deleteMany({ age: { $gt: 40 } });
     ```

---

### **MongoDB Tools and Ecosystem**

1. **MongoDB Atlas**:
   - A fully managed cloud database service supporting AWS, Azure, and GCP.
   - Features automated backups, scaling, and monitoring.

2. **MongoDB Compass**:
   - A GUI tool for exploring, querying, and managing MongoDB data.

3. **MongoDB Shell (mongosh)**:
   - A JavaScript-based command-line interface for interacting with MongoDB.

4. **Drivers**:
   - Official drivers for languages like Node.js, Python, Java, C#, etc., for integrating MongoDB with applications.

5. **MongoDB Charts**:
   - A tool for visualizing MongoDB data through dashboards and charts.

6. **MongoDB Realm**:
   - A platform for building serverless and mobile applications with MongoDB.

---

### **Advantages of MongoDB**

- **Flexible Schema**: Adapts to changing requirements without migrations.
- **Scalability**: Supports large-scale applications with sharding and replication.
- **Developer-Friendly**: JSON-like documents align with modern programming languages.
- **Rich Ecosystem**: Tools like Atlas, Compass, and Realm simplify development and management.

---

### **Limitations of MongoDB**

- **No Joins**: MongoDB lacks native support for joins, requiring denormalized data or application-level logic.
- **Memory Usage**: Indexes and in-memory operations can consume significant RAM.
- **Complex Transactions**: While supported, transactions are less efficient than in relational databases for complex operations.
- **Consistency Trade-offs**: In distributed setups, eventual consistency may occur in replica sets.

---

### **Best Practices**

1. **Design for Your Workload**:
   - Denormalize data to avoid joins, but balance with update complexity.
   - Choose an appropriate shard key for sharded clusters.

2. **Indexing**:
   - Create indexes for frequently queried fields, but avoid over-indexing to save storage.

3. **Monitor Performance**:
   - Use MongoDB Atlas or tools like **mongostat** to track query performance and resource usage.

4. **Backup and Recovery**:
   - Regularly back up data using tools like `mongodump` or Atlas backups.

5. **Security**:
   - Enable authentication and authorization.
   - Use TLS/SSL for data in transit.
   - Restrict network access with firewalls.

---

### **Conclusion**

MongoDB is a powerful, flexible NoSQL database suited for modern applications requiring scalability and dynamic schemas. Its document model, rich query capabilities, and robust ecosystem make it a popular choice for developers. However, understanding its trade-offs (e.g., lack of joins, eventual consistency) is crucial for effective use.
