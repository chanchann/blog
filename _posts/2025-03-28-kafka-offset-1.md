---
layout: post
title: "Kafka Offsets Basic"
author: "chanchan"
categories: journal
tags: [documentation,sample]
image: mountains.jpg
toc: true
---

In Apache Kafka, offset is a core concept that represents the position of a consumer's read pointer within a partition. Kafka is a distributed messaging system where each topic is divided into multiple partitions, and each message within a partition has a unique offset starting from 0 and incrementing sequentially. Consumers track these offsets to know which messages they've consumed and where to continue reading from in subsequent sessions.

## 1. Purpose of Offsets

- **Message Position Identification**: Offsets serve as unique identifiers for messages within a partition, similar to array indices. When producers write messages to a partition, Kafka assigns each message an offset.
- **Consumption Progress Management**: Consumers track their progress by recording offsets. If a consumer stops and restarts, it can continue from its last offset, preventing message duplication or loss.
- **Replay Support**: By manually setting offsets, consumers can rewind to historical positions to reprocess messages or jump to specific positions.

In Kafka, offsets are managed at the partition level, with each consumer group maintaining its own offset for each partition.

## 2. Offset Management Methods

Kafka provides two main approaches to offset management:

### Auto Commit
- Consumers automatically commit their current consumption offset to Kafka's special topic `__consumer_offsets` at regular intervals
- **Advantages**: Simple, suitable for scenarios where message loss is tolerable
- **Disadvantages**: May lead to message duplication if the consumer crashes while processing (as the offset is committed but message processing is incomplete)

### Manual Commit
- Consumers manually commit offsets after processing messages
- **Advantages**: More precise, ensures messages are processed before committing, prevents duplicate consumption
- **Disadvantages**: Requires developers to manage commit logic

Kafka stores offsets in the `__consumer_offsets` topic, where consumer groups persist their consumption progress.

## 3. Working with Offsets Using the Sarama Library

### 3.1 Basic Consumer Configuration

First, let's create a consumer and configure its offset management. Here's a simple example:

```go
package main

import (
    "fmt"
    "log"
    "os"
    "os/signal"

    "github.com/IBM/sarama"
)

func main() {
    // Configure Kafka consumer
    config := sarama.NewConfig()
    config.Consumer.Return.Errors = true
    // Set automatic offset commit with 1-second interval
    config.Consumer.Offsets.AutoCommit.Enable = true
    config.Consumer.Offsets.AutoCommit.Interval = 1e9 // 1 second
    // Set initial offset (start consuming from earliest message)
    config.Consumer.Offsets.Initial = sarama.OffsetOldest

    // Create consumer
    consumer, err := sarama.NewConsumer([]string{"localhost:9092"}, config)
    if err != nil {
        log.Fatalf("Failed to create consumer: %v", err)
    }
    defer consumer.Close()

    // Subscribe to topic and partition
    topic := "test-topic"
    partition := int32(0)
    partitionConsumer, err := consumer.ConsumePartition(topic, partition, sarama.OffsetOldest)
    if err != nil {
        log.Fatalf("Failed to consume partition: %v", err)
    }
    defer partitionConsumer.Close()

    // Capture signals for graceful shutdown
    signals := make(chan os.Signal, 1)
    signal.Notify(signals, os.Interrupt)

    // Consume messages
    for {
        select {
        case msg := <-partitionConsumer.Messages():
            fmt.Printf("Received message: Offset=%d, Key=%s, Value=%s\n", msg.Offset, string(msg.Key), string(msg.Value))
        case err := <-partitionConsumer.Errors():
            log.Printf("Error: %v\n", err)
        case <-signals:
            fmt.Println("Interrupt received, shutting down...")
            return
        }
    }
}
```

**Key Points**:
- `config.Consumer.Offsets.Initial`: Sets where to start consuming when the consumer starts. Common options:
  - `sarama.OffsetOldest`: Start from the earliest message
  - `sarama.OffsetNewest`: Start from the latest message
- `config.Consumer.Offsets.AutoCommit.Enable`: Enables automatic offset commit
- `partitionConsumer.Messages()`: Returns a channel for receiving messages, with message structs containing Offset field

### 3.2 Manual Offset Commit

For more precise offset control, you can disable automatic commit and manually call commit methods. Here's an example:

