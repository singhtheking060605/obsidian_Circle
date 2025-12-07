import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateWithOpenAI(prompt, length = 'long') {
    const maxTokens = length === 'short' ? 150 : 800;
    
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: length === 'short' 
                    ? "You are a concise blog writer. Generate short descriptions under 100 words."
                    : "You are a detailed blog writer. Generate comprehensive content."
            },
            {
                role: "user",
                content: `Generate a blog content for this topic: ${prompt}`
            }
        ],
        max_tokens: maxTokens
    });

    return completion.choices[0].message.content;
}

export default generateWithOpenAI;