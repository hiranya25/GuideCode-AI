
import { GoogleGenAI, Type } from "@google/genai";
import { CodeReviewInput, Message } from "../types";

const SYSTEM_INSTRUCTION = `
You are the GuideCode AI Coding Mentor. Your mission is to help students learn how to THINK about code without giving them the answers.

STRICT RULES:
1. NEVER provide code snippets, full functions, or exact syntax.
2. NEVER use markdown code blocks (e.g., \`\`\`).
3. NEVER provide final solutions or runnable programs.
4. If asked for code, politely refuse: "I can’t provide the final code, but I’ll guide you step by step so you can write it yourself."

STRUCTURE FOR NEW PROBLEMS (Phase 1):
When a user provides a new problem, you MUST provide exactly these 5 sections using these EXACT headers:
### 1. PROBLEM UNDERSTANDING
[Restate simply, identify inputs/outputs/constraints]

### 2. APPROACH
[High-level strategy in plain English]

### 3. HINTS
[2-3 logical hints as a numbered list]

### 4. EDGE CASES
[Mention boundary cases like empty input]

### 5. COMPLEXITY
[Time and space complexity conceptually]

STRUCTURE FOR FOLLOW-UPS / PSEUDO-LOGIC (Phase 2):
If the user asks for pseudo-code or more detail:
### PSEUDO STEPS
Provide a numbered list of PLAIN ENGLISH ACTIONS. 
Example:
1. Start a counter at zero
2. Loop through the list
3. If current item is what we want, increment counter

PROHIBITED: Do not use "if", "for", "while", brackets, or indentation that resembles real code.

TONE: Professional, encouraging mentor. Focus on clarity and logical thinking.
`;

export async function getGuidanceFromAI(messages: Message[]) {
  // Fixed: Initialized GoogleGenAI strictly using process.env.API_KEY as per standard guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const contents = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  try {
    const response = await ai.models.generateContent({
      // Fixed: Using gemini-3-pro-preview for complex reasoning and coding logic tasks.
      model: 'gemini-3-pro-preview',
      contents: contents as any,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.5, // Lower temperature for more consistent structure
      },
    });

    // Fixed: Accessed .text property directly (not as a method).
    const text = response.text || "I'm reflecting on that. Can you tell me more about where you're stuck?";
    return text.replace(/```json|```/g, '').trim();
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
}

export async function getCodeReviewFromAI(inputData: CodeReviewInput) {
  // Fixed: Initialized GoogleGenAI strictly using process.env.API_KEY as per standard guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const prompt = `Review this ${inputData.language} code attempt. Point out logical mistakes or efficiency issues but DO NOT provide the corrected code. Respond in JSON.
  Code: ${inputData.code}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            logicalIssues: { type: Type.STRING },
            efficiencyConcerns: { type: Type.STRING },
            improvementSuggestions: { type: Type.STRING },
          },
          required: ["logicalIssues", "efficiencyConcerns", "improvementSuggestions"]
        }
      },
    });

    // Fixed: Accessed .text property directly.
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Review Error:", error);
    throw error;
  }
}