```go
package main

import (
    "fmt"
    "log"
    "os"
    "os/signal"

    "github.com/IBM/sarama"
)

func main() {
    config := sarama.NewConfig()
    config.Consumer.Return.Errors = true
    // Disable automatic commit
    config.Consumer.Offsets.AutoCommit.Enable = false
    config.Consumer.Offsets.Initial = sarama.OffsetOldest

    consumer, err := sarama.NewConsumer([]string{"localhost:9092"}, config)
    if err != nil {
        log.Fatalf("Failed to create consumer: %v", err)
    }
    defer consumer.Close()

    topic := "test-topic"
    partition := int32(0)
    partitionConsumer, err := consumer.ConsumePartition(topic, partition, sarama.OffsetOldest)
    if err != nil {
        log.Fatalf("Failed to consume partition: %v", err)
    }
    defer partitionConsumer.Close()

    signals := make(chan os.Signal, 1)
    signal.Notify(signals, os.Interrupt)

    for {
        select {
        case msg := <-partitionConsumer.Messages():
            fmt.Printf("Received message: Offset=%d, Key=%s, Value=%s\n", msg.Offset, string(msg.Key), string(msg.Value))
            // Manually commit offset
            err = partitionConsumer.CommitOffsets()
            if err != nil {
                log.Printf("Failed to commit offset: %v", err)
            } else {
                fmt.Printf("Offset %d committed\n", msg.Offset)
            }
        case err := <-partitionConsumer.Errors():
            log.Printf("Error: %v\n", err)
        case <-signals:
            fmt.Println("Interrupt received, shutting down...")
            return
        }
    }
}
```

**Key Points**:
- `config.Consumer.Offsets.AutoCommit.Enable = false`: Disables automatic commit
- `partitionConsumer.CommitOffsets()`: Manually commits the current consumption offset

### 3.3 Using Consumer Groups

In production environments, consumer groups are typically used to achieve load balancing and fault tolerance. Sarama provides the ConsumerGroup interface for this purpose:

```go
package main

import (
    "context"
    "fmt"
    "log"
    "os"
    "os/signal"

    "github.com/IBM/sarama"
)

type exampleConsumerGroupHandler struct{}

func (h exampleConsumerGroupHandler) Setup(_ sarama.ConsumerGroupSession) error   { return nil }
func (h exampleConsumerGroupHandler) Cleanup(_ sarama.ConsumerGroupSession) error { return nil }
func (h exampleConsumerGroupHandler) ConsumeClaim(session sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
    for msg := range claim.Messages() {
        fmt.Printf("Received message: Offset=%d, Key=%s, Value=%s\n", msg.Offset, string(msg.Key), string(msg.Value))
        // Mark message as processed, commit offset
        session.MarkMessage(msg, "")
    }
    return nil
}

func main() {
    config := sarama.NewConfig()
    config.Consumer.Group.Rebalance.Strategy = sarama.BalanceStrategyRoundRobin
    config.Consumer.Offsets.Initial = sarama.OffsetOldest

    client, err := sarama.NewConsumerGroup([]string{"localhost:9092"}, "my-group", config)
    if err != nil {
        log.Fatalf("Failed to create consumer group: %v", err)
    }
    defer client.Close()

    handler := exampleConsumerGroupHandler{}
    topics := []string{"test-topic"}

    ctx, cancel := context.WithCancel(context.Background())
    signals := make(chan os.Signal, 1)
    signal.Notify(signals, os.Interrupt)

    go func() {
        for {
            err := client.Consume(ctx, topics, handler)
            if err != nil {
                log.Printf("Consumer group error: %v", err)
            }
            if ctx.Err() != nil {
                return
            }
        }
    }()

    <-signals
    fmt.Println("Interrupt received, shutting down...")
    cancel()
}
```

**Key Points**:
- `sarama.ConsumerGroupSession.MarkMessage(msg, "")`: Marks message as processed, commits offset
- `session.Commit()`: Can be used to manually commit all marked offsets when needed
- Consumer groups automatically manage offsets, storing them in Kafka's `__consumer_offsets` topic

## 4. Advanced Offset Usage

### Resetting Offsets
To rewind consumption, you can reset consumer group offsets using Kafka tools (like `kafka-consumer-groups.sh`) or specify particular offsets in code.

### Querying Offsets
Sarama provides the OffsetManager interface for querying and managing offsets. For example:

```go
offsetManager, err := sarama.NewOffsetManagerFromClient("my-group", client)
partitionOffsetManager, err := offsetManager.ManagePartition("test-topic", 0)
nextOffset, _ := partitionOffsetManager.NextOffset()
fmt.Printf("Next offset: %d\n", nextOffset)
```

## 5. Important Considerations

### Duplicate Consumption and Message Loss
- Automatic commits may lead to duplicate consumption (processing incomplete but offset committed)
- Manual commits may lead to message loss (processing complete but offset not committed)

### Performance
- Frequent offset commits increase Kafka's load; batch commits are recommended

