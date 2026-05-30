import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface AIExtractionResult {
  id: string;
  place_name: string | null;
  category: string;
  city: string | null;
  province: string | null;
  confidence: number;
}

export async function extractLocationsBatch(
  items: { id: string; query: string; caption: string }[]
): Promise<AIExtractionResult[]> {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-flash-latest",
    generationConfig: { responseMimeType: "application/json" }
  });

  const systemPrompt = `
    You are an expert geographical data extractor.
    You will receive a JSON array containing TikTok video data.
    You MUST return a JSON array of objects. Do not return a single object.
    
    Each object in your output array MUST have the following fields:
    - id (String: you MUST return the exact same id from the input)
    - place_name (String or null)
    - category (String: strictly one of: [cafe, restaurant, street_food, nature, beach, mountain, hotel, historical, museum, shopping, camping, nightlife, family])
    - city (String or null)
    - province (String or null)
    - confidence (Float: 0.0 to 1.0)
  `;

  const userPrompt = JSON.stringify(items);

  try {
    const result = await model.generateContent([
      { text: systemPrompt },
      { text: userPrompt }
    ]);
    
    const responseText = result.response.text();
    return JSON.parse(responseText) as AIExtractionResult[];
    
  } catch (error) {
    console.error("AI Batch Extraction Failed:", error);
    return []; 
  }
}