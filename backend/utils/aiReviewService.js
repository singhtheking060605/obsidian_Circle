// backend/utils/aiReviewService.js (Import is now CORRECT)

import { getGeminiModel } from '../config/gemini.js'; // CORRECT: Named import matches named export

/**
 * Generates an AI draft review based on submission content and rubric details.
 */
export const draftReview = async (submissionContent, rubricDetails, userName) => {
    const systemInstruction = `You are an expert technical mentor AI. Your task is to auto-draft a performance review for a submission based on the provided rubric. The output MUST be a single JSON object.`;

    const userPrompt = `
        Reviewing submission from user: ${userName}
        
        **Rubric Details:** ${JSON.stringify(rubricDetails, null, 2)}
        **Student Submission Content:** --- ${submissionContent} ---

        Analyze the submission against the rubric. Generate a drafted response in a single JSON object with two keys: "scores" (object of numerical scores) and "feedback" (markdown-formatted string).
    `;

    try {
        const model = getGeminiModel(); // CORRECT: getGeminiModel returns the client
        
        const response = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        scores: { type: "object" },
                        feedback: { type: "string" }
                    },
                    required: ["scores", "feedback"]
                }
            }
        });

        return JSON.parse(response.text.trim());

    } catch (error) {
        console.error("AI Review Drafting Error:", error);
        throw new Error("Failed to generate AI draft review.");
    }
};