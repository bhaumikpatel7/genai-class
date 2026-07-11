# Introduction to Generative AI

## 1. Large Language Models

### What is an LLM?

**LLM** stands for **Large Language Model**.

An LLM is an AI model trained on a very large amount of text so that it can understand and generate human-like language.

Examples of tasks an LLM can perform:

- Answer questions
- Summarize documents
- Generate code
- Translate text
- Write emails or articles
- Continue conversations
- Extract information from text

---

## 2. GPT and ChatGPT

### GPT

**GPT** stands for:

```text
Generative Pre-trained Transformer
```

- **Generative**: It generates new text.
- **Pre-trained**: It is trained on large datasets before being used by users.
- **Transformer**: It uses the Transformer neural network architecture.

### ChatGPT

**ChatGPT** is an application that allows users to interact with GPT models through a conversational interface.

```text
GPT = The underlying model
ChatGPT = An application that uses GPT models
```

---

## 3. Next-Token Prediction

A GPT-style model generates text by predicting the **next token**.

```text
Previous tokens → GPT/LLM → Next-token prediction
```

The model:

1. Reads the tokens already provided
2. Calculates a probability for possible next tokens
3. Selects one token
4. Adds it to the existing sequence
5. Repeats the process

### Example

Input:

```text
The capital of France is
```

Possible next-token probabilities:

```text
Paris      0.93
London     0.02
France     0.01
Berlin     0.01
Other      0.03
```

The model will most likely select:

```text
Paris
```

### Complete Generation Process

For a prompt such as:

```text
Write a story about me.
```

The model approximately performs the following process:

```text
Text
  ↓
Tokenization
  ↓
Token IDs
  ↓
Embeddings
  ↓
Transformer processing
  ↓
Token probability distribution
  ↓
Next token
  ↓
Repeat until completion
```

---

## 4. Tokenization

### What is Tokenization?

**Tokenization** is the process of breaking text into smaller units called **tokens** before the model processes it.

A token can be:

- A complete word
- Part of a word
- A punctuation mark
- A number
- A space or special symbol

### Example

The sentence:

```text
I am learning Generative AI.
```

might be divided into tokens similar to:

```text
["I", " am", " learning", " Generative", " AI", "."]
```

The exact tokenization depends on the tokenizer being used.

### Why Is Tokenization Required?

Computers do not directly understand natural language.

The model therefore converts:

```text
Human-readable text → Tokens → Numeric token IDs
```

These numeric values can then be processed mathematically.

---

## 5. Vocabulary

A model's **vocabulary** is the complete set of tokens that its tokenizer recognizes.

A vocabulary may contain:

- Common words
- Word fragments
- Numbers
- Symbols
- Punctuation
- Special control tokens

Example tokens:

```text
"the"
"cat"
"ing"
"un"
"."
"2026"
```

A model can only directly process tokens that exist in its tokenizer vocabulary.

Unknown words are usually broken into smaller known token pieces.

---

## 6. Encoding and Decoding

### Encoding

**Encoding** converts text into token IDs.

```text
Text → Token IDs
```

### Decoding

**Decoding** converts token IDs back into readable text.

```text
Token IDs → Text
```

### JavaScript Example with `js-tiktoken`

```js
import { encodingForModel } from "js-tiktoken";

const encoder = encodingForModel("gpt-4o");

const text = "Hello, I am Jaani";

// Convert text into token IDs
const encoded = encoder.encode(text);

console.log("Encoded tokens:", encoded);

// Convert token IDs back into text
const decodedBytes = encoder.decode(encoded);
const decodedText = new TextDecoder().decode(decodedBytes);

console.log("Decoded text:", decodedText);
```

### Important Note

Tokenizer libraries and model names can change over time. Always check the current library documentation before using a specific model identifier.

---

## 7. Embeddings

### What Is an Embedding?

An **embedding** is a numerical vector that represents the meaning of a token, sentence, paragraph, image, or other piece of information.

```text
Token → Numerical vector
```

A simplified embedding may look like:

```text
Paris → [0.17, -0.42, 0.88, ...]
```

The real embedding usually contains hundreds or thousands of dimensions.

### Semantic Meaning

Embeddings place semantically similar concepts near each other in vector space.

For example:

```text
Paris
Eiffel Tower
France
```

would normally be closer together than:

```text
Paris
Database
Microwave
```

### Simplified Vector-Space Idea

```text
          Eiffel Tower
               *
              /
         Paris *
              \
               * France


                    * Database
```

### Common Uses of Embeddings

- Semantic search
- Recommendation systems
- Retrieval-Augmented Generation
- Document similarity
- Clustering
- Classification
- Duplicate detection

---

## 8. Positional Encoding

