---
layout: post
title: "DDD - example"
author: "chanchan"
categories: journal
tags: [system design]
image: mountains.jpg
toc: true
---

To demonstrate how to apply Domain-Driven Design (DDD) to a word memorization software using your tech stack (Next.js and TypeScript), I’ll create a simplified example that focuses on the core domain concepts, tactical patterns, and their implementation. The example will include a domain model for managing a user’s word-learning progress, structured around DDD principles like entities, aggregates, repositories, and bounded contexts. I’ll provide a code example that integrates with Next.js and TypeScript, keeping the implementation practical and focused on the domain.

### **Overview of the Word Memorization Software**
The software allows users to learn and memorize vocabulary by studying words, tracking progress, and reviewing words based on a spaced repetition algorithm (e.g., reviewing words at increasing intervals to aid retention). The domain revolves around managing words, user progress, and study sessions.

### **Domain Analysis**
- **Domain**: Vocabulary learning.
- **Bounded Contexts**:
  - **Vocabulary Management**: Manages the creation and storage of words and their metadata (e.g., definitions, examples).
  - **Learning Progress**: Tracks a user’s progress for each word, including mastery level and review schedules.
  - **Study Session**: Manages active study sessions where users review words and answer questions.
- **Ubiquitous Language**:
  - Key terms: `Word`, `User`, `Progress`, `StudySession`, `MasteryLevel`, `ReviewSchedule`.
- **Focus for the Example**: We’ll focus on the **Learning Progress** bounded context, as it’s central to tracking a user’s word memorization journey.

### **Domain Model**
- **Entity**: `WordProgress` (tracks a user’s progress for a specific word, identified by a unique combination of user ID and word ID).
- **Value Object**: `MasteryLevel` (represents the user’s proficiency with a word, e.g., “Beginner,” “Intermediate,” “Mastered”).
- **Aggregate**: `WordProgress` is the aggregate root, encapsulating the user’s progress data and enforcing consistency (e.g., updating mastery level based on study results).
- **Repository**: `WordProgressRepository` (handles persistence of `WordProgress` aggregates).
- **Domain Event**: `WordProgressUpdated` (published when a user’s progress changes, e.g., after a study session).
- **Domain Service**: `SpacedRepetitionService` (calculates the next review date based on the mastery level and last review).

### **Implementation Plan**
1. Define the domain model (entities, value objects, aggregates) in TypeScript.
2. Create a repository interface for persistence.
3. Implement a domain service for spaced repetition logic.
4. Integrate the model with a Next.js API route to handle user interactions (e.g., updating progress after a study session).
5. Use a simple in-memory repository for the example (in a real app, you’d use a database like PostgreSQL or MongoDB).

Below is the code example, structured according to DDD principles and tailored to your Next.js + TypeScript stack.

