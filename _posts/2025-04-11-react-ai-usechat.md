---
layout: post
title: "React AI : UseChat"
author: "chanchan"
categories: journal
tags: [react]
image: mountains.jpg
toc: true
---

The `useChat` hook from `@ai-sdk/react` is a powerful utility in the Vercel AI SDK designed to simplify building conversational user interfaces in React applications. It abstracts away much of the complexity of managing chat state, streaming messages, and interacting with AI providers, allowing developers to focus on creating seamless chat experiences. Below, I’ll break down the key concepts, features, and usage of `useChat` in detail.

---

### 1. **Purpose of `useChat`**
`useChat` is a React hook that enables developers to create real-time, streaming chat interfaces. It handles:
- **Streaming messages** from an AI provider (e.g., OpenAI, Anthropic, Google).
- **Managing chat state** (input, messages, status, errors, etc.).
- **Automatic UI updates** as new messages or message parts are received.
- **Integration with APIs** to send and receive chat data.
- **Support for advanced features** like tool calls, reasoning tokens, and multi-modal messages (e.g., text, images).

It’s framework-agnostic in the sense that it integrates with React-based frameworks like Next.js, and it’s designed to work with various AI providers through the Vercel AI SDK’s unified API.

---

### 2. **Installation**
To use `useChat`, you need to install the necessary packages:

```bash
npm install ai @ai-sdk/react
```

Additionally, you’ll need to install a provider-specific package if you’re using a particular AI model, e.g., `@ai-sdk/openai` for OpenAI models:

```bash
npm install @ai-sdk/openai
```

---

### 3. **Basic Usage**
Here’s a minimal example of using `useChat` in a React component:

```jsx
'use client'; // Required for Next.js client components

import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/chat', // Backend endpoint for AI provider
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
          placeholder="Type a message..."
          onChange={handleInputChange}
          disabled={status !== 'ready'}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
```

**Explanation**:
- **Initialization**: The `useChat` hook is called with an optional configuration object (e.g., `{ api: '/api/chat' }`) to specify the backend endpoint.
- **Returned Values**:
  - `messages`: An array of chat messages (e.g., `{ id, role, content, createdAt }`).
  - `input`: The current value of the input field.
  - `handleInputChange`: A callback to update the input state.
  - `handleSubmit`: A callback to handle form submission and send the message.
  - `status`: The current state of the chat (e.g., `'ready'`, `'loading'`, `'streaming'`).
- **Rendering**: Messages are mapped to the UI, and a form handles user input and submission.

---

### 4. **Key Features and Concepts**

#### 4.1. **Message Streaming**
- `useChat` supports real-time streaming of messages from the AI provider.
- As the AI generates responses, `useChat` updates the `messages` array incrementally, allowing the UI to render partial responses as they arrive.
- This creates a smooth, typewriter-like effect for users.

Example of streaming in action:
- When a user submits a message, `useChat` sends it to the specified `api` endpoint.
- The backend streams the response (e.g., using `streamText` from the AI SDK), and `useChat` updates the UI in real-time.

#### 4.2. **Managed State**
`useChat` manages several pieces of state for you:
- **Messages**: Stores the conversation history.
- **Input**: Tracks the user’s current input.
- **Status**: Indicates the chat’s state (`'ready'`, `'loading'`, `'streaming'`, `'error'`).
- **Error**: Captures any errors during API calls.

This eliminates the need for manual state management with `useState` or `useReducer`.

#### 4.3. **Configuration Options**
The `useChat` hook accepts an optional configuration object with the following properties:

- **`api`**: The backend endpoint (e.g., `'/api/chat'`) to handle AI requests. Can be relative or absolute.
- **`id`**: A unique identifier for the chat session. If provided, multiple `useChat` instances with the same `id` share state (useful for multi-component chat UIs).
- **`initialInput`**: A default string for the input field.
- **`initialMessages`**: An array of initial messages to prepopulate the chat.
- **`headers`**: Custom headers for the API request.
- **`body`**: Additional data to include in the API request body.
- **`credentials`**: Specifies the credentials mode for the request (e.g., `'same-origin'`, `'include'`). Defaults to `'same-origin'`.
- **`sendExtraMessageFields`**: If `true`, sends additional message fields like `name`, `data`, and `annotations` to the API (default: `false`).
- **`maxSteps`**: Maximum number of backend calls to prevent infinite loops (default: 1). Useful for tool-based workflows.
- **`experimental_throttle`**: Custom throttle wait time (in milliseconds) for UI updates to reduce re-renders during streaming (React-only).
- **`experimental_prepareRequestBody`**: A function to customize the request body sent to the server (experimental, React/Solid/Vue only).
- **`onFinish`**: Callback triggered when the assistant message is fully received.
- **`onError`**: Callback triggered when an error occurs.
- **`onResponse`**: Callback triggered when the API response is received.
- **`onToolCall`**: Callback for handling tool calls from the AI (e.g., for client-side tool execution).

Example with configuration:

```jsx
const { messages, input, handleSubmit } = useChat({
  api: '/api/chat',
  id: 'chat-123',
  initialMessages: [{ id: '1', role: 'assistant', content: 'Hello!' }],
  onFinish: () => console.log('Message stream completed'),
  onError: (error) => console.error('Chat error:', error),
});
```

#### 4.4. **Message Structure**
Messages returned by `useChat` have the following properties:
- **`id`**: Unique identifier for the message.
- **`role`**: The sender’s role (`'user'`, `'assistant'`, `'system'`, or `'data'`).
- **`content`**: The message content (string).
- **`createdAt`**: Timestamp of when the message was created.
- **`parts`** (AI SDK 4.2+): An array of message parts (e.g., `{ type: 'text', text: 'Hello' }`) for multi-modal or complex messages like tool calls or images.
- **`annotations`**: Optional metadata for the message.
- **`data`**: Optional custom data associated with the message.

Example message:
```json
{
  "id": "msg-123",
  "role": "assistant",
  "content": "Hi there!",
  "createdAt": "2025-04-10T19:43:00Z",
  "parts": [{ "type": "text", "text": "Hi there!" }]
}
```

#### 4.5. **Advanced Controls**
`useChat` provides helper functions for fine-grained control:
- **`append`**: Programmatically add a message to the conversation and trigger an API call.
- **`setInput`**: Update the input field programmatically.
- **`setMessages`**: Replace the entire messages array.
- **`stop`**: Abort an ongoing streaming response.
- **`reload`**: Regenerate the last message (React-only).
- **`isLoading`**: Boolean indicating if a request is in progress.
- **`error`**: The latest error object, if any.

Example using `append`:
```jsx
const { append } = useChat();

const addMessage = async () => {
  await append({ role: 'user', content: 'Tell me a joke' });
};
```

#### 4.6. **Multi-Modal Support (AI SDK 4.2+)**
With AI SDK 4.2, `useChat` supports message parts, enabling multi-modal conversations (e.g., text, images, tool calls). The `parts` property of a message can include:
- **Text**: `{ type: 'text', text: 'Hello' }`.
- **Images**: `{ type: 'file', file: { uri: 'data:image/png;base64,...' } }`.
- **Tool Calls**: `{ type: 'tool-call', toolCallId: 'tc-123', args: {} }`.
- **Tool Results**: `{ type: 'tool-result', toolCallId: 'tc-123', result: {} }`.

Rendering multi-modal messages:
```jsx
messages.map((message) => (
  <div key={message.id}>
    {message.parts.map((part, index) => {
      switch (part.type) {
        case 'text':
          return <span key={index}>{part.text}</span>;
        case 'file':
          return <img key={index} src={part.file.uri} alt="Generated" />;
        default:
          return null;
      }
    })}
  </div>
));
```

#### 4.7. **Tool Calls**
`useChat` supports tool calls, where the AI can request the execution of predefined functions (e.g., fetching data, performing calculations). Use the `onToolCall` callback to handle these:

```jsx
const { messages, handleSubmit } = useChat({
  onToolCall: async ({ toolCall }) => {
    if (toolCall.name === 'getWeather') {
      const result = await fetchWeather(toolCall.args.city);
      return result; // Return result to the AI
    }
  },
});
```

