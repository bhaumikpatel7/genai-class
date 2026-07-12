import "dotenv/config";
import OpenAi from "openai";

const client = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
});

async function name() {
  const result = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{
        role: "user", 
        content: `
        what is 2 + 5 equals?
        Do not add anything else in ans, take the samples from the examples.
        Examples:
        - what is 5 + 4?
          Expected Output: 9 (Nine)
        - What is 10 + 10?
          Expected Output: 20 (Twenty)
        `
    }],
  });

  console.log(result.choices[0].message.content);
}

name();
