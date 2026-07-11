# Day 3 — Building AI Agents

## 1. What Is an AI Agent?

An AI agent combines several components:

```text
AI Agent = LLM + Tools + Reasoning + Instructions + Memory
```

### Main components

- **LLM:** The “brain” that understands input and generates responses.
- **Tools:** External capabilities such as databases, APIs, web search, email, or file operations.
- **Reasoning:** The process used to decide what action to take.
- **Instructions:** Rules that define how the agent should behave.
- **Memory:** Information the agent retains and uses in future interactions.

---

## 2. LLM

**LLM** stands for **Large Language Model**.

The LLM:

- Understands natural-language input
- Generates text
- Extracts information
- Chooses tools
- Produces structured output
- Helps the agent decide what to do next

The LLM is only one part of an agent. An agent also needs instructions, tools, guardrails, memory, and application logic.

---

## 3. Never Trust User Input

A common security principle is:

> Never trust user input.

User input may be:

- Incorrect
- Malicious
- Misleading
- Designed to manipulate the model
- Intended to access sensitive information
- Intended to trigger unsafe tool calls

Therefore, input must be validated before it is processed or used by tools.

---

## 4. Guardrails

Guardrails are rules and checks placed around an LLM or AI agent to improve:

- Safety
- Reliability
- Security
- Output quality
- Policy compliance

### 4.1 Input Guardrails

Input guardrails inspect data before it reaches the model.

They may check for:

- Malicious prompts
- Prompt injection
- Invalid data
- Sensitive information
- Unsupported requests
- Harmful content

### 4.2 Output Guardrails

Output guardrails validate the model’s response before returning it to the user.

They may check for:

- False or misleading claims
- Sensitive information
- Unsafe instructions
- Incorrect output format
- Policy violations

### 4.3 Tool Guardrails

Tool guardrails control how an agent uses external tools.

They may:

- Restrict which tools are available
- Validate tool arguments
- Require approval before execution
- Prevent unauthorized database access
- Limit destructive actions
- Restrict API permissions

For sensitive actions, the agent should request user approval before executing the tool.

Examples include:

- Sending an email
- Deleting data
- Making a payment
- Publishing content
- Updating a production database

---

## 5. Agent Architecture

A basic agent flow can be represented as:

```text
User Input
    ↓
Input Guardrails
    ↓
Instructions
    ↓
LLM
    ↓
Reasoning and Tool Selection
    ↓
Tools
    ↓
Tool Results
    ↓
LLM
    ↓
Output Guardrails
    ↓
Final Response
```

Additional controls can include:

- Rate limiting
- Context-window management
- Authentication
- Authorization
- Logging
- Retry logic
- Human approval

---

## 6. Rate Limiting

Rate limiting controls how frequently users or applications can call a model or API.

It helps:

- Prevent abuse
- Control costs
- Protect system resources
- Avoid exceeding provider limits
- Improve system stability

Rate limits may be based on:

- Requests per minute
- Requests per day
- Input tokens per minute
- Output tokens per minute
- Concurrent requests

---

## 7. Context Window

The **context window** is the maximum amount of information an LLM can consider during one request.

The context may contain:

- System instructions
- Developer instructions
- User messages
- Previous conversation messages
- Tool results
- Retrieved documents
- Model output

### Example

Assume a model has a context capacity of 10 tokens:

```text
[1][2][3][4][5][6][7][8][9][10]
```

If four new tokens are added, the application may need to remove older content:

```text
Old context:
[1][2][3][4][5][6][7][8][9][10]

New content added:
[11][12][13][14]

Possible retained context:
[5][6][7][8][9][10][11][12][13][14]
```

The oldest information may no longer be available to the model.

### Important distinction

A context window is not the same as permanent memory.

- **Context window:** Temporary information included in the current model request.
- **Memory:** Information stored externally and retrieved when needed.

---

## 8. Memory

Memory allows an agent to retain useful information beyond the current request.

Examples include:

- User preferences
- Previous decisions
- Project details
- Long-term goals
- Conversation summaries

Memory should be stored intentionally. An application must decide:

1. What should be remembered
2. Where it should be stored
3. When it should be retrieved
4. When it should be updated or deleted

Possible storage systems include:

- Relational databases
- NoSQL databases
- Vector databases
- Key-value stores
- Conversation-summary tables

---

## 9. Hallucination

A hallucination occurs when an LLM generates information that sounds reasonable but is incorrect, unsupported, or fabricated.

Examples include:

- Inventing a source
- Providing an incorrect fact confidently
- Claiming a tool action was completed when it was not
- Creating fake API fields
- Making unsupported assumptions

### Ways to reduce hallucinations

- Use retrieval-augmented generation
- Ask the model to cite sources
- Validate answers with tools
- Use structured outputs
- Add output guardrails
- Provide precise instructions
- Require the model to admit uncertainty
- Use human review for high-risk decisions

Hallucinations can be reduced, but they cannot always be completely eliminated.

---

## 10. LLM Cost

LLM API cost is commonly based on token usage.

```text
Total cost =
Input-token cost
+ Output-token cost
+ Tool or service costs
```

Input tokens can include:

- Instructions
- User input
- Conversation history
- Retrieved documents
- Tool outputs

Output tokens are the tokens generated by the model.

Long conversations and large retrieved documents increase token usage.

---

# Ways to Work with an LLM

There are three common abstraction levels:

```text
REST API → SDK → Agent SDK
Low-level   Medium-level   High-level
```

---

## 11. REST API

A REST API provides direct access to the model through HTTP requests.

The developer manually handles:

- HTTP connection
- Request headers
- Authentication
- Request body
- Response status
- JSON parsing
- Error handling
- Retry logic

### Advantages

- Maximum control
- Works in almost any programming language
- Useful for learning how the API works
- Minimal dependency on a provider-specific library

### Disadvantages

- More boilerplate
- More manual error handling
- More manual response parsing
- Tool calling and retries require additional code

---

## 12. SDK

An SDK provides a programming-language-friendly interface around the REST API.

Instead of manually creating HTTP requests, the developer calls functions or methods.

Conceptually:

```javascript
const response = await client.responses.create({
  model: "MODEL_NAME",
  input: "Hello"
});
```

The SDK typically handles:

- Authentication headers
- HTTP requests
- Request serialization
- Response parsing
- Standard error objects

### Advantages

- Less boilerplate than REST
- Easier model integration
- Better developer experience
- Language-specific types and utilities

### Disadvantages

The application may still need to manage:

- Conversation history
- Prompt design
- Tool execution
- Retries
- Guardrails
- Agent loops
- Memory

---

## 13. Agent SDK

An Agent SDK usually sits on top of the standard SDK and provides agent-specific functionality.

It may support:

- Tool calling
- Agent loops
- Guardrails
- Retries
- Memory integration
- Handoffs between agents
- Tracing
- Structured outputs
- Human approval workflows

### Comparison

| Approach | Abstraction | Developer responsibility |
|---|---:|---|
| REST API | Low | Most functionality is handled manually |
| SDK | Medium | HTTP details are handled by the library |
| Agent SDK | High | Many agent capabilities are built in |

Higher abstraction generally means less application code, but it may also give the developer less low-level control.

---

# Basic SDK Workflow

## 14. Step 1: Install the SDK

For Node.js:

```bash
npm install openai
```

---

## 15. Step 2: Import the SDK

```javascript
import OpenAI from "openai";
```

---

## 16. Step 3: Configure the API Key

Store the API key in an environment variable:

```env
OPENAI_API_KEY=your_api_key
```

Do not hard-code secret keys directly into source code.

---

## 17. Step 4: Create a Client

```javascript
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
```

The client:

- Reads the API key
- Handles authentication
- Knows where requests should be sent
- Exposes methods for interacting with the API

---

## 18. Step 5: Create a Request

```javascript
const response = await client.responses.create({
  model: "MODEL_NAME",
  input: "Hey, I am Jaani."
});
```

The request normally includes:

- Model name
- User input
- Optional instructions
- Optional tools
- Optional output format

---

## 19. Step 6: The SDK Sends the Request

Internally, the SDK:

1. Converts the JavaScript object into JSON
2. Adds authentication headers
3. Sends an HTTPS request
4. Waits for the model provider’s response
5. Parses the returned JSON

---

## 20. Step 7: Read the Output

```javascript
console.log(response.output_text);
```

The SDK converts the API response into a JavaScript object so the application can access its fields.

---

# Complete Example

```javascript
import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function main() {
  try {
    const response = await client.responses.create({
      model: "MODEL_NAME",
      input: "Hey, I am Jaani."
    });

    console.log(response.output_text);
  } catch (error) {
    console.error("Request failed:", error);
  }
}

main();
```

---

# Authentication Flow

```text
Application
    ↓
Reads API key from environment variables
    ↓
Creates SDK client
    ↓
SDK adds authentication information
    ↓
HTTPS request is sent
    ↓
Provider validates the API key
    ↓
Model processes the input
    ↓
JSON response is returned
    ↓
SDK converts it into a JavaScript object
```

The API key should remain on the server and should not be exposed in frontend code.

---

# Inference

**Inference** is the process of using a trained model to generate a result from new input.

Examples:

```text
Text input  → Text output
Text input  → Image output
Image input → Text output
Image input → Image output
Text input  → Video output
Audio input → Text output
```

Training teaches the model patterns. Inference applies those learned patterns to a new request.

---

# Types of AI Models

## 1. Text-to-Text

Takes text as input and produces text.

Examples:

- Question answering
- Summarization
- Translation
- Code generation

## 2. Text-to-Image

Takes a natural-language description and generates an image.

## 3. Image-to-Image

Takes an existing image and transforms or edits it.

## 4. Image-to-Text

Takes an image and returns text.

Examples:

- Image descriptions
- Document extraction
- Visual question answering

## 5. Text-to-Video

Takes a written prompt and generates video content.

---

# Open-Source Models

Open-source or open-weight models can also be used when building AI applications.

Examples may be deployed through:

- Local computers
- Cloud virtual machines
- Containerized services
- Managed inference platforms
- GPU infrastructure

Possible benefits include:

- Greater deployment control
- Customization
- Private hosting
- Reduced provider dependency

Possible challenges include:

- GPU requirements
- Infrastructure maintenance
- Scaling
- Monitoring
- Security
- Model optimization

---

# Key Takeaways

```text
1. An LLM is the reasoning and language component of an agent.

2. An agent combines an LLM with tools, instructions, memory,
   guardrails, and application logic.

3. Never trust user input without validation.

4. Guardrails should protect inputs, outputs, and tool execution.

5. A context window is temporary and has a limited capacity.

6. Memory must be stored and retrieved intentionally.

7. Hallucinations are confident but unsupported or incorrect outputs.

8. REST APIs provide low-level control.

9. SDKs reduce HTTP and JSON-handling boilerplate.

10. Agent SDKs add higher-level capabilities such as tool calling,
    retries, guardrails, and agent loops.

11. API keys should be stored in environment variables and kept
    away from frontend code.

12. LLM usage costs are influenced by input and output token usage.
```