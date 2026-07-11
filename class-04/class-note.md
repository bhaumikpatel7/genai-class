# Introduction to RAG

## Day 4 — Retrieval-Augmented Generation

This README explains the fundamentals of **Retrieval-Augmented Generation**, commonly known as **RAG**.

It covers:

- What RAG is
- Why RAG is needed
- Knowledge cutoff
- Embeddings
- Vector databases
- Indexing pipeline
- Retrieval and generation pipeline
- Qdrant
- LangChain implementation in JavaScript

---

## Table of Contents

1. [What is RAG?](#what-is-rag)
2. [Knowledge Cutoff](#knowledge-cutoff)
3. [Why Not Put All Documents in the Prompt?](#why-not-put-all-documents-in-the-prompt)
4. [Simple RAG Analogy](#simple-rag-analogy)
5. [How RAG Works](#how-rag-works)
6. [Indexing Pipeline](#indexing-pipeline)
7. [What is an Embedding?](#what-is-an-embedding)
8. [What is a Vector Database?](#what-is-a-vector-database)
9. [Retrieval and Generation Pipeline](#retrieval-and-generation-pipeline)
10. [Complete RAG Workflow](#complete-rag-workflow)
11. [Advantages of RAG](#advantages-of-rag)
12. [What is Qdrant?](#what-is-qdrant)
13. [Project Structure](#project-structure)
14. [Installing Dependencies](#installing-dependencies)
15. [Environment Variables](#environment-variables)
16. [Indexing a PDF](#indexing-a-pdf)
17. [Retrieving Relevant Documents](#retrieving-relevant-documents)
18. [Generating an Answer](#generating-an-answer)
19. [Important Terms](#important-terms)
20. [Final Summary](#final-summary)

---

## What is RAG?

**RAG** stands for **Retrieval-Augmented Generation**.

RAG is a technique that allows a Large Language Model to answer questions using external, private, or custom data in addition to the information it learned during training.

Custom data may include:

- Company documents
- Legal contracts
- Product manuals
- PDFs
- Internal policies
- Customer records
- Technical documentation
- Database information
- Recently updated information

### Example

Suppose we want an AI assistant to answer questions about a company's legal contracts.

The LLM may not know the contents of those contracts because they were not included in its original training data.

With RAG, the system:

1. Searches the contract documents.
2. Finds the sections related to the user's question.
3. Adds those sections to the prompt.
4. Asks the LLM to generate an answer using that context.

```text
User Question
      ↓
Search Custom Documents
      ↓
Retrieve Relevant Information
      ↓
Add Information to Prompt
      ↓
LLM Generates Answer
```

---

## Knowledge Cutoff

A model's **knowledge cutoff** is the latest date up to which its training data contains information.

An LLM may not know:

- Events that happened after its training
- Recently updated policies
- Private company data
- Personal documents
- Internal databases
- New product information

RAG helps solve this problem by providing the model with relevant information at runtime.

Instead of retraining the entire model, we can update the external documents or database.

---

## Why Not Put All Documents in the Prompt?

One possible solution is to place all custom documents directly into the system prompt.

However, this is usually not an optimal approach.

### Problems with very large prompts

- The context window may overflow.
- Token usage increases.
- API cost increases.
- Response time may increase.
- The model may struggle to find relevant details.
- Important instructions may be ignored.
- Irrelevant information may reduce answer quality.
- Long prompts may increase hallucinations.

RAG solves this problem by retrieving only the most relevant sections of the documents.

```text
Without RAG:

All Documents
      ↓
Very Large Prompt
      ↓
High Token Usage
      ↓
Higher Cost and Lower Precision
```

```text
With RAG:

User Question
      ↓
Retrieve Relevant Chunks
      ↓
Smaller Prompt
      ↓
Lower Cost and Better Precision
```

---

## Simple RAG Analogy

Suppose you want to learn a new topic and you have ten books in your house.

You would probably not read all ten books from beginning to end.

Instead, you may follow this process.

### Step 1: Filter the books

Remove books that are unrelated to the topic.

Keep only the most relevant books.

### Step 2: Check the indexes

Look through the index or table of contents of the selected books.

### Step 3: Read the relevant sections

Open only the chapters or paragraphs related to your question.

RAG follows a similar process:

1. Find relevant documents.
2. Search their indexed content.
3. Retrieve relevant chunks.
4. Add those chunks to the prompt.
5. Generate an answer using the retrieved information.

> When building an AI system, step back and think about how a human would solve the same information-retrieval problem.

---

## How RAG Works

A basic RAG system usually contains two major pipelines:

1. **Indexing Pipeline**
2. **Retrieval and Generation Pipeline**

```text
RAG System
│
├── Indexing Pipeline
│   ├── Load documents
│   ├── Extract text
│   ├── Split text into chunks
│   ├── Generate embeddings
│   └── Store data in a vector database
│
└── Retrieval and Generation Pipeline
    ├── Receive user question
    ├── Generate query embedding
    ├── Search vector database
    ├── Retrieve relevant chunks
    ├── Build augmented prompt
    └── Generate final answer
```

---

# Indexing Pipeline

The indexing pipeline prepares documents so they can be searched later.

## Indexing Process

```text
Load Documents
      ↓
Extract Text
      ↓
Split Text into Chunks
      ↓
Generate Embeddings
      ↓
Store Chunks and Embeddings
in a Vector Database
```

---

## Step 1: Load the Data

The system loads documents from one or more sources.

Examples:

- PDF files
- Text files
- Word documents
- Web pages
- CSV files
- Database records
- Google Drive documents
- Internal APIs

Example:

```text
documents/
├── employee-policy.pdf
├── product-manual.pdf
├── legal-contract.pdf
└── troubleshooting-guide.pdf
```

---

## Step 2: Split the Data into Chunks

Large documents are divided into smaller sections called **chunks**.

For example, a 100-page PDF may be divided into hundreds of smaller text chunks.

### Why chunking is needed

- Large documents may exceed embedding limits.
- Smaller chunks produce more precise search results.
- Only relevant sections need to be given to the LLM.
- Smaller chunks reduce token usage.
- Chunking improves semantic search quality.

Example:

```text
Original Document
      ↓
Chunk 1: Introduction
Chunk 2: Installation Instructions
Chunk 3: Safety Guidelines
Chunk 4: Troubleshooting
Chunk 5: Warranty Information
```

### Chunk overlap

Chunks often include overlapping text.

Example:

```text
Chunk 1:
Lines 1 to 20

Chunk 2:
Lines 16 to 35
```

The repeated lines help preserve context when important information crosses a chunk boundary.

---

## Step 3: Generate Vector Embeddings

Each text chunk is converted into a numerical representation called a **vector embedding**.

Example:

```text
Text Chunk:

"Glue is commonly used to join two materials."

Embedding:

[0.12, -0.48, 0.31, 0.87, -0.15, ...]
```

The numbers do not represent individual words directly.

Together, they represent the semantic meaning of the text.

---

## Step 4: Store Data in a Vector Database

The system stores:

- The original text chunk
- The vector embedding
- Metadata about the chunk

Metadata may include:

- Document name
- File path
- Page number
- Section title
- Document type
- Creation date
- Source URL

Example:

```javascript
{
  pageContent: "Excess glue may be caused by incorrect pressure settings.",
  metadata: {
    source: "manufacturing-manual.pdf",
    pageNumber: 12,
    section: "Troubleshooting"
  }
}
```

Once this process is completed, the document is considered **indexed**.

---

## What is an Embedding?

An embedding is a numerical representation of data.

In RAG, embeddings are commonly used to represent the meaning of text.

Text with similar meaning usually produces vectors that are located close to each other in vector space.

### Example

These two sentences use different words but have similar meanings:

```text
How do I repair a car?
```

```text
How can I fix my vehicle?
```

Their embeddings should be close to each other because their semantic meanings are similar.

### Keyword search vs semantic search

Keyword search looks for exact words.

```text
Query:
repair a car
```

A keyword search may fail to match:

```text
fix my vehicle
```

A semantic search can understand that:

- repair is similar to fix
- car is similar to vehicle

This makes embeddings useful for RAG applications.

---

## What is a Vector Database?

A **vector database** is a database designed to store and search vector embeddings efficiently.

Traditional databases are commonly used for exact-value searches.

Example:

```sql
SELECT *
FROM products
WHERE product_id = 100;
```

A vector database performs similarity searches.

Instead of asking:

```text
Find the record with this exact value.
```

We ask:

```text
Find the records whose meanings are most similar to this query.
```

### Common vector databases

- Qdrant
- Pinecone
- Weaviate
- Milvus
- Chroma
- PostgreSQL with `pgvector`
- MongoDB Atlas Vector Search
- Elasticsearch
- FAISS

---

# Retrieval and Generation Pipeline

The retrieval and generation pipeline runs whenever the user asks a question.

## Query Process

```text
User Asks a Question
      ↓
Generate Query Embedding
      ↓
Search the Vector Database
      ↓
Retrieve Relevant Chunks
      ↓
Add Chunks to the Prompt
      ↓
LLM Generates the Answer
```

---

## Step 1: User Asks a Question

Example:

```text
Why is there too much glue in the design?
```

---

## Step 2: Generate a Query Embedding

The user's question is converted into an embedding.

```text
User Question
      ↓
Embedding Model
      ↓
Query Vector
```

The same or a compatible embedding model should be used for both:

- Document indexing
- User query embedding

Example query embedding:

```text
[0.17, -0.22, 0.91, 0.33, ...]
```

---

## Step 3: Search the Vector Database

The query vector is compared with the vectors stored in the database.

The vector database searches for chunks with the highest semantic similarity.

For example, the database may return chunks about:

- Glue quantity
- Adhesive application
- Excess glue
- Dispenser pressure
- Nozzle calibration
- Manufacturing defects

---

## Step 4: Retrieve Relevant Chunks

Only the most relevant sections are returned.

Example:

```text
Chunk 1:
Excess glue may be caused by incorrect dispenser calibration.

Chunk 2:
The recommended adhesive quantity is 3 to 5 millilitres.

Chunk 3:
Inspect the nozzle and pressure settings before production.
```

The number of retrieved chunks is often called `k`.

Example:

```javascript
const results = await vectorStore.similaritySearch(question, 4);
```

Here, `4` means that the system retrieves the four most relevant chunks.

---

## Step 5: Create an Augmented Prompt

The retrieved chunks are added to the prompt with the user's question.

Example:

```text
System Instruction:

Answer the question using only the provided context.
If the answer is not available in the context, say that you
do not have enough information.

Context:

1. Excess glue may be caused by incorrect dispenser calibration.
2. The recommended adhesive quantity is 3 to 5 millilitres.
3. Inspect the nozzle and pressure settings before production.

User Question:

Why is there too much glue in the design?
```

This is called an **augmented prompt** because the original prompt has been enhanced with retrieved information.

---

## Step 6: Generate the Answer

The LLM generates an answer using the retrieved context.

Example:

```text
The excess glue may be caused by incorrect dispenser
calibration, excessive pressure, or a problem with the nozzle.
The dispenser should be checked against the recommended
quantity of 3 to 5 millilitres.
```

---

# Complete RAG Workflow

## Indexing Phase

```text
PDF or Document
      ↓
Load Document
      ↓
Extract Text
      ↓
Split Text into Chunks
      ↓
Generate Embeddings
      ↓
Store Chunks and Vectors
in Qdrant
```

## Query Phase

```text
User Question
      ↓
Generate Query Embedding
      ↓
Search Qdrant
      ↓
Retrieve Similar Chunks
      ↓
Add Chunks to Prompt
      ↓
Send Prompt to LLM
      ↓
Generate Final Answer
```

## Combined Workflow

```text
                         INDEXING PIPELINE

Documents
    ↓
Document Loader
    ↓
Text Chunks
    ↓
Embedding Model
    ↓
Vector Embeddings
    ↓
Vector Database
    ↑
    │ Similarity Search
    │
Query Embedding
    ↑
Embedding Model
    ↑
User Question

                         GENERATION PIPELINE

Retrieved Chunks
    +
User Question
    +
System Instructions
    ↓
Augmented Prompt
    ↓
Large Language Model
    ↓
Final Answer
```

---

# Advantages of RAG

## 1. Uses Private and Custom Data

RAG allows a model to answer questions using information that was not included in its original training data.

Examples:

- Company policies
- Technical manuals
- Customer documents
- Internal procedures
- Private databases

---

## 2. Reduces Token Usage

Only relevant chunks are added to the prompt instead of entire documents.

```text
Entire Document:
50,000 tokens

Retrieved Chunks:
2,000 tokens
```

This can significantly reduce input size.

---

## 3. Reduces Cost

Smaller prompts usually require fewer input tokens.

This can reduce API costs when using paid LLM services.

---

## 4. Provides More Current Information

Documents can be updated without retraining the entire language model.

Example:

```text
Old Policy Document
      ↓
Replace with Updated Policy
      ↓
Re-index Document
      ↓
RAG System Uses New Information
```

---

## 5. Improves Answer Relevance

The model receives information directly related to the user's question.

This helps the LLM focus on the most useful context.

---

## 6. Can Provide Sources

The system can return source metadata such as:

- Document name
- Page number
- Section title
- Source URL
- File path

Example:

```text
Answer:
The warranty period is two years.

Source:
product-manual.pdf, page 18
```

---

## 7. Reduces Hallucinations

RAG can reduce unsupported answers by grounding the model in retrieved information.

However, RAG does not completely eliminate hallucinations.

The system can still produce incorrect answers when:

- Retrieval returns irrelevant chunks
- Documents contain incorrect information
- Chunking is poorly configured
- The prompt is unclear
- The model ignores the retrieved context

---

# What is Qdrant?

**Qdrant** is an open-source vector database designed to store and search vector embeddings.

In a RAG application, Qdrant can store:

- Document chunks
- Vector embeddings
- File metadata
- Page numbers
- Document names
- Source identifiers

When a query embedding is submitted, Qdrant returns vectors that are semantically similar to the query.

## Qdrant in the RAG workflow

```text
Document Chunks
      ↓
Embedding Model
      ↓
Vector Embeddings
      ↓
Qdrant Collection
```

During retrieval:

```text
User Question
      ↓
Query Embedding
      ↓
Qdrant Similarity Search
      ↓
Relevant Document Chunks
```

---

# Project Structure

```text
rag-project/
│
├── documents/
│   └── manual.pdf
│
├── src/
│   ├── indexing.js
│   ├── retrieve.js
│   └── generate.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# Installing Dependencies

Initialize the Node.js project:

```bash
npm init -y
```

Install the required packages:

```bash
npm install @langchain/community
npm install @langchain/openai
npm install @langchain/qdrant
npm install @langchain/textsplitters
npm install dotenv
npm install pdf-parse
```

Add the following property to `package.json` to enable ES modules:

```json
{
  "type": "module"
}
```

Example `package.json`:

```json
{
  "name": "rag-project",
  "version": "1.0.0",
  "description": "A basic RAG application using LangChain, OpenAI embeddings, and Qdrant",
  "type": "module",
  "scripts": {
    "index": "node src/indexing.js",
    "retrieve": "node src/retrieve.js",
    "start": "node src/generate.js"
  },
  "dependencies": {
    "@langchain/community": "^0.3.0",
    "@langchain/openai": "^0.5.0",
    "@langchain/qdrant": "^0.1.0",
    "@langchain/textsplitters": "^0.1.0",
    "dotenv": "^16.0.0",
    "pdf-parse": "^1.1.1"
  }
}
```

Package versions may differ depending on when the project is created.

---

# Environment Variables

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION_NAME=jarvis
```

Create a `.gitignore` file:

```gitignore
node_modules/
.env
.DS_Store
```

Never commit your API key to GitHub.

---

# Running Qdrant with Docker

You can run Qdrant locally using Docker.

```bash
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  -v qdrant_storage:/qdrant/storage \
  qdrant/qdrant
```

Qdrant will be available at:

```text
http://localhost:6333
```

---

# Indexing a PDF

Create a file named:

```text
src/indexing.js
```

Add the following code:

```javascript
import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function indexDocument() {
  try {
    const filePath = path.join(
      __dirname,
      "..",
      "documents",
      "manual.pdf"
    );

    console.log("Loading PDF...");

    const loader = new PDFLoader(filePath);
    const documents = await loader.load();

    console.log(`Loaded ${documents.length} document pages.`);

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    console.log("Splitting documents into chunks...");

    const chunks = await textSplitter.splitDocuments(documents);

    console.log(`Created ${chunks.length} chunks.`);

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log("Generating embeddings and storing data in Qdrant...");

    const vectorStore = await QdrantVectorStore.fromDocuments(
      chunks,
      embeddings,
      {
        url: process.env.QDRANT_URL,
        collectionName: process.env.QDRANT_COLLECTION_NAME,
      }
    );

    console.log("Document indexing completed successfully.");

    return vectorStore;
  } catch (error) {
    console.error("Document indexing failed:", error);
    process.exitCode = 1;
  }
}

indexDocument();
```

Run the indexing script:

```bash
npm run index
```

---

# Indexing Code Explanation

## Import environment variables

```javascript
import "dotenv/config";
```

This loads variables from the `.env` file into `process.env`.

---

## Locate the PDF

```javascript
const filePath = path.join(
  __dirname,
  "..",
  "documents",
  "manual.pdf"
);
```

This creates the full path to the PDF file.

---

## Load the PDF

```javascript
const loader = new PDFLoader(filePath);
const documents = await loader.load();
```

This reads the PDF and converts its pages into LangChain document objects.

A document object may look similar to:

```javascript
{
  pageContent: "Extracted text from the PDF...",
  metadata: {
    source: "documents/manual.pdf",
    loc: {
      pageNumber: 1
    }
  }
}
```

---

## Split the PDF into chunks

```javascript
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
```

- `chunkSize` controls the approximate size of each chunk.
- `chunkOverlap` repeats part of the previous chunk in the next chunk.

Then:

```javascript
const chunks = await textSplitter.splitDocuments(documents);
```

This divides the loaded documents into smaller sections.

---

## Initialize the embedding model

```javascript
const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
  apiKey: process.env.OPENAI_API_KEY,
});
```

The embedding model converts each text chunk into a vector.

---

## Store data in Qdrant

```javascript
const vectorStore = await QdrantVectorStore.fromDocuments(
  chunks,
  embeddings,
  {
    url: process.env.QDRANT_URL,
    collectionName: process.env.QDRANT_COLLECTION_NAME,
  }
);
```

This operation:

1. Generates an embedding for every chunk.
2. Creates or uses the Qdrant collection.
3. Stores each vector.
4. Stores the original text.
5. Stores the metadata.

---

# Retrieving Relevant Documents

Create a file named:

```text
src/retrieve.js
```

Add the following code:

```javascript
import "dotenv/config";

import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";

async function retrieveDocuments(question) {
  try {
    if (!question || question.trim().length === 0) {
      throw new Error("A valid question is required.");
    }

    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      apiKey: process.env.OPENAI_API_KEY,
    });

    const vectorStore =
      await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: process.env.QDRANT_COLLECTION_NAME,
      });

    const results = await vectorStore.similaritySearch(question, 4);

    return results;
  } catch (error) {
    console.error("Document retrieval failed:", error);
    throw error;
  }
}

async function main() {
  const question =
    process.argv.slice(2).join(" ") ||
    "What information is available in the document?";

  const results = await retrieveDocuments(question);

  console.log(`\nQuestion: ${question}\n`);

  results.forEach((document, index) => {
    console.log(`Result ${index + 1}`);
    console.log("-------------------------");
    console.log(document.pageContent);
    console.log("\nMetadata:");
    console.log(document.metadata);
    console.log("\n");
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

export { retrieveDocuments };
```

Run the retrieval script:

```bash
node src/retrieve.js "Why is there too much glue?"
```

---

# Retrieval Code Explanation

## Connect to the existing collection

```javascript
const vectorStore =
  await QdrantVectorStore.fromExistingCollection(embeddings, {
    url: process.env.QDRANT_URL,
    collectionName: process.env.QDRANT_COLLECTION_NAME,
  });
```

This connects to a collection that was already created during indexing.

---

## Perform similarity search

```javascript
const results = await vectorStore.similaritySearch(question, 4);
```

This performs the following steps:

1. Converts the question into an embedding.
2. Compares it with the stored vectors.
3. Finds the most similar vectors.
4. Returns the four most relevant chunks.

---

# Generating an Answer

Create a file named:

```text
src/generate.js
```

Add the following code:

```javascript
import "dotenv/config";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { ChatOpenAI } from "@langchain/openai";
import { retrieveDocuments } from "./retrieve.js";

function formatContext(documents) {
  return documents
    .map((document, index) => {
      const source =
        document.metadata?.source || "Unknown source";

      const pageNumber =
        document.metadata?.loc?.pageNumber ||
        document.metadata?.pageNumber ||
        "Unknown page";

      return `
Source ${index + 1}
Document: ${source}
Page: ${pageNumber}

${document.pageContent}
`;
    })
    .join("\n");
}

async function generateAnswer(question) {
  try {
    const documents = await retrieveDocuments(question);

    if (documents.length === 0) {
      return {
        answer: "No relevant information was found.",
        sources: [],
      };
    }

    const context = formatContext(documents);

    const model = new ChatOpenAI({
      model: "gpt-4.1-mini",
      temperature: 0,
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await model.invoke([
      {
        role: "system",
        content: `
You are a helpful question-answering assistant.

Use only the provided context to answer the user's question.

Rules:
1. Do not invent information.
2. If the answer is not available in the context, say:
   "I do not have enough information in the provided documents."
3. Keep the answer clear and accurate.
4. Mention the source when appropriate.
        `.trim(),
      },
      {
        role: "user",
        content: `
Context:

${context}

Question:

${question}
        `.trim(),
      },
    ]);

    return {
      answer: response.content,
      sources: documents.map((document) => document.metadata),
    };
  } catch (error) {
    console.error("Answer generation failed:", error);
    throw error;
  }
}

async function main() {
  const readlineInterface = readline.createInterface({
    input,
    output,
  });

  try {
    const question = await readlineInterface.question(
      "Ask a question about the document: "
    );

    const result = await generateAnswer(question);

    console.log("\nAnswer:\n");
    console.log(result.answer);

    console.log("\nSources:\n");
    console.log(result.sources);
  } finally {
    readlineInterface.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

export { generateAnswer };
```

Run the application:

```bash
npm start
```

Example:

```text
Ask a question about the document:
Why is there too much glue in the design?
```

---

# Full Application Flow

```text
1. Place a PDF inside the documents folder.

2. Run the indexing script.

   npm run index

3. The PDF is loaded and split into chunks.

4. OpenAI generates an embedding for each chunk.

5. The chunks and embeddings are stored in Qdrant.

6. Start the question-answering application.

   npm start

7. Enter a question.

8. The question is converted into an embedding.

9. Qdrant finds the most similar chunks.

10. The retrieved chunks are added to the prompt.

11. The LLM generates an answer using the retrieved context.
```

---

# Important Terms

| Term | Meaning |
|---|---|
| RAG | Retrieval-Augmented Generation |
| LLM | Large Language Model |
| Document | Original source such as a PDF or webpage |
| Chunk | A smaller section of a document |
| Embedding | Numerical representation of semantic meaning |
| Vector | Array of numbers created by an embedding model |
| Vector database | Database designed to store and search vectors |
| Indexing | Preparing and storing document data for retrieval |
| Retrieval | Finding information relevant to a query |
| Semantic search | Search based on meaning rather than exact words |
| Similarity search | Comparing vectors to find semantically related content |
| Query embedding | Vector representation of the user's question |
| Augmented prompt | Prompt containing retrieved context |
| Context window | Maximum amount of information an LLM can process |
| Hallucination | Unsupported or fabricated model response |
| Metadata | Additional information about a document chunk |
| Qdrant | Open-source vector database |
| LangChain | Framework for developing LLM applications |
| Chunk size | Approximate amount of text in each chunk |
| Chunk overlap | Repeated text shared between neighbouring chunks |

---

# Common RAG Problems

## Poor Chunking

Chunks that are too large may include irrelevant information.

Chunks that are too small may lose important context.

Possible solution:

```javascript
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
```

Experiment with different values based on the document type.

---

## Irrelevant Retrieval Results

The system may retrieve chunks that are not useful.

Possible improvements:

- Retrieve more chunks
- Retrieve fewer chunks
- Improve document quality
- Use metadata filters
- Use hybrid search
- Add a reranking model
- Rewrite the user's query

---

## Missing Source Information

Always preserve metadata during indexing.

Useful metadata includes:

```javascript
{
  source: "manual.pdf",
  pageNumber: 12,
  section: "Troubleshooting"
}
```

This allows the final answer to include citations or references.

---

## Hallucinated Answers

Use clear system instructions.

Example:

```text
Answer only from the provided context.

If the answer is not present, say that you do not have enough
information.
```

Set a low temperature for factual question-answering:

```javascript
const model = new ChatOpenAI({
  model: "gpt-4.1-mini",
  temperature: 0,
});
```

---

# Possible Future Improvements

This basic RAG application can be improved by adding:

- Multiple document support
- File upload functionality
- Chat history
- Source citations
- Metadata filtering
- Hybrid keyword and vector search
- Reranking
- Streaming responses
- React frontend
- Express backend
- User authentication
- Conversation memory
- Docker Compose
- MongoDB integration
- Document deletion
- Collection management
- Admin dashboard
- Evaluation and testing

---

# Final Summary

RAG allows an LLM to answer questions using external information.

It contains two major stages.

## Indexing Stage

```text
Documents
    ↓
Text Chunks
    ↓
Embeddings
    ↓
Vector Database
```

## Query Stage

```text
User Question
    ↓
Query Embedding
    ↓
Similarity Search
    ↓
Relevant Chunks
    ↓
Augmented Prompt
    ↓
LLM
    ↓
Final Answer
```

The main benefits of RAG are:

- Access to custom and private data
- More current information
- Lower token usage
- Lower cost
- Better answer relevance
- Source references
- Reduced hallucinations
- No need to retrain the entire model

RAG does not change the LLM's internal knowledge.

Instead, it gives the model relevant external information before the answer is generated.