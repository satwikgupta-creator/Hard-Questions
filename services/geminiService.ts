import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chatSession: Chat | null = null;

export const initializeChat = () => {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for faster, conversational response
    },
  });
  return chatSession;
};

export const sendMessageStream = async (message: string): Promise<AsyncIterable<GenerateContentResponse>> => {
  if (!chatSession) {
    initializeChat();
  }
  
  if (!chatSession) {
      throw new Error("Failed to initialize chat session");
  }

  return chatSession.sendMessageStream({ message });
};

export const analyzeDistortions = async (userText: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `
            Analyze the following text for cognitive distortions, logical fallacies, or self-limiting beliefs. 
            Be ruthless. Label the distortion and explain why it's bullshit in 2 sentences max.
            
            User Text: "${userText}"
            `,
        });
        return response.text || "No specific distortions detected, but let's look deeper.";
    } catch (error) {
        console.error("Analysis failed", error);
        return "Could not perform deep analysis at this moment.";
    }
};
