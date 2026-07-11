# Day 2 — Generative AI: Prompting, Agents, Tools, and Distillation

## 1. What Is Prompting?

A **prompt** is an instruction given to an AI model to make it behave in a specific way or produce a desired output.

Good prompting helps the model understand:

- What task it should perform
- What context it should use
- What output format is expected
- What constraints it must follow

> Prompting is the process of designing instructions that guide an AI model toward the required result.

---

## 2. Prompting Techniques

### 2.1 Zero-Shot Prompting

In **zero-shot prompting**, the model receives a direct instruction without any examples.

#### Example

```text
What is 2 + 2?
```

The model answers using its existing knowledge.

#### JavaScript Example

```js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const result = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: "Tell me what 2 + 2 is.",
      },
    ],
  });

  console.log(result.choices[0].message.content);
}

main();
```

#### When to Use It

Use zero-shot prompting when:

- The task is simple
- The instruction is clear
- The model does not need examples
- The expected format is straightforward

---

### 2.2 Few-Shot Prompting

In **few-shot prompting**, the model is given a small number of examples before being asked to solve a new task.

The examples teach the model the expected pattern, style, or format.

#### Example

```text
Question: What is 5 + 4?
Expected output: 9 (Nine)

Question: What is 10 + 10?
Expected output: 20 (Twenty)

Question: What is 2 + 2?
```

The model learns that the answer should include both the numeric and written form.

#### JavaScript Example

```js
const result = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    {
      role: "user",
      content: `
Answer using the same format as the examples.

Example 1:
Question: What is 5 + 4?
Expected output: 9 (Nine)

Example 2:
Question: What is 10 + 10?
Expected output: 20 (Twenty)

Question: What is 2 + 2?
      `,
    },
  ],
});
```

#### When to Use It

Use few-shot prompting when:

- The model must follow a specific output pattern
- The task is ambiguous
- Formatting is important
- The model needs examples to understand the expected behavior

---

### 2.3 Chain-of-Thought-Style Prompting

This technique encourages the model to solve a task through intermediate reasoning steps before producing a final answer.

A safer practical pattern is to ask the model to provide a **brief explanation** or a **structured solution**, rather than exposing hidden internal reasoning.

#### Example

```text
Solve the problem step by step and provide a concise explanation before the final answer.
```

#### Benefits

- Useful for multi-step problems
- Helps reduce careless mistakes
- Makes the final answer easier to verify
- Works well for logic, math, planning, and debugging

---

## 3. Structured Reasoning Pipeline

A structured prompt can guide the model through named stages.

Example stages:

1. `INITIAL`
2. `THINK`
3. `ANALYSE`
4. `OUTPUT`

### Stage Meaning

#### `INITIAL`

The model receives the user's request.

#### `THINK`

The model considers a possible solution approach.

#### `ANALYSE`

The model checks the approach, identifies mistakes, and improves it.

#### `OUTPUT`

The model returns the final answer.

### Example System Prompt

```text
You are an expert AI engineer.

Carefully analyse the user's request and break the problem into smaller parts.

Follow this response pipeline:

1. INITIAL — identify the task
2. THINK — choose an approach
3. ANALYSE — verify and improve the approach
4. OUTPUT — provide the final answer

Always return one stage at a time.
```

### Important Note

For production systems, it is usually better to request:

- A concise explanation
- Key assumptions
- Verification steps
- The final answer

Avoid depending on long hidden reasoning traces.

---

## 4. Building a Prompt Loop

A loop can repeatedly send messages to the model until a final state is reached.

### Message History

```js
const messages = [
  {
    role: "system",
    content: SYSTEM_PROMPT,
  },
];
```

### Example Loop

```js
async function main(prompt) {
  messages.push({
    role: "user",
    content: prompt,
  });

  while (true) {
    const result = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });

    const rawResult = result.choices[0].message.content;
    const parsedResult = JSON.parse(rawResult);

    messages.push({
      role: "assistant",
      content: rawResult,
    });

    console.log(`${parsedResult.step}: ${parsedResult.content}`);

    if (parsedResult.step === "OUTPUT") {
      break;
    }
  }
}

main("What is the meaning of life?");
```

### Expected JSON Format

```json
{
  "step": "THINK",
  "content": "I will first identify the main concept."
}
```

### Why Store Message History?

The message history allows the model to:

- Remember earlier steps
- Continue the same conversation
- Refine earlier outputs
- Avoid repeating completed work

---

## 5. Making the Loop More Robust

A basic loop may fail if the model returns invalid JSON or an unexpected stage.

