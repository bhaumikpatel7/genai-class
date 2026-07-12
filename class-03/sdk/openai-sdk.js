import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      instructions: "You are a helpful JavaScript programming assistant.",
      input: "Explain JavaScript promises in simple terms.",
    });

    console.log(response.output_text);
  } catch (error) {
    console.error("OpenAI API error:");
  }
}

main();