A Transformer processes many tokens in parallel, so it needs information about token order.

**Positional encoding** adds position information to token embeddings.

```text
Token embedding + Positional information = Model input
```

### Why Position Matters

Consider these sentences:

```text
Jaani loves art.
Art loves Jaani.
```

Both sentences contain nearly the same tokens, but their meanings are different because the token order is different.

Positional encoding helps the model distinguish between:

- The first token
- The second token
- Later tokens
- Relative positions between tokens

Without position information, the model would know which tokens are present but not their correct order.

---

## 9. Transformer Architecture

The Transformer is the main architecture used by GPT-style models.

A simplified Transformer flow is:

```text
Tokens
  ↓
Token embeddings
  ↓
Positional encoding
  ↓
Self-attention
  ↓
Feed-forward neural network
  ↓
Output probabilities
```

A real Transformer contains many repeated layers.

---

## 10. Self-Attention

### What Is Self-Attention?

**Self-attention** allows each token to examine other tokens in the same sequence and determine which ones are most relevant.

### Example

Consider the phrases:

```text
ICICI Bank
River bank
```

The word `bank` has different meanings.

In:

```text
ICICI Bank
```

`bank` refers to a financial institution.

In:

```text
river bank
```

`bank` refers to the land beside a river.

Self-attention examines surrounding tokens to understand the correct meaning.

### Main Purpose

Self-attention helps the model understand:

- Context
- Relationships between words
- Pronoun references
- Long-distance dependencies
- Multiple meanings of the same word

---

## 11. Query, Key, and Value

During self-attention, each token representation is transformed into three vectors:

```text
Q = Query
K = Key
V = Value
```

### Query

The **Query** represents what the current token is looking for.

### Key

The **Key** represents what information a token can be matched against.

### Value

The **Value** contains the information that may be passed forward.

### Simplified Attention Process

For each token:

1. Create Query, Key, and Value vectors
2. Compare the Query with the Keys of other tokens
3. Calculate attention scores
4. Normalize the scores using softmax
5. Use the scores as weights
6. Combine the Value vectors

### Formula

The standard scaled dot-product attention formula is:

```text
Attention(Q, K, V) =
softmax((QKᵀ) / √dₖ)V
```

Where:

- `Q` = Query matrix
- `K` = Key matrix
- `V` = Value matrix
- `dₖ` = Dimension of the Key vectors

---

## 12. Attention Scores

Attention scores show how strongly one token should pay attention to another token.

Example:

```text
The animal did not cross the street because it was tired.
```

The model may assign strong attention between:

```text
it → animal
```

This helps the model infer what the pronoun `it` refers to.

### Normalization with Softmax

Raw attention scores are converted into normalized weights using **softmax**.

Example:

```text
Raw scores:        [2.1, 0.8, -0.3]
Softmax weights:   [0.73, 0.20, 0.07]
```

The weights approximately add up to:

```text
1.0
```

The model then creates a weighted combination of the Value vectors.

---

## 13. Softmax

### What Is Softmax?

**Softmax** converts a collection of raw scores, called logits, into a probability distribution.

Example:

```text
Logits:         [3.0, 1.0, 0.5]
Probabilities:  [0.82, 0.11, 0.07]
```

The output values:

- Are between `0` and `1`
- Add up to approximately `1`
- Represent relative probabilities

### Where Softmax Is Used

Softmax is commonly used for:

- Attention weights
- Next-token probabilities
- Multi-class classification

---

## 14. Feed-Forward Neural Network

After self-attention, each token representation is passed through a **Feed-Forward Neural Network**, often abbreviated as **FFN**.

```text
Self-attention output
  ↓
Feed-forward network
  ↓
Updated token representation
```

The FFN:

- Processes each token representation independently
- Learns more complex patterns
- Adds non-linear transformations
- Helps extract higher-level features

A simplified FFN can be represented as:

```text
FFN(x) = Activation(xW₁ + b₁)W₂ + b₂
```

Common activation functions include:

- ReLU
- GELU
- SwiGLU

---

## 15. Probability Distribution

After Transformer processing, the model produces a score for every possible token in its vocabulary.

```text
Token scores → Softmax → Token probabilities
```

Example:

```text
Prompt: "I like eating"

pizza      0.42
food       0.19
apples     0.11
outside    0.03
other      0.25
```

The model selects the next token based on this probability distribution.

The selection may be:

- Deterministic
- Randomly sampled
- Controlled by temperature
- Restricted using top-k or top-p sampling

---

## 16. Temperature

### What Is Temperature?

**Temperature** controls the randomness of token selection.

It modifies the logits before softmax:

```text
Adjusted logits = Original logits / Temperature
```

### Low Temperature

