// config/gemini.js

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

/**
 * Generates content using the Gemini API based on a prompt and desired length.
 */
async function main(prompt, length = 'long') {
    
    // DEBUG: Confirm prompt received (Visible in your Node.js terminal)
    console.log("Gemini Input Prompt Received:", prompt, "Length Parameter:", length);
    
    let systemInstruction = "";
    let maxTokens = 0;

    if (length === 'short') {
        systemInstruction = "You are a concise blog post writer. Generate a short, to-the-point project description in 1-2 paragraphs. Keep the output under 100 words.";
        maxTokens = 150; 
    } else { 
        systemInstruction = "You are a detailed blog post writer. Generate a comprehensive project description for the given topic in several paragraphs.";
        maxTokens = 900;
    }
    
    // Use the dynamic prompt
    const fullPrompt = `Topic: "${prompt}". Generate a project description for this topic in simple text format.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: fullPrompt,
            config: {
                systemInstruction: systemInstruction,
                maxOutputTokens: maxTokens, 
            }
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API Error in main function:", error);
        throw error; 
    }
}

export default main;