The backend must also support tool execution (e.g., using `streamText` with tools).

#### 4.8. **Reasoning Tokens**
Some models (e.g., DeepSeek, Anthropic) support reasoning tokens, which are intermediate thoughts sent before the final response. `useChat` can forward these using the `sendReasoning` option:

```jsx
const { messages } = useChat({
  api: '/api/chat',
  sendReasoning: true,
});
```

Access reasoning in the message’s `parts`:
```jsx
message.parts.find((part) => part.type === 'reasoning')?.details;
```

#### 4.9. **Error Handling**
- The `error` property captures API or network errors.
- The `onError` callback allows custom error handling:

```jsx
const { error } = useChat({
  onError: (err) => alert(`Error: ${err.message}`),
});
```

#### 4.10. **Throttling Updates**
To optimize performance during streaming, use `experimental_throttle` to limit UI re-renders:

```jsx
const { messages } = useChat({
  experimental_throttle: 200, // Update every 200ms
});
```

---

### 5. **Backend Integration**
`useChat` requires a backend endpoint to handle AI requests. A typical setup in Next.js might look like this:

```ts
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = await streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant.',
    messages,
  });
  return result.toDataStreamResponse();
}
```

- **Input**: The endpoint receives the `messages` array from `useChat`.
- **Processing**: It uses the AI SDK’s `streamText` to generate a response.
- **Output**: Returns a streaming response compatible with `useChat`.

---

### 6. **Best Practices**
- **Use Message Parts**: Prefer rendering `message.parts` over `message.content` for multi-modal support.
- **Handle Status**: Disable input or show loading indicators when `status !== 'ready'`.
- **Optimize Re-renders**: Use `experimental_throttle` or memoize components to reduce unnecessary updates.
- **Error Feedback**: Display `error` to users or log it for debugging.
- **Unique IDs**: Use the `id` option for shared state across components.
- **Secure API Keys**: Store API keys in environment variables, not client-side code.

---

### 7. **Limitations**
- **React-Only Features**: Some features (e.g., `reload`, `experimental_throttle`) are exclusive to React.
- **Experimental APIs**: Options like `experimental_prepareRequestBody` may change in future releases.
- **Provider Dependency**: Requires a compatible backend and AI provider.
- **Learning Curve**: Advanced features like tool calls or multi-modal messages require understanding the AI SDK’s broader ecosystem.

---

### 8. **Example with Advanced Features**
Here’s a more complex example incorporating multi-modal messages, tool calls, and error handling:

```jsx
'use client';

import { useChat } from '@ai-sdk/react';

export default function AdvancedChat() {
  const { messages, input, handleInputChange, handleSubmit, status, error, stop } = useChat({
    api: '/api/chat',
    sendReasoning: true,
    onToolCall: async ({ toolCall }) => {
      if (toolCall.name === 'getWeather') {
        return { temperature: 72, condition: 'Sunny' };
      }
    },
    onError: (err) => console.error('Chat error:', err),
    experimental_throttle: 200,
  });

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.role}: </strong>
          {message.parts.map((part, index) => {
            switch (part.type) {
              case 'text':
                return <span key={index}>{part.text}</span>;
              case 'file':
                return <img key={index} src={part.file.uri} alt="Generated" />;
              case 'reasoning':
                return <i key={index}>{part.details}</i>;
              default:
                return null;
            }
          })}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          placeholder="Type a message..."
          onChange={handleInputChange}
          disabled={status !== 'ready'}
        />
        <button type="submit" disabled={status !== 'ready'}>
          Send
        </button>
        {status === 'streaming' && <button type="button" onClick={stop}>Stop</button>}
      </form>
    </div>
  );
}
```

---

### 9. **Conclusion**
The `useChat` hook is a versatile tool for building conversational UIs in React. Its ability to handle streaming, state management, and advanced features like tool calls and multi-modal messages makes it ideal for modern AI-driven applications. By combining it with a robust backend and following best practices, developers can create engaging, real-time chat experiences with minimal effort.
