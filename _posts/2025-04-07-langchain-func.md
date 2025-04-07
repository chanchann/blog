---
layout: post
title: "LangChain Basic functions"
author: "chanchan"
categories: journal
tags: [AI]
image: mountains.jpg
toc: true
---

`langchainjs` is the official JS implementation of LangChain, with features highly consistent with the Python version, suitable for Node.js environments.

---

### 1. **Language Models**
- **Function Description**: Directly call large language models to generate text, supporting various LLMs (such as OpenAI, Hugging Face, etc.).
- **Use Cases**: Basic text generation, Q&A, translation, etc.
- **TypeScript Example**:
```typescript
import { OpenAI } from "@langchain/openai";

async function runLLM() {
  const model = new OpenAI({ apiKey: "your-api-key", modelName: "gpt-3.5-turbo" });
  const response = await model.invoke("Hello, how's the weather today?");
  console.log(response);
}

runLLM();
```

---

### 2. **Prompt Templates**
- **Function Description**: Dynamically generate structured prompts for easy reuse and parameterization.
- **Use Cases**: Standardize inputs, reduce the hassle of manually writing prompts.
- **TypeScript Example**:
```typescript
import { PromptTemplate } from "@langchain/core/prompts";

async function runPrompt() {
  const template = new PromptTemplate({
    inputVariables: ["text"],
    template: "Please translate the following content into French: {text}",
  });
  const prompt = await template.format({ text: "Hello" });
  console.log(prompt); // Output: Please translate the following content into French: Hello
}

runPrompt();
```

---

### 3. **Memory**
- **Function Description**: Save conversation context, giving models "memory" capabilities.
- **Use Cases**: Build stateful conversational bots.
- **Types**:
  - `BufferMemory`: Saves complete history.
  - `SummaryMemory`: Generates conversation summaries.
- **TypeScript Example**:
```typescript
import { BufferMemory } from "langchain/memory";
import { OpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";

async function runMemory() {
  const model = new OpenAI({ apiKey: "your-api-key" });
  const memory = new BufferMemory();
  const chain = new ConversationChain({ llm: model, memory });

  const res1 = await chain.call({ input: "Hello, my name is John" });
  console.log(res1.response); // Output similar to: Hello John, nice to meet you!

  const res2 = await chain.call({ input: "What did I just say?" });
  console.log(res2.response); // Output similar to: You said your name is John.
}

runMemory();
```

---

### 4. **Tools**
- **Function Description**: Allow models to call external tools (such as search, calculator, APIs).
- **Use Cases**: Extend LLM capabilities, solve knowledge and computation limitations.
- **TypeScript Example**:
```typescript
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { OpenAI } from "@langchain/openai";
import { AgentExecutor, createReactAgent } from "langchain/agents";

async function runTool() {
  const model = new OpenAI({ apiKey: "your-api-key" });
  const tools = [new SerpAPI("your-serpapi-key")];
  const agent = createReactAgent({ llm: model, tools });
  const executor = AgentExecutor.fromAgentAndTools({ agent, tools });

  const result = await executor.invoke({ input: "What's the weather today?" });
  console.log(result.output);
}

runTool();
```

---

### 5. **Indexes & Retrieval**
- **Function Description**: Load external data (such as documents) and implement semantic retrieval through vector storage.
- **Use Cases**: Build knowledge base Q&A systems.
- **Process**: Load documents → Split → Embed → Store → Retrieve.
- **TypeScript Example**:
```typescript
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

async function runRetrieval() {
  // Load documents
  const loader = new TextLoader("example.txt");
  const docs = await loader.load();

  // Split documents
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
  const splitDocs = await splitter.splitDocuments(docs);

  // Create vector store
  const embeddings = new OpenAIEmbeddings({ apiKey: "your-api-key" });
  const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);

  // Retrieve
  const results = await vectorStore.similaritySearch("What does the document say?", 2);
  console.log(results);
}

runRetrieval();
```

---

