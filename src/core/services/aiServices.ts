import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Initializes the Gemini model using your API key
 */
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;
if (!API_KEY) throw new Error("Gemini API key is missing");

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

/**
 * Generate structured JSON from a prompt using a schema.
 * @param prompt The user question
 * @param schema An example JSON object representing the expected structure
 * @returns A typed object matching the schema
 */
export async function generateAIJson<T extends Record<string, any>>(
  prompt: string,
  schema: T
): Promise<T> {
  const fullPrompt = `
You are a helpful assistant that responds only in JSON format.

Use this schema to format your answer:
${JSON.stringify(schema, null, 2)}

Prompt:
${prompt}

Respond ONLY with a valid JSON object and nothing else.
`;

  try {
    const result = await model.generateContent(fullPrompt);
    const rawText = result.response.text()?.trim() ?? "";

    const cleanText = rawText
      .replace(/```json|```/g, "") // Remove markdown formatting
      .trim();

    const parsed: T = JSON.parse(cleanText);
    return parsed;
  } catch (err) {
    console.error("Failed to parse Gemini response as JSON:", err);
    throw new Error("Invalid response format from Gemini");
  }
}