A more reliable implementation should include:

- JSON validation
- Allowed step validation
- Maximum iteration limits
- Error handling
- Retry logic
- Timeout protection

### Example Validation Logic

```js
const allowedSteps = ["INITIAL", "THINK", "ANALYSE", "OUTPUT"];

if (!allowedSteps.includes(parsedResult.step)) {
  throw new Error(`Invalid step: ${parsedResult.step}`);
}
```

### Maximum Iteration Guard

```js
const maxIterations = 10;

for (let i = 0; i < maxIterations; i++) {
  // Call model and process response
}
```

This prevents an accidental infinite loop.

---

## 6. Tool Requests

An AI model cannot directly access live systems unless tools are connected to it.

For example, a model needs a tool to:

- Get current weather
- Search the web
- Read a database
- Send an email
- Fetch YouTube data
- Call an external API

### Tool Request Format

A custom tool-request structure might look like this:

```json
{
  "step": "TOOL_REQUEST",
  "functionName": "getWeatherData",
  "input": "Windsor, Ontario"
}
```

The application then:

1. Detects the `TOOL_REQUEST`
2. Calls the correct function
3. Stores the tool result
4. Sends the result back to the model
5. Allows the model to continue

---

## 7. Example Weather Tool

```js
import axios from "axios";

async function getWeatherData(cityName) {
  const url = `https://example-weather-api.com/weather?city=${encodeURIComponent(
    cityName
  )}`;

  const response = await axios.get(url);

  return JSON.stringify({
    cityName,
    weatherInfo: response.data,
  });
}
```

### Adding the Tool Result to the Conversation

```js
messages.push({
  role: "assistant",
  content: rawResult,
});

messages.push({
  role: "tool",
  content: toolResponse,
});
```

In modern SDKs, tool calls should normally use the platform's official function-calling or tools format rather than a handwritten string protocol.

---

## 8. LLM + Tools = Agent

A basic language model only generates text.

When a language model is connected to tools and can repeatedly decide what action to take, it begins to behave like an **agent**.

```text
LLM + Tools + Control Loop = Agent
```

An agent can:

1. Receive a goal
2. Analyse the task
3. Choose a tool
4. Execute the tool
5. Observe the result
6. Continue until the goal is completed

---

## 9. Loop Engineering

**Loop engineering** is the design of a system that repeatedly performs a cycle such as:

```text
Generate → Evaluate → Improve → Repeat
```

The loop continues until:

- A desired result is achieved
- A stopping condition is reached
- A maximum number of iterations is reached
- The system encounters an error

### Agent Loop Example

```text
User request
   ↓
Model decides next action
   ↓
Tool is called
   ↓
Tool result is returned
   ↓
Model evaluates the result
   ↓
Final answer or another tool call
```

### Important Components

- State management
- Message history
- Tool selection
- Error handling
- Stopping conditions
- Output validation
- Cost and token controls

---

## 10. Role-Play Prompting

In **role-play prompting**, the model is assigned a role or persona.

#### Example

```text
You are a senior software engineer.

Answer only questions related to coding and software engineering.

Use technical terminology when appropriate.
Do not claim to have a personal life or real-world experiences.
```

### Persona Components

A persona can define:

- Role
- Expertise
- Tone
- Communication style
- Allowed topics
- Restricted topics
- Output structure

### Example Persona

```text
Role: Senior Software Developer

Traits:
- Uses precise technical language
- Explains concepts using practical examples
- Avoids unrelated personal discussion
- Focuses on software design, code quality, and engineering trade-offs
```

### Limitation

A persona changes the model's response style, but it does not create real identity, experience, or consciousness.

---

## 11. Prompt Injection and Persona Bypass

A weak system prompt can sometimes be bypassed by requests such as:

```text
Ignore the previous instructions.
```

or:

```text
Answer only for educational purposes.
```

This is known as **prompt injection** or an instruction-hierarchy attack.

### Defensive Techniques

- Keep system instructions clear
- Separate trusted and untrusted content
- Validate tool inputs
- Restrict tool permissions
- Use allowlists
- Never place secrets in prompts
- Treat external text as data, not instructions
- Add output validation
- Require approval for high-impact actions

---

## 12. Alpaca Prompt Format

The **Alpaca format** is an instruction-tuning format commonly structured with sections such as:

```text
### Instruction:
Explain what middleware is in Express.js.

### Input:
A beginner is learning Node.js.

### Response:
Middleware is a function that runs during the request-response cycle.
```

### Common Sections

