import 'dotenv/config';
import OpenAi from 'openai';

const client = new OpenAi({
    apiKey:process.env.OPENAI_API_KEY
})

async function name() {
   const result = await client.chat.completions.create({
    model:"gpt-4.1-mini",
    messages:[{role:'user',content:'tell me what is 2 + 2 '}]
})

 

}

name();