### Error Handling
- Ensure proper error handling during offset commits to avoid consumption interruptions
# Understanding Kafka Offsets

In Apache Kafka, offset is a core concept that represents the position of a consumer's read pointer within a partition. Kafka is a distributed messaging system where each topic is divided into multiple partitions, and each message within a partition has a unique offset starting from 0 and incrementing sequentially. Consumers track these offsets to know which messages they've consumed and where to continue reading from in subsequent sessions.

## 1. Purpose of Offsets

- **Message Position Identification**: Offsets serve as unique identifiers for messages within a partition, similar to array indices. When producers write messages to a partition, Kafka assigns each message an offset.
- **Consumption Progress Management**: Consumers track their progress by recording offsets. If a consumer stops and restarts, it can continue from its last offset, preventing message duplication or loss.
- **Replay Support**: By manually setting offsets, consumers can rewind to historical positions to reprocess messages or jump to specific positions.

In Kafka, offsets are managed at the partition level, with each consumer group maintaining its own offset for each partition.

## 2. Offset Management Methods

Kafka provides two main approaches to offset management:

### Auto Commit
- Consumers automatically commit their current consumption offset to Kafka's special topic `__consumer_offsets` at regular intervals
- **Advantages**: Simple, suitable for scenarios where message loss is tolerable
- **Disadvantages**: May lead to message duplication if the consumer crashes while processing (as the offset is committed but message processing is incomplete)

### Manual Commit
- Consumers manually commit offsets after processing messages
- **Advantages**: More precise, ensures messages are processed before committing, prevents duplicate consumption
- **Disadvantages**: Requires developers to manage commit logic

Kafka stores offsets in the `__consumer_offsets` topic, where consumer groups persist their consumption progress.

## 3. Working with Offsets Using the Sarama Library

### 3.1 Basic Consumer Configuration

First, let's create a consumer and configure its offset management. Here's a simple example:

```go
package main

import (
    "fmt"
    "log"
    "os"
    "os/signal"

    "github.com/IBM/sarama"
)

func main() {
    // Configure Kafka consumer
    config := sarama.NewConfig()
    config.Consumer.Return.Errors = true
    // Set automatic offset commit with 1-second interval
    config.Consumer.Offsets.AutoCommit.Enable = true
    config.Consumer.Offsets.AutoCommit.Interval = 1e9 // 1 second
    // Set initial offset (start consuming from earliest message)
    config.Consumer.Offsets.Initial = sarama.OffsetOldest

    // Create consumer
    consumer, err := sarama.NewConsumer([]string{"localhost:9092"}, config)
    if err != nil {
        log.Fatalf("Failed to create consumer: %v", err)
    }
    defer consumer.Close()

    // Subscribe to topic and partition
    topic := "test-topic"
    partition := int32(0)
    partitionConsumer, err := consumer.ConsumePartition(topic, partition, sarama.OffsetOldest)
    if err != nil {
        log.Fatalf("Failed to consume partition: %v", err)
    }
    defer partitionConsumer.Close()

    // Capture signals for graceful shutdown
    signals := make(chan os.Signal, 1)
    signal.Notify(signals, os.Interrupt)

    // Consume messages
    for {
        select {
        case msg := <-partitionConsumer.Messages():
            fmt.Printf("Received message: Offset=%d, Key=%s, Value=%s\n", msg.Offset, string(msg.Key), string(msg.Value))
        case err := <-partitionConsumer.Errors():
            log.Printf("Error: %v\n", err)
        case <-signals:
            fmt.Println("Interrupt received, shutting down...")
            return
        }
    }
}
```

**Key Points**:
- `config.Consumer.Offsets.Initial`: Sets where to start consuming when the consumer starts. Common options:
  - `sarama.OffsetOldest`: Start from the earliest message
  - `sarama.OffsetNewest`: Start from the latest message
- `config.Consumer.Offsets.AutoCommit.Enable`: Enables automatic offset commit
- `partitionConsumer.Messages()`: Returns a channel for receiving messages, with message structs containing Offset field

### 3.2 Manual Offset Commit

For more precise offset control, you can disable automatic commit and manually call commit methods. Here's an example:

```go
package main

import (
    "fmt"
    "log"
    "os"
    "os/signal"

    "github.com/IBM/sarama"
)

func main() {
    config := sarama.NewConfig()
    config.Consumer.Return.Errors = true
    // Disable automatic commit
    config.Consumer.Offsets.AutoCommit.Enable = false
    config.Consumer.Offsets.Initial = sarama.OffsetOldest

    consumer, err := sarama.NewConsumer([]string{"localhost:9092"}, config)
    if err != nil {
        log.Fatalf("Failed to create consumer: %v", err)
    }
    defer consumer.Close()

    topic := "test-topic"
    partition := int32(0)
    partitionConsumer, err := consumer.ConsumePartition(topic, partition, sarama.OffsetOldest)
    if err != nil {
        log.Fatalf("Failed to consume partition: %v", err)
    }
    defer partitionConsumer.Close()

    signals := make(chan os.Signal, 1)
    signal.Notify(signals, os.Interrupt)

    for {
        select {
        case msg := <-partitionConsumer.Messages():
            fmt.Printf("Received message: Offset=%d, Key=%s, Value=%s\n", msg.Offset, string(msg.Key), string(msg.Value))
            // Manually commit offset
            err = partitionConsumer.CommitOffsets()
            if err != nil {
                log.Printf("Failed to commit offset: %v", err)
            } else {
                fmt.Printf("Offset %d committed\n", msg.Offset)
            }
        case err := <-partitionConsumer.Errors():
            log.Printf("Error: %v\n", err)
        case <-signals:
            fmt.Println("Interrupt received, shutting down...")
            return
        }
    }
}
```

**Key Points**:
- `config.Consumer.Offsets.AutoCommit.Enable = false`: Disables automatic commit
- `partitionConsumer.CommitOffsets()`: Manually commits the current consumption offset

### 3.3 Using Consumer Groups

In production environments, consumer groups are typically used to achieve load balancing and fault tolerance. Sarama provides the ConsumerGroup interface for this purpose:

```go
package main

import (
    "context"
    "fmt"
    "log"
    "os"
    "os/signal"

    "github.com/IBM/sarama"
)

type exampleConsumerGroupHandler struct{}

func (h exampleConsumerGroupHandler) Setup(_ sarama.ConsumerGroupSession) error   { return nil }
func (h exampleConsumerGroupHandler) Cleanup(_ sarama.ConsumerGroupSession) error { return nil }
func (h exampleConsumerGroupHandler) ConsumeClaim(session sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
    for msg := range claim.Messages() {
        fmt.Printf("Received message: Offset=%d, Key=%s, Value=%s\n", msg.Offset, string(msg.Key), string(msg.Value))
        // Mark message as processed, commit offset
        session.MarkMessage(msg, "")
    }
    return nil
}

func main() {
    config := sarama.NewConfig()
    config.Consumer.Group.Rebalance.Strategy = sarama.BalanceStrategyRoundRobin
    config.Consumer.Offsets.Initial = sarama.OffsetOldest

    client, err := sarama.NewConsumerGroup([]string{"localhost:9092"}, "my-group", config)
    if err != nil {
        log.Fatalf("Failed to create consumer group: %v", err)
    }
    defer client.Close()

    handler := exampleConsumerGroupHandler{}
    topics := []string{"test-topic"}

    ctx, cancel := context.WithCancel(context.Background())
    signals := make(chan os.Signal, 1)
    signal.Notify(signals, os.Interrupt)

    go func() {
        for {
            err := client.Consume(ctx, topics, handler)
            if err != nil {
                log.Printf("Consumer group error: %v", err)
            }
            if ctx.Err() != nil {
                return
            }
        }
    }()

    <-signals
    fmt.Println("Interrupt received, shutting down...")
    cancel()
}
```

**Key Points**:
- `sarama.ConsumerGroupSession.MarkMessage(msg, "")`: Marks message as processed, commits offset
- `session.Commit()`: Can be used to manually commit all marked offsets when needed
- Consumer groups automatically manage offsets, storing them in Kafka's `__consumer_offsets` topic

## 4. Advanced Offset Usage

### Resetting Offsets
To rewind consumption, you can reset consumer group offsets using Kafka tools (like `kafka-consumer-groups.sh`) or specify particular offsets in code.

### Querying Offsets
Sarama provides the OffsetManager interface for querying and managing offsets. For example:

```go
offsetManager, err := sarama.NewOffsetManagerFromClient("my-group", client)
partitionOffsetManager, err := offsetManager.ManagePartition("test-topic", 0)
nextOffset, _ := partitionOffsetManager.NextOffset()
fmt.Printf("Next offset: %d\n", nextOffset)
```

## 5. Important Considerations

### Duplicate Consumption and Message Loss
- Automatic commits may lead to duplicate consumption (processing incomplete but offset committed)
- Manual commits may lead to message loss (processing complete but offset not committed)

### Performance
- Frequent offset commits increase Kafka's load; batch commits are recommended

### Error Handling
- Ensure proper error handling during offset commits to avoid consumption interruptions
