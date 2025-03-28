---
layout: post
title: "Apache Kafka Basic"
author: "chanchan"
categories: journal
tags: [documentation,sample]
image: mountains.jpg
toc: true
---

## What is Kafka?

Apache Kafka is a distributed streaming platform initially developed by LinkedIn, later open-sourced and became an Apache top-level project. It's mainly used for processing large-scale, high-throughput, real-time message streaming data. Kafka's design goals are high performance, low latency, and fault tolerance, commonly used in log collection, event sourcing, real-time data pipelines, message queuing, and other scenarios.

Simply put, Kafka is a "publish-subscribe" model messaging system:
- Producer: Sends messages to Kafka.
- Consumer: Reads messages from Kafka.
- Kafka Cluster: Responsible for storing and distributing messages.

## Kafka Core Concepts

### 1. Topic

A Topic is a category of messages in Kafka, similar to a table name in a database. Producers send messages to a specific Topic, and consumers subscribe to messages from specified Topics.

For example: In an e-commerce project, you can create two Topics, `order-events` and `user-events`, to handle order and user-related events respectively.

### 2. Partition

- Each Topic can be divided into multiple Partitions, which are key to Kafka's high throughput and parallel processing.
- Messages within a partition are ordered, but there's no ordering guarantee across partitions.
- Partitions can be distributed across different servers (Brokers), enabling horizontal scaling.
- By dividing a Topic into multiple partitions, consumers can consume in parallel, increasing processing speed.

### 3. Broker

- A Kafka cluster consists of multiple servers, each called a Broker. Brokers are responsible for storing and managing messages.
- Multiple partitions of a Topic are distributed across different Brokers, enhancing fault tolerance (if one Broker goes down, others can still work).

### 4. Producer

Producers are responsible for sending messages to specified Topics. When sending, they can specify the partition or let Kafka automatically assign it (based on the message key).

For example: Messages with order ID as the key will always be sent to the same partition, ensuring order.

### 5. Consumer

- Consumers subscribe to one or more Topics to read messages.
- Consumers can form Consumer Groups, where partitions are automatically assigned among group members, achieving load balancing.
- Each partition can only be consumed by one consumer in a consumer group, but multiple consumer groups can independently consume the same Topic.

### 6. Offset

- Each message in a partition has a unique offset, similar to an array index.
- Consumers record the offset to mark which message they've consumed, so they can continue from the last offset when restarted.

### 7. Replication

- Kafka supports partition replication to improve data reliability. If the Broker hosting the primary partition goes down, the replica can take over.
- Leader and Follower mechanism: The Leader handles read and write requests, while Followers synchronize data.

### 8. Zookeeper

- Kafka uses Zookeeper to manage cluster metadata, such as Broker status, partition Leader election, etc.
- Although Kafka is gradually reducing its dependency on Zookeeper (newer versions introduce Kafka Raft), it's still important to understand its role.

## Kafka Basic Principles

Kafka's core design is based on the following points:

### Log-Structured Storage

- Kafka stores messages as append-only logs, rather than traditional database CRUD operations.
- This design makes write speeds extremely fast, suitable for high-throughput scenarios.
- Messages are not deleted immediately but cleaned up automatically based on configured retention period or size.

### Distributed Architecture

- Through partitions and replicas, Kafka achieves high availability and scalability.
- Producers and consumers can operate in parallel, with throughput increasing linearly with cluster size.

### Zero-Copy

Kafka uses the operating system's zero-copy technology to transfer data directly from disk to network, avoiding user space copying and improving performance.

### Push-Pull Model Combination

Producers push messages to Kafka, and consumers pull messages, combining the advantages of both:
- Producers don't need to care about consumer status.
- Consumers can consume at their own pace, avoiding overload.

## What You Need to Master in Development

### 1. Installation and Configuration

Deploying Kafka: Download Kafka (recommended version 2.8 or 3.x), start Zookeeper and Kafka service.

Basic configuration:
- `broker.id`: Unique identifier for each Broker.
- `log.dirs`: Message log storage path.
- `zookeeper.connect`: Zookeeper address.
- `num.partitions`: Default number of partitions.
- `log.retention.hours`: Log retention time.

### 2. Producer Development

Dependency: Using Go's `github.com/IBM/sarama` library.

Code example:

```go
package main

import (
	"fmt"
	"log"

	"github.com/IBM/sarama"
)

func main() {
	// Configure producer
	config := sarama.NewConfig()
	config.Producer.RequiredAcks = sarama.WaitForAll // Wait for all replicas to confirm
	config.Producer.Retry.Max = 5                    // Number of retries
	config.Producer.Return.Successes = true          // Successfully sent messages will be returned in success channel

	// Create producer
	producer, err := sarama.NewSyncProducer([]string{"localhost:9092"}, config)
	if err != nil {
		log.Fatalf("Failed to create producer: %v", err)
	}
	defer func() {
		if err := producer.Close(); err != nil {
			log.Fatalf("Failed to close producer: %v", err)
		}
	}()

	// Create message
	msg := &sarama.ProducerMessage{
		Topic: "my-topic",
		Key:   sarama.StringEncoder("key"),
		Value: sarama.StringEncoder("value"),
	}

	// Send message
	partition, offset, err := producer.SendMessage(msg)
	if err != nil {
		log.Fatalf("Failed to send message: %v", err)
	}

	fmt.Printf("Message sent successfully, partition: %d, offset: %d\n", partition, offset)
}
```

Key points:
- Configure `RequiredAcks` to control message confirmation level (`NoResponse`, `WaitForLocal`, `WaitForAll`).
- Choose between synchronous (`SyncProducer`) or asynchronous (`AsyncProducer`) message sending.
- Set retry mechanism through `Producer.Retry.Max` configuration.

### 3. Consumer Development

Code example:

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"sync"

	"github.com/IBM/sarama"
)

func main() {
	// Configure consumer
	config := sarama.NewConfig()
	config.Consumer.Return.Errors = true
	config.Consumer.Offsets.Initial = sarama.OffsetOldest // Start consuming from the earliest message

	// Create consumer
	consumer, err := sarama.NewConsumerGroup([]string{"localhost:9092"}, "my-group", config)
	if err != nil {
		log.Fatalf("Failed to create consumer group: %v", err)
	}

	// Capture termination signal
	ctx, cancel := context.WithCancel(context.Background())
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt)
	
	var wg sync.WaitGroup
	wg.Add(1)
	
	go func() {
		defer wg.Done()
		for {
			// Consume messages
			if err := consumer.Consume(ctx, []string{"my-topic"}, &ConsumerGroupHandler{}); err != nil {
				log.Fatalf("Consume error: %v", err)
			}
			// Check if context is canceled
			if ctx.Err() != nil {
				return
			}
		}
	}()

	<-signals
	cancel()
	wg.Wait()
	
	if err := consumer.Close(); err != nil {
		log.Fatalf("Failed to close consumer: %v", err)
	}
}

// Implement sarama.ConsumerGroupHandler interface
type ConsumerGroupHandler struct{}

func (ConsumerGroupHandler) Setup(_ sarama.ConsumerGroupSession) error   { return nil }
func (ConsumerGroupHandler) Cleanup(_ sarama.ConsumerGroupSession) error { return nil }
func (h ConsumerGroupHandler) ConsumeClaim(session sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
	for message := range claim.Messages() {
		fmt.Printf("Message consumed: topic=%s, partition=%d, offset=%d, key=%s, value=%s\n",
			message.Topic, message.Partition, message.Offset, string(message.Key), string(message.Value))
		session.MarkMessage(message, "") // Mark message as processed
	}
	return nil
}
```

Key points:
- Use `ConsumerGroup` to implement consumer group functionality, automatically handling partition assignment and rebalancing.
- Implement the `ConsumerGroupHandler` interface to process messages.
- Use `MarkMessage` to manually commit offsets, or configure automatic commit.

### 4. Topic Management

Create a Topic:
```bash
kafka-topics.sh --create --topic my-topic --bootstrap-server localhost:9092 --partitions 3 --replication-factor 2
```

View Topic:
```bash
kafka-topics.sh --describe --topic my-topic --bootstrap-server localhost:9092
```

### 5. Performance Optimization

- Producer: Adjust batch.size and linger.ms to send messages in batches.
- Consumer: Set fetch.max.bytes and max.poll.records to control the amount of data pulled.
- Broker: Increase the number of partitions, adjust num.io.threads and num.network.threads.

### 6. Error Handling

- Handle exceptions like network interruptions, unavailable partitions, etc.
- Use retry mechanisms (retry.backoff.ms).

### 7. Monitoring and Operations

- Use tools like Kafka Manager or Confluent Control Center to monitor Topic, Broker, and consumer status.
- Pay attention to Lag (the number of messages a consumer falls behind).

## Typical Application Scenarios

- Log Collection: Send server logs to Kafka in real-time, then processed by consumers.
- Event-Driven Architecture: Microservices communicate through events via Kafka.
- Data Pipeline: Real-time synchronization from databases to data warehouses.
- Stream Processing: Combine with Kafka Streams or Flink for real-time analysis.

## Summary

Kafka is a powerful distributed messaging system, with its core being the design of Topics, partitions, and consumer groups. In development, you need to:
- Master the basic APIs of producers and consumers.
- Understand the role of partitions and Offsets.
- Optimize configuration based on project requirements.