### 6. **Chains**
- **Function Description**: Combine multiple steps into a workflow, such as prompt + LLM call + output processing.
- **Use Cases**: Structured task processing.
- **Types**:
  - `LLMChain`: Basic chain.
  - `RetrievalQAChain`: Retrieval + Q&A.
- **TypeScript Example**:
```typescript
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";

async function runChain() {
  const model = new OpenAI({ apiKey: "your-api-key" });
  const template = new PromptTemplate({
    inputVariables: ["question"],
    template: "Answer this question: {question}",
  });
  const chain = new LLMChain({ llm: model, prompt: template });

  const response = await chain.call({ question: "Why is the sky blue?" });
  console.log(response.text);
}

runChain();
```

---

### 7. **Agents**
- **Function Description**: Allow models to dynamically select tools and execute multi-step tasks.
- **Use Cases**: Handle complex, open-ended problems.
- **TypeScript Example** (see Tools section, agent example already included):
```typescript
// Reuse the agent code from the Tools example
```

---

### 8. **Document Loaders**
- **Function Description**: Support loading external data in various formats (such as TXT, PDF, webpages).
- **Use Cases**: Provide data sources for indexing and retrieval.
- **TypeScript Example**:
```typescript
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

async function runLoader() {
  const loader = new PDFLoader("example.pdf");
  const docs = await loader.load();
  console.log(docs[0].pageContent); // Output: first page content of the PDF
}

runLoader();
```

---

### 9. **Embeddings**
- **Function Description**: Convert text to vectors for semantic comparison and retrieval.
- **Use Cases**: Support vector storage and similarity search.
- **TypeScript Example**:
```typescript
import { OpenAIEmbeddings } from "@langchain/openai";

async function runEmbeddings() {
  const embeddings = new OpenAIEmbeddings({ apiKey: "your-api-key" });
  const vector = await embeddings.embedQuery("Hello");
  console.log(vector); // Output: vector array
}

runEmbeddings();
```

---

### 10. **Output Parsers**
- **Function Description**: Parse LLM outputs into structured data (such as JSON).
- **Use Cases**: Standardize model outputs.
- **TypeScript Example**:
```typescript
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";
import { z } from "zod";

async function runParser() {
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({ answer: z.string() })
  );
  const template = new PromptTemplate({
    inputVariables: ["question"],
    template: "Answer this question and return in JSON format: {question}\n\n{format_instructions}",
    partialVariables: { format_instructions: parser.getFormatInstructions() },
  });
  const model = new OpenAI({ apiKey: "your-api-key" });
  const chain = new LLMChain({ llm: model, prompt: template });

  const response = await chain.call({ question: "What is 1+1?" });
  const parsed = await parser.parse(response.text);
  console.log(parsed); // Output: { answer: "2" }
}

runParser();
```

---

### Feature Summary
| Feature         | Description                      | Typical Use Cases         |
|-----------------|----------------------------------|---------------------------|
| Language Models | Call LLMs to generate text       | Text generation, Q&A      |
| Prompt Templates| Dynamically generate prompts     | Input standardization     |
| Memory          | Save conversation context        | Conversational bots       |
| Tools           | Call external functions          | Search, calculations      |
| Indexes & Retrieval | Load and query external data | Knowledge base Q&A        |
| Chains          | Combine multi-step workflows     | Structured task processing|
| Agents          | Dynamically select tools and steps | Complex problem solving |
| Document Loaders| Load various data formats        | Data preprocessing        |
| Embeddings      | Convert text to vectors          | Semantic search           |
| Output Parsers  | Standardize LLM outputs          | Structured data extraction|

---

### Overall Concept
The core idea of LangChain is modularity and composability. You can think of these features as building blocks, assembling different applications according to your needs:
- Simple tasks: Use `LLMChain` directly.
- Conversational systems: Add a `Memory`.
- Knowledge base Q&A: Use `RetrievalQAChain` + `VectorStore`.
- Complex tasks: Use `Agent` + `Tools`.