Example:

```text
temperature = 0.1
```

Effects:

- More predictable
- More focused
- Less creative
- More likely to choose the highest-probability token

Useful for:

- Code generation
- Data extraction
- Factual answers
- Structured outputs

### High Temperature

Example:

```text
temperature = 1.2
```

Effects:

- More varied
- More creative
- Less predictable
- Greater chance of unusual outputs

Useful for:

- Brainstorming
- Story writing
- Creative generation

### Important Clarification

Temperature does not directly add knowledge or intelligence. It only changes how probabilities are distributed during token selection.

---

## 17. Cross-Entropy Loss

### What Is Cross-Entropy Loss?

**Cross-entropy loss** measures how different the model's predicted probability distribution is from the correct answer.

It is commonly used during model training.

### Example

Suppose the correct next token is:

```text
Paris
```

The model predicts:

```text
Paris     0.80
London    0.10
Berlin    0.05
Rome      0.05
```

This prediction has relatively low loss because the correct token received a high probability.

If the model predicts:

```text
Paris     0.05
London    0.70
Berlin    0.15
Rome      0.10
```

the loss will be much higher.

### Simplified Formula

For the correct class:

```text
Loss = -log(predicted probability of the correct token)
```

Example:

```text
Correct-token probability = 0.80

Loss = -log(0.80)
```

The closer the probability is to `1`, the lower the loss.

### Training Goal

The model training process attempts to:

```text
Minimize cross-entropy loss
```

This improves the model's ability to predict correct next tokens.

---

## 18. Complete Training and Generation Flow

### During Training

```text
Training text
  ↓
Tokenization
  ↓
Token IDs
  ↓
Embeddings + positional information
  ↓
Transformer layers
  ↓
Predicted next-token probabilities
  ↓
Compare prediction with correct token
  ↓
Calculate cross-entropy loss
  ↓
Update model weights using backpropagation
```

### During Text Generation

```text
User prompt
  ↓
Tokenization
  ↓
Token IDs
  ↓
Embeddings + positional information
  ↓
Transformer layers
  ↓
Next-token probability distribution
  ↓
Token selection
  ↓
Append selected token
  ↓
Repeat
```

---

## 19. JavaScript Example: Calling an OpenAI Model

```js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "Hello, how are you?",
        },
      ],
    });

    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI request failed:", error);
  }
}

main();
```

### Environment Variable

Store the API key in an environment variable instead of placing it directly in source code.

```bash
export OPENAI_API_KEY="your-api-key"
```

### Important Security Rule

Never commit API keys to:

- GitHub
- Public repositories
- Frontend JavaScript
- Screenshots
- Shared configuration files

---

## 20. Concept Relationships

```text
Text
  ↓
Tokenization
  ↓
Token IDs
  ↓
Token embeddings
  +
Positional encoding
  ↓
Transformer layers
  ├── Self-attention
  │     ├── Query
  │     ├── Key
  │     ├── Value
  │     └── Softmax attention weights
  │
  └── Feed-forward neural network
  ↓
Vocabulary logits
  ↓
Softmax
  ↓
Probability distribution
  ↓
Temperature and sampling
  ↓
Next token
```

---

## 21. Key Terms

| Term | Meaning |
|---|---|
| LLM | Large Language Model |
| GPT | Generative Pre-trained Transformer |
| Token | A small unit of text processed by a model |
| Tokenization | Breaking text into tokens |
| Vocabulary | Set of tokens known by the tokenizer |
| Encoding | Converting text into token IDs |
| Decoding | Converting token IDs back into text |
| Embedding | Numerical vector representing meaning |
| Positional encoding | Information about token order |
| Self-attention | Mechanism for finding relationships between tokens |
| Query | What a token is looking for |
| Key | Information used for matching |
| Value | Information combined using attention weights |
| Softmax | Converts scores into probabilities |
| FFN | Feed-Forward Neural Network |
| Temperature | Controls token-selection randomness |
| Cross-entropy loss | Measures prediction error during training |
| Logit | Raw score before softmax |
| Probability distribution | Probability assigned to each possible token |

---

## 22. Summary

A Large Language Model works by repeatedly predicting the next token.

The main process is:

```text
1. Break text into tokens
2. Convert tokens into numeric IDs
3. Convert token IDs into embeddings
4. Add positional information
5. Process tokens using self-attention
6. Transform representations using feed-forward networks
7. Produce scores for possible next tokens
8. Convert scores into probabilities using softmax
9. Select a token based on sampling settings
10. Repeat until the response is complete
```

The central idea is:

```text
LLM output =
Tokenization
+ Embeddings
+ Position information
+ Self-attention
+ Neural-network processing
+ Probability-based next-token selection
```