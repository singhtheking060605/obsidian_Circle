// // config/gemini.js

// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// /**
//  * Generates content using the Gemini API based on a prompt and desired length.
//  */
// async function main(prompt, length = 'long') {
    
//     // DEBUG: Confirm prompt received (Visible in your Node.js terminal)
//     console.log("Gemini Input Prompt Received:", prompt, "Length Parameter:", length);
    
//     let systemInstruction = "";
//     let maxTokens = 0;

//     if (length === 'short') {
//         systemInstruction = "You are a concise blog post writer. Generate a short, to-the-point project description in 1-2 paragraphs. Keep the output under 100 words.";
//         maxTokens = 150; 
//     } else { 
//         systemInstruction = "You are a detailed blog post writer. Generate a comprehensive project description for the given topic in several paragraphs.";
//         maxTokens = 900;
//     }
    
//     // Use the dynamic prompt
//     const fullPrompt = `Topic: "${prompt}". Generate a project description for this topic in simple text format.`;
    
//     try {
//         const response = await ai.models.generateContent({
//             model: "gemini-2.5-flash", 
//             contents: fullPrompt,
//             config: {
//                 systemInstruction: systemInstruction,
//                 maxOutputTokens: maxTokens, 
//             }
//         });

//         return response.text;
//     } catch (error) {
//         console.error("Gemini API Error in main function:", error);
//         throw error; 
//     }
// }

// export default main;


// backend/config/gemini.js (FIXED - Standardizing Exports)

import { GoogleGenAI } from "@google/genai";

// 1. Initialize and export the client object for direct use by services
// The 'ai' object is what the controllers/services need to call methods like generateContent.
const aiClient = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

/**
 * Named export: Returns the initialized Gemini client.
 * This function will be imported as 'getGeminiModel' in utility files.
 */
export const getGeminiModel = () => {
    return aiClient;
};


// 2. The original main function (renamed to avoid conflict, exported as default if needed)
/**
 * Generates content using the Gemini API based on a prompt and desired length.
 */
export async function generateContent(prompt, length = 'long') {
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
        const response = await aiClient.models.generateContent({ // Use aiClient here
            model: "gemini-2.5-flash", 
            contents: fullPrompt,
            config: {
                systemInstruction: systemInstruction,
                maxOutputTokens: maxTokens, 
            }
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API Error in generateContent function:", error);
        throw error; 
    }
}

// Export the primary generation function as default if needed by other parts of the app
export default generateContent;