```typescript
// Domain: Learning Progress Bounded Context
// Ubiquitous Language: WordProgress, MasteryLevel, ReviewSchedule, SpacedRepetitionService

import { v4 as uuidv4 } from 'uuid';

// Value Object: MasteryLevel
class MasteryLevel {
  private readonly value: string;

  constructor(value: string) {
    const validLevels = ['Beginner', 'Intermediate', 'Mastered'];
    if (!validLevels.includes(value)) {
      throw new Error(`Invalid mastery level: ${value}`);
    }
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  isMastered(): boolean {
    return this.value === 'Mastered';
  }

  nextLevel(): MasteryLevel {
    if (this.value === 'Beginner') return new MasteryLevel('Intermediate');
    if (this.value === 'Intermediate') return new MasteryLevel('Mastered');
    return this; // Already Mastered
  }
}

// Value Object: ReviewSchedule
class ReviewSchedule {
  constructor(public readonly nextReviewDate: Date) {}

  isDue(currentDate: Date): boolean {
    return currentDate >= this.nextReviewDate;
  }
}

// Entity: WordProgress (Aggregate Root)
class WordProgress {
  private readonly id: string; // Unique ID for the progress (e.g., userId_wordId)
  private readonly userId: string;
  private readonly wordId: string;
  private masteryLevel: MasteryLevel;
  private reviewSchedule: ReviewSchedule;

  constructor(userId: string, wordId: string, masteryLevel: MasteryLevel, reviewSchedule: ReviewSchedule) {
    this.id = `${userId}_${wordId}`;
    this.userId = userId;
    this.wordId = wordId;
    this.masteryLevel = masteryLevel;
    this.reviewSchedule = reviewSchedule;
  }

  getId(): string {
    return this.id;
  }

  getMasteryLevel(): MasteryLevel {
    return this.masteryLevel;
  }

  getReviewSchedule(): ReviewSchedule {
    return this.reviewSchedule;
  }

  // Business logic: Update progress based on study result
  updateProgress(correct: boolean, spacedRepetitionService: SpacedRepetitionService): WordProgressUpdated {
    if (correct && !this.masteryLevel.isMastered()) {
      this.masteryLevel = this.masteryLevel.nextLevel();
    }
    this.reviewSchedule = spacedRepetitionService.calculateNextReview(this.masteryLevel);
    return new WordProgressUpdated(this.id, this.userId, this.wordId, this.masteryLevel.getValue());
  }
}

// Domain Event: WordProgressUpdated
class WordProgressUpdated {
  constructor(
    public readonly progressId: string,
    public readonly userId: string,
    public readonly wordId: string,
    public readonly newMasteryLevel: string
  ) {}
}

// Domain Service: SpacedRepetitionService
class SpacedRepetitionService {
  calculateNextReview(masteryLevel: MasteryLevel): ReviewSchedule {
    const now = new Date();
    let daysToAdd = 1;
    switch (masteryLevel.getValue()) {
      case 'Beginner':
        daysToAdd = 1;
        break;
      case 'Intermediate':
        daysToAdd = 3;
        break;
      case 'Mastered':
        daysToAdd = 7;
        break;
    }
    const nextReviewDate = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    return new ReviewSchedule(nextReviewDate);
  }
}

// Repository Interface
interface WordProgressRepository {
  findById(id: string): Promise<WordProgress | null>;
  save(progress: WordProgress): Promise<void>;
}

// In-Memory Repository (for demonstration; replace with database in production)
class InMemoryWordProgressRepository implements WordProgressRepository {
  private store: Map<string, WordProgress> = new Map();

  async findById(id: string): Promise<WordProgress | null> {
    return this.store.get(id) || null;
  }

  async save(progress: WordProgress): Promise<void> {
    this.store.set(progress.getId(), progress);
  }
}

// Factory for creating WordProgress
class WordProgressFactory {
  static create(userId: string, wordId: string, spacedRepetitionService: SpacedRepetitionService): WordProgress {
    const initialMastery = new MasteryLevel('Beginner');
    const initialSchedule = spacedRepetitionService.calculateNextReview(initialMastery);
    return new WordProgress(userId, wordId, initialMastery, initialSchedule);
  }
}

// Example Usage in a Next.js API Route
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, wordId, correct } = req.body;
    const spacedRepetitionService = new SpacedRepetitionService();
    const repository = new InMemoryWordProgressRepository();

    // Load or create WordProgress
    let progress = await repository.findById(`${userId}_${wordId}`);
    if (!progress) {
      progress = WordProgressFactory.create(userId, wordId, spacedRepetitionService);
    }

    // Update progress
    const event = progress.updateProgress(correct, spacedRepetitionService);
    await repository.save(progress);

    // Return response
    res.status(200).json({
      progressId: event.progressId,
      userId: event.userId,
      wordId: event.wordId,
      masteryLevel: event.newMasteryLevel,
      nextReviewDate: progress.getReviewSchedule().nextReviewDate,
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
```

### **Explanation of the Code**
- **Bounded Context**: The code focuses on the **Learning Progress** context, managing how users progress in memorizing words.
- **Entities and Value Objects**:
  - `WordProgress` is the aggregate root, encapsulating `MasteryLevel` and `ReviewSchedule`.
  - `MasteryLevel` is a value object that enforces valid proficiency levels.
  - `ReviewSchedule` is a value object that tracks when a word should be reviewed next.
- **Domain Service**: `SpacedRepetitionService` encapsulates the logic for calculating review intervals based on mastery level (e.g., 1 day for Beginner, 3 days for Intermediate).
- **Repository**: `InMemoryWordProgressRepository` provides a simple persistence layer. In a real app, you’d replace it with a database-backed repository (e.g., using Prisma or MongoDB).
- **Domain Event**: `WordProgressUpdated` is published when progress changes, allowing other contexts (e.g., Study Session) to react (e.g., update session statistics).
- **Factory**: `WordProgressFactory` ensures new `WordProgress` instances are created with valid initial states.
- **Next.js Integration**: The API route (`/api/word-progress`) handles requests to update progress (e.g., after a user answers a word correctly or incorrectly in a study session).

### **How to Use in a Next.js App**
1. **File Structure**:
   - Place the domain code in `lib/domain/word-memorization-domain.ts`.
   - The API route can be placed in `pages/api/word-progress.ts`.
2. **Frontend**:
   - Create a React component to call the API (e.g., a study interface where users answer word questions).
   - Use `fetch` or `axios` to send POST requests to `/api/word-progress` with `{ userId, wordId, correct }`.
3. **Persistence**:
   - Replace `InMemoryWordProgressRepository` with a real database (e.g., PostgreSQL with Prisma) for production.
4. **Event Handling**:
   - Use a message queue (e.g., Redis or RabbitMQ) to publish and handle `WordProgressUpdated` events for cross-context communication.

### **Extending the Example**
- **Vocabulary Management Context**: Add a `Word` entity with attributes like definition, translation, and example sentences. Create a `WordRepository` to manage word data.
- **Study Session Context**: Implement a `StudySession` aggregate to manage active study sessions, selecting words due for review based on `ReviewSchedule`.
- **Context Mapping**: Use domain events to integrate contexts. For example, the Learning Progress context can subscribe to `WordAdded` events from the Vocabulary Management context to initialize `WordProgress` for new words.

This example demonstrates DDD’s core principles (ubiquitous language, aggregates, bounded contexts) in a practical TypeScript and Next.js implementation.