---
layout: post
title: "Kafka Message Uniqueness and Ordering Guarantees"
author: "chanchan"
categories: journal
tags: [documentation,sample]
image: mountains.jpg
toc: true
---

Strictly guaranteeing message uniqueness and ordering in Kafka while avoiding message duplication or loss during network issues is a complex requirement. It requires comprehensive design from three aspects: producer, consumer, and offset management.

## Requirements Analysis

### Uniqueness
- Ensure each message is consumed only once, avoiding duplicate consumption
- May need to carry unique identifiers (like UUID) in messages and implement deduplication at the consumer end

### Ordering
- Guarantee messages are consumed in the order sent by the producer
- Kafka's partitioning mechanism naturally supports in-partition ordering, so related messages need to be sent to the same partition

### Reliability Under Network Issues
- Network interruptions may cause offset commit failures or messages not being properly processed
- Need to ensure "at-least-once" consumption and achieve "exactly-once" consumption through deduplication

Based on these requirements, we need:
- Ensure ordered messages with unique identifiers at the producer end
- Use manual offset commit with idempotency checks at the consumer end
- Maintain consistency through transactional or log recovery mechanisms in exceptional cases (like network issues)

## Solution Design

### 1. Producer Side

Ensuring order: Send messages that need ordered consumption to the same partition. This can be achieved by specifying a partition or using a consistent key (Kafka determines the partition based on the key's hash).
Ensuring uniqueness: Add unique identifiers (like UUID) to each message and carry them in the message content.

Example producer code:

```go
package main

import (
    "fmt"
    "github.com/IBM/sarama"
    "log"
    "time"
)

func main() {
    config := sarama.NewConfig()
    config.Producer.RequiredAcks = sarama.WaitForAll // Wait for all replicas to confirm
    config.Producer.Retry.Max = 5                    // Number of retries
    config.Producer.Return.Successes = true          // Return success messages

    producer, err := sarama.NewSyncProducer([]string{"localhost:9092"}, config)
    if err != nil {
        log.Fatalf("Failed to create producer: %v", err)
    }
    defer producer.Close()

    topic := "test-topic"
    for i := 0; i < 10; i++ {
        msg := &sarama.ProducerMessage{
            Topic: topic,
            Key:   sarama.StringEncoder("order-key"), // Use fixed key for ordering
            Value: sarama.StringEncoder(fmt.Sprintf("msg-%d|%s", i, time.Now().String())),
        }
        partition, offset, err := producer.SendMessage(msg)
        if err != nil {
            log.Printf("Failed to send message: %v", err)
        } else {
            fmt.Printf("Message sent to partition %d, offset %d\n", partition, offset)
        }
    }
}
```

### 2. Consumer Side

- Ordering: Consume from a single partition (or ensure consumer group assigns only one partition)
- Uniqueness: Use memory or persistent storage (like Redis, database) to record processed message IDs for deduplication
- Offset commit: Manually commit offsets, ensuring messages are processed successfully before committing
- Network issue handling: Use transactional commits or logging to ensure recovery after exceptions

Here's an example consumer code:

```go
package main

import (
    "context"
    "fmt"
    "log"
    "os"
    "os/signal"
    "strings"
    "sync"

    "github.com/IBM/sarama"
)

// ProcessedMessages for recording processed message IDs (simulating persistent storage)
type ProcessedMessages struct {
    sync.Mutex
    ids map[string]bool
}

func NewProcessedMessages() *ProcessedMessages {
    return &ProcessedMessages{
        ids: make(map[string]bool),
    }
}

func (p *ProcessedMessages) IsProcessed(id string) bool {
    p.Lock()
    defer p.Unlock()
    return p.ids[id]
}

func (p *ProcessedMessages) MarkProcessed(id string) {
    p.Lock()
    defer p.Unlock()
    p.ids[id] = true
}

type consumerGroupHandler struct {
    processed *ProcessedMessages
}

func (h consumerGroupHandler) Setup(_ sarama.ConsumerGroupSession) error   { return nil }
func (h consumerGroupHandler) Cleanup(_ sarama.ConsumerGroupSession) error { return nil }
func (h consumerGroupHandler) ConsumeClaim(session sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
    for msg := range claim.Messages() {
        // Assume message format is "msg-id|content"
        parts := strings.SplitN(string(msg.Value), "|", 2)
        if len(parts) != 2 {
            log.Printf("Invalid message format: %s", msg.Value)
            continue
        }
        msgID := parts[0]

        // Check if already processed
        if h.processed.IsProcessed(msgID) {
            log.Printf("Message %s already processed, skipping", msgID)
            session.MarkMessage(msg, "") // Mark as processed to avoid duplicate commits
            continue
        }

        // Process message
        fmt.Printf("Processing message: Offset=%d, ID=%s, Value=%s\n", msg.Offset, msgID, parts[1])

        // Simulate business processing
        // Add database operations, logging, etc. here

        // Mark as processed
        h.processed.MarkProcessed(msgID)

        // Commit offset
        session.MarkMessage(msg, "")
        session.Commit() // Manual commit to ensure successful processing
    }
    return nil
}

func main() {
    config := sarama.NewConfig()
    config.Consumer.Group.Rebalance.Strategy = sarama.BalanceStrategyRoundRobin
    config.Consumer.Offsets.Initial = sarama.OffsetOldest
    config.Consumer.Offsets.AutoCommit.Enable = false // Disable auto-commit

    client, err := sarama.NewConsumerGroup([]string{"localhost:9092"}, "my-group", config)
    if err != nil {
        log.Fatalf("Failed to create consumer group: %v", err)
    }
    defer client.Close()

    processed := NewProcessedMessages()
    handler := consumerGroupHandler{processed: processed}
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

## Key Points Analysis

### Uniqueness Guarantee
- Use `ProcessedMessages` structure to record processed message IDs (recommend using Redis or database for persistence in production)
- Check if ID exists before processing message, skip if already exists

### Ordering Guarantee
- Producer uses fixed key (e.g., "order-key") to ensure messages go to same partition
- Consumer only consumes from single partition (or assigns single partition through consumer group)

### Reliability Under Network Issues
- Manual offset commit: Only commit offset after message is successfully processed and recorded
- Idempotency: Even if network interruption causes offset commit failure, duplicate processing is avoided through ID check on restart
- Transactions (optional): For stronger guarantees, use Kafka's transactional producers and consumers (supported by sarama but requires additional configuration)

## Exception Scenario Handling

### Network Interruption, Offset Not Committed
- Consumer starts from last committed offset after restart
- Processed messages are skipped (due to recorded IDs)

### Processing Failure, Offset Not Committed
- Next consumption will retry, ensuring no message loss

### Duplicate Consumption
- Avoid duplicate processing through ID checking

## Optimization Suggestions

### Persistent Storage
Replace `ProcessedMessages` with Redis or database to ensure state persistence after restart.

Example (using Redis):
```go
import "github.com/go-redis/redis/v8"

func (h consumerGroupHandler) IsProcessed(ctx context.Context, id string) bool {
    val, err := h.redis.Get(ctx, id).Result()
    return err == nil && val == "1"
}

func (h consumerGroupHandler) MarkProcessed(ctx context.Context, id string) {
    h.redis.Set(ctx, id, "1", 0)
}
```

### Batch Commit
For better performance, process and commit offsets in batches:
```go
batchSize := 10
count := 0
for msg := range claim.Messages() {
    // Process message
    session.MarkMessage(msg, "")
    count++
    if count%batchSize == 0 {
        session.Commit()
    }
}
```

### Logging
Record operation logs when processing messages for state recovery during exceptions.

## Summary

You can meet the requirements through these measures:
- Producer: Fixed key for ordering, unique ID for deduplication
- Consumer: Manual offset commit with idempotency check (ID deduplication)
- Exception handling: Persist processed states to ensure consistency after network issues

This solution implements "exactly-once" semantics and prevents message duplication or loss during network issues. For stronger guarantees, you can further introduce Kafka's transaction support or external state management (like database transactions). 