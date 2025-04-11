---
layout: post
title: "React AI : Basic"
author: "chanchan"
categories: journal
tags: [react]
image: mountains.jpg
toc: true
---

The `@ai-sdk/react` package is a part of the Vercel AI SDK, designed to simplify the integration of AI-powered features, particularly conversational and generative user interfaces, into React applications. It provides a set of React hooks that streamline the process of building chatbot-like interfaces, handling streaming AI responses, and managing state for chat interactions. Below, I’ll break down the key concepts, features, and usage of `@ai-sdk/react` in detail, assuming you’re familiar with React and TypeScript/JavaScript.

---

### 1. **Overview of `@ai-sdk/react`**
`@ai-sdk/react` is a UI-focused module within the Vercel AI SDK ecosystem, specifically tailored for React applications. It abstracts the complexity of interacting with large language models (LLMs) from providers like OpenAI, Anthropic, Google, and others, allowing developers to focus on building intuitive and dynamic user interfaces. The package provides hooks like `useChat`, `useCompletion`, and `useAssistant` to handle conversational workflows, text completions, and assistant-based interactions.

Key purposes:
- Build conversational UIs (e.g., chatbots) with minimal setup.
- Stream AI-generated responses in real-time for a smooth user experience.
- Manage chat state (messages, input, status) automatically.
- Support multi-modal interactions (text, images, tool calls, etc.).
- Enable framework-agnostic AI integration (works with React, Next.js, and more).

---

### 2. **Core Hooks and Their Functionality**

#### a) **`useChat` Hook**
The `useChat` hook is the primary tool for creating conversational interfaces, such as chatbots. It handles the full lifecycle of a chat interaction, including sending user messages to an API, streaming AI responses, and updating the UI.

**Key Features**:
- **Message Management**: Maintains an array of messages (`messages`) with roles (`user`, `assistant`, `system`, etc.) and content.
- **Streaming Support**: Streams AI responses incrementally, allowing real-time updates to the UI.
- **Input Handling**: Provides `input`, `handleInputChange`, and `handleSubmit` for managing user input and form submissions.
- **Status Tracking**: Tracks the state of the chat (e.g., `ready`, `loading`, `error`) via the `status` property.
- **Tool Calls**: Supports client-side execution of tool calls (e.g., for function calling with LLMs).

**Basic Example**:
```jsx
'use client';
import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/chat', // Backend API route to handle LLM requests
  });

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.role}: </strong>
          {message.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          disabled={status !== 'ready'}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

**Key Parameters**:
- `api`: The endpoint (relative or absolute URL) for sending chat requests (e.g., `/api/chat`).
- `id`: A unique identifier for the chat session to share state across components.
- `initialMessages`: An optional array of initial messages to seed the conversation.
- `initialInput`: An optional string to prefill the input field.
- `onToolCall`: A callback for handling tool calls from the LLM (experimental).
- `fetch`: A custom fetch function for API calls (defaults to global `fetch`).
- `headers` and `body`: Additional options to customize API requests.
- `onError` and `onFinish`: Callbacks for handling errors and stream completion.

**Backend Setup**:
The `api` endpoint must handle LLM requests and return streamed responses. For example, with Next.js:
```ts
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = await streamText({
    model: openai('gpt-4o'),
    messages,
    system: 'You are a helpful assistant.',
  });
  return result.toDataStreamResponse();
}
```

**Use Cases**:
- Building multi-turn chatbots.
- Streaming long-form AI responses (e.g., for storytelling or Q&A).
- Integrating with tools for dynamic actions (e.g., fetching weather data).

#### b) **`useCompletion` Hook**
The `useCompletion` hook is designed for single-turn text completions, where the user provides a prompt, and the AI generates a one-off response. It’s simpler than `useChat` and ideal for non-conversational tasks.

**Key Features**:
- Manages a single prompt and response cycle.
- Streams completions incrementally.
- Provides `completion` (the generated text), `input`, `handleInputChange`, and `handleSubmit`.
- Tracks completion status (`status`) and errors.

**Example**:
```jsx
'use client';
import { useCompletion } from '@ai-sdk/react';

