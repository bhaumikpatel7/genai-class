import 'dotenv/config';
import OpenAI from 'openai';

const client = new OpenAI();

async function init() {
  try {
    const stream = await client.responses.create({
      model: 'gpt-5.5',
      input: [
        {
          role: 'user',
          content:
            'Tell me the story and summary of Little Red Riding Hood.',
        },
      ],
      stream: true,
    });

    for await (const event of stream) {
        // event.type === 'response.output_text.delta' = This ensures you print only text-generation events.
      if (event.type === 'response.output_text.delta') {
        process.stdout.write(event.delta);
      }
    }
// This prints text without automatically moving to a new line.
    process.stdout.write('\n');
  } catch (error) {
    console.error('OpenAI API error:', error.message);
  }
}

init();