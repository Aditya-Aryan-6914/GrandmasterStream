import { GoogleGenAI, Type } from "@google/genai";
import { Piece, PieceColor, PieceType } from '../types';

let genAI: GoogleGenAI | null = null;

try {
  // Check for API key in process.env (Vite define) or global window object
  const apiKey = process.env.API_KEY || (window as any).process?.env?.API_KEY;
  if (apiKey) {
    genAI = new GoogleGenAI({ apiKey });
  }
} catch (e) {
  console.error("Failed to initialize Gemini", e);
}

const MODEL_NAME = 'gemini-2.5-flash';

// Convert board array to simple text representation for AI
export const boardToText = (board: (Piece | null)[][]): string => {
  let text = "";
  for (const row of board) {
    for (const cell of row) {
      if (cell) {
        text += cell.color === PieceColor.WHITE ? cell.type.toUpperCase() : cell.type.toLowerCase();
      } else {
        text += ".";
      }
      text += " ";
    }
    text += "\n";
  }
  return text;
};

export interface AIChatResponse {
  username: string;
  comment: string;
  sentiment: 'hype' | 'neutral' | 'critical' | 'funny';
}

export const generateStreamChat = async (board: (Piece | null)[][], lastMove: string): Promise<AIChatResponse[]> => {
  if (!genAI) return [];

  const boardStr = boardToText(board);
  const prompt = `
    You are simulating a Twitch chat for a high-stakes chess match.
    The board state is:
    ${boardStr}
    
    The last move was: ${lastMove}.
    
    Generate 3 random chat messages from different imaginary viewers reacting to this move.
    Some should be using chess terminology (blunder, gambit, fianchetto), some should be emojis, some hype, some trash talk.
    Return JSON format.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              username: { type: Type.STRING },
              comment: { type: Type.STRING },
              sentiment: { type: Type.STRING, enum: ['hype', 'neutral', 'critical', 'funny'] }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as AIChatResponse[];
  } catch (error) {
    console.error("Gemini chat error:", error);
    return [];
  }
};

export const analyzePosition = async (board: (Piece | null)[][]): Promise<string> => {
    if (!genAI) return "AI services unavailable.";
  
    const boardStr = boardToText(board);
    const prompt = `
      You are a Grandmaster Chess Coach. Analyze this board position concisely in 2 sentences.
      Board:
      ${boardStr}
      
      Who has the advantage? What is a key threat?
    `;
  
    try {
      const response = await genAI.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
      });
      return response.text || "No analysis available.";
    } catch (error) {
      console.error("Gemini analysis error:", error);
      return "Could not analyze position.";
    }
  };