export default function Completion() {
  const { completion, input, handleInputChange, handleSubmit, status } = useCompletion({
    api: '/api/completion',
  });

  return (
    <div>
      <p>Generated Text: {completion}</p>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Enter a prompt..."
          disabled={status !== 'ready'}
        />
        <button type="submit">Generate</button>
      </form>
    </div>
  );
}
```

**Key Parameters**:
- Similar to `useChat` (`api`, `initialInput`, `onError`, etc.).
- Does not maintain a message history, focusing on single prompts.

**Backend Setup**:
```ts
// app/api/completion/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const result = await streamText({
    model: openai('gpt-4o'),
    prompt,
  });
  return result.toDataStreamResponse();
}
```

**Use Cases**:
- Generating summaries, translations, or creative writing based on a single prompt.
- Autocompleting text in forms or editors.

#### c) **`useAssistant` Hook**
The `useAssistant` hook is tailored for integrating with OpenAI’s Assistants API, which supports persistent threads and advanced features like file uploads and tool execution.

**Key Features**:
- Manages assistant threads and messages.
- Streams assistant responses.
- Supports file uploads and retrieval-augmented generation (RAG).
- Provides similar properties to `useChat` (`messages`, `input`, `handleSubmit`, etc.).

**Example**:
```jsx
'use client';
import { useAssistant } from '@ai-sdk/react';

