import 'dotenv/config' 
import OpenAI from "openai";

const client = new OpenAI({
  
    apiKey : process.env.OPENAI_API_KEY
});


client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages:[{
        role:'user',
        content:'Hello Bhaumik here'
    }]
}).then(response =>{
    console.log(response.choices[0].message.content);
})