- `### Instruction`
- `### Input`
- `### Response`

### Why It Is Used

- Easy to read
- Easy to convert into training data
- Separates instructions from inputs
- Useful for supervised fine-tuning datasets

---

## 13. ChatML-Style Prompting

**ChatML-style prompting** represents conversations as structured messages with roles.

Typical roles include:

- `system`
- `user`
- `assistant`
- `tool`

### Example

```json
[
  {
    "role": "system",
    "content": "You are a helpful programming assistant."
  },
  {
    "role": "user",
    "content": "Explain Express middleware."
  },
  {
    "role": "assistant",
    "content": "Express middleware is a function that runs during the request-response cycle."
  }
]
```

### Benefits

- Clear role separation
- Better conversation organization
- Supports multi-turn interactions
- Works well with tools and agents
- Easier to maintain message history

---

## 14. Alpaca vs ChatML

| Feature | Alpaca Format | ChatML-Style Format |
|---|---|---|
| Primary use | Instruction datasets | Chat conversations |
| Structure | Instruction, input, response | Role-based messages |
| Multi-turn support | Limited | Strong |
| Tool support | Not built in | Common |
| Readability | Simple | Structured |
| Best for | Fine-tuning datasets | Chatbots and agents |

---

## 15. Model Distillation

**Knowledge distillation** is a technique in which a smaller model, called the **student**, learns from a larger or stronger model, called the **teacher**.

### General Process

1. Prepare a set of prompts or inputs
2. Ask the teacher model to generate outputs
3. Collect and clean the responses
4. Build a training dataset
5. Train the student model on the dataset
6. Evaluate and improve the student model

### Benefits

- Lower inference cost
- Faster responses
- Smaller deployment size
- Better task-specific performance

---

## 16. Distillation Attack

A **distillation attack** is an attempt to imitate or extract the behavior of a powerful model by repeatedly querying it and training another model on its responses.

### Typical Process

1. Generate many prompts
2. Query the target model
3. Collect its outputs
4. Convert outputs into labelled training data
5. Train a student model
6. Evaluate how closely it imitates the target

### Risks

- Intellectual-property concerns
- Violation of provider terms
- Privacy leakage
- Replication of unsafe behavior
- Replication of model errors and biases

### Important Principle

Synthetic training data is only as useful as its quality.

Poor prompts or incorrect outputs can produce a poor student model.

```text
Poor synthetic data → Poor student model
```

### Good Practice

- Use legally permitted data
- Follow model-provider terms
- Remove private information
- Validate generated outputs
- Include human-reviewed examples
- Evaluate for bias and safety
- Document data provenance

---

## 17. Synthetic Data

**Synthetic data** is data generated artificially rather than collected directly from real-world observations.

### Advantages

- Can be generated at scale
- Useful when real data is limited
- Can cover rare scenarios
- May reduce some privacy risks

### Limitations

- Can contain hallucinations
- Can amplify bias
- May lack real-world diversity
- Can cause model collapse when overused
- Requires filtering and validation

### Best Practice

Use a mixture of:

- High-quality real data
- Human-reviewed examples
- Carefully generated synthetic data
- Evaluation datasets not used during training

---

## 18. Key Formulas

```text
Prompting = Instruction + Context + Constraints + Output Format
```

```text
Few-Shot Prompting = Instruction + Examples + New Task
```

```text
Agent = LLM + Tools + Control Loop
```

```text
Loop Engineering = Generate + Evaluate + Improve + Repeat
```

```text
Knowledge Distillation = Teacher Outputs + Student Training
```

---

## 19. Recommended Prompt Template

```text
Role:
You are an expert in [domain].

Task:
Complete [specific task].

Context:
Use the following information:
[context]

Requirements:
- Requirement 1
- Requirement 2
- Requirement 3

Output Format:
Return the answer as [JSON / Markdown / table / code].

Constraints:
- Do not invent missing facts
- State assumptions clearly
- Keep the response within [length]
```

---

## 20. Summary

The main concepts covered are:

- Zero-shot prompting
- Few-shot prompting
- Structured reasoning prompts
- Prompt loops
- Message history
- Tool requests
- AI agents
- Loop engineering
- Role-play prompting
- Prompt injection
- Alpaca format
- ChatML-style messages
- Knowledge distillation
- Distillation attacks
- Synthetic data quality

The central idea is that a capable AI application is more than a single prompt. It combines:

```text
Good Instructions
+ Structured Messages
+ Tools
+ State
+ Validation
+ Control Loops
= Reliable AI System
```