export default function AssistantChat() {
  const { messages, input, handleInputChange, handleSubmit } = useAssistant({
    api: '/api/assistant',
    assistantId: 'asst_123', // OpenAI Assistant ID
  });

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.role}: </strong>
          {message.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask the assistant..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

**Key Parameters**:
- `assistantId`: The ID of the OpenAI Assistant.
- `threadId`: Optional thread ID for persistent conversations.
- Supports similar options as `useChat`.

**Backend Setup**:
Requires integration with OpenAI’s Assistants API, typically using `@ai-sdk/openai`.

**Use Cases**:
- Building assistants with persistent context (e.g., customer support bots).
- Handling file-based queries (e.g., analyzing uploaded documents).
- Implementing complex workflows with tools and RAG.

---

### 3. **Key Concepts and Features**

#### a) **Streaming Responses**
Streaming is a core feature of `@ai-sdk/react`. Instead of waiting for the entire AI response, the hooks stream partial responses as they’re generated, updating the UI in real-time. This is achieved using Vercel AI SDK’s `streamText` or `streamUI` functions on the backend, which return a `ReadableStream` that the hooks consume.

- **Why It Matters**: Reduces perceived latency, especially for long responses.
- **Implementation**: The hooks automatically handle stream parsing and UI updates.
- **Example**: In `useChat`, the `messages` array updates incrementally as chunks arrive.

#### b) **Multi-Modal Support**
The hooks support multi-modal interactions, where messages can include text, images, or tool calls. For example:
- **Images**: Messages can contain image URLs or base64-encoded data (supported by models like GPT-4o).
- **Tool Calls**: LLMs can trigger client-side functions (e.g., fetching data) via the `onToolCall` callback.

**Example**:
```jsx
const { messages } = useChat({
  onToolCall: async ({ toolCall }) => {
    if (toolCall.name === 'getWeather') {
      const weather = await fetchWeather(toolCall.args.location);
      return weather;
    }
  },
});
```

#### c) **Framework-Agnostic Design**
While `@ai-sdk/react` is React-specific, the underlying Vercel AI SDK is framework-agnostic. The hooks work seamlessly with Next.js (App Router or Pages Router), Remix, or plain React apps, leveraging React’s component model for rendering.

#### d) **Error Handling and Status**
The hooks provide robust error handling and status tracking:
- **Status**: Indicates the chat state (`ready`, `loading`, `error`, etc.).
- **onError**: A callback to handle API or streaming errors.
- **Retry Logic**: The hooks don’t retry automatically but allow custom retry logic via `onError`.

#### e) **Type Safety**
Built with TypeScript, `@ai-sdk/react` offers strong typing for messages, tool calls, and API responses, reducing runtime errors and improving developer experience.

---

### 4. **Installation and Setup**

To use `@ai-sdk/react`, you need to install the package along with the core `ai` package and a provider (e.g., `@ai-sdk/openai`).

**Installation**:
```bash
npm install ai @ai-sdk/react @ai-sdk/openai
```

**Environment Variables**:
Set up API keys for your chosen provider (e.g., OpenAI):
```env
OPENAI_API_KEY=your-api-key
```

**Dependencies**:
- Node.js 18+.
- React 18+ (for hooks and streaming support).
- A backend to handle LLM requests (e.g., Next.js API routes).

---

### 5. **Best Practices**

- **Use Client Components**: In Next.js, mark components using `@ai-sdk/react` hooks with `'use client'` since they rely on client-side interactivity.
- **Optimize API Routes**: Ensure backend routes return streamed responses (`toDataStreamResponse`) for low latency.
- **Handle Errors Gracefully**: Use `onError` to display user-friendly error messages.
- **Throttle Updates**: For high-frequency streaming, consider throttling UI updates (experimental `throttle` option in `useChat`).
- **Secure API Keys**: Store API keys in environment variables, not client-side code.
- **Leverage Initial Messages**: Preload `initialMessages` to provide context or seed the conversation.
- **Test Multi-Modal Inputs**: If using images or tools, test compatibility with your chosen model.

---

### 6. **Advanced Usage**

#### a) **Customizing Requests**
You can customize API requests using `headers`, `body`, or a custom `fetch` function:
```jsx
const { messages } = useChat({
  api: '/api/chat',
  headers: { 'X-Custom-Header': 'value' },
  body: { customField: 'data' },
});
```

#### b) **Shared Chat State**
Use the `id` parameter to share chat state across components:
```jsx
const { messages } = useChat({ id: 'shared-chat' });
```

#### c) **Dynamic Model Switching**
Switch models dynamically by updating the backend route or passing a model parameter:
```ts
// Backend
const result = await streamText({
  model: req.body.model || openai('gpt-4o'),
  messages: req.body.messages,
});
```

#### d) **Integrating with RAG**
For retrieval-augmented generation (RAG), combine `@ai-sdk/react` with a backend that fetches relevant documents before generating responses.

---

### 7. **Limitations and Considerations**

- **React Dependency**: The hooks require React, so they’re not usable in non-React frameworks without adaptation.
- **Streaming Dependency**: Streaming requires backend support (e.g., Next.js or Node.js with streaming APIs).
- **Provider Compatibility**: Not all models support streaming, tools, or multi-modal inputs; check provider docs.
- **Experimental Features**: Features like `onToolCall` or `throttle` are experimental and may change.
- **Performance**: Streaming large responses can strain client-side rendering; optimize with throttling or pagination.

---

### 8. **Ecosystem Integration**

`@ai-sdk/react` is part of the broader Vercel AI SDK, which includes:
- **AI SDK Core**: Low-level APIs for interacting with LLMs (`generateText`, `streamText`, etc.).
- **AI SDK Providers**: Model-specific integrations (e.g., `@ai-sdk/openai`, `@ai-sdk/anthropic`).
- **AI SDK RSC**: Experimental support for streaming React Server Components (not covered by `@ai-sdk/react`).

It integrates seamlessly with Next.js, Vercel’s deployment platform, and other modern frameworks, making it ideal for full-stack AI applications.

---

### 9. **Community and Resources**

- **Documentation**: The Vercel AI SDK docs (sdk.vercel.ai) provide detailed guides and API references.
- **GitHub**: The `vercel/ai` repository welcomes contributions and issues.
- **Templates**: Vercel offers starter templates for Next.js, React, and multi-provider setups.
- **Community**: Engage via GitHub Discussions for questions and ideas.

---

### 10. **Conclusion**

`@ai-sdk/react` is a powerful tool for React developers looking to build AI-powered conversational UIs. Its hooks (`useChat`, `useCompletion`, `useAssistant`) abstract away the complexity of streaming, state management, and multi-modal interactions, enabling rapid development of chatbots, assistants, and generative interfaces. By leveraging TypeScript, streaming, and provider-agnostic design, it offers flexibility and scalability for modern web applications.

