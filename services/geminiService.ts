
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIPairingSuggestion = async (item: MenuItem): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest a perfect drink or side dish pairing for this hotel menu item: "${item.name} - ${item.description}". Give a short, elegant 1-sentence response.`,
      config: {
        maxOutputTokens: 100,
      }
    });
    return response.text || "Our sommelier recommends a crisp white wine with this selection.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Chef's special pairing available upon request.";
  }
};

export const getAIMenuDescription = async (itemName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Write a luxurious, mouth-watering 2-sentence menu description for a dish named "${itemName}". Focus on premium ingredients and cooking techniques.`,
    });
    return response.text || "A masterpiece of culinary excellence, prepared fresh for your enjoyment.";
  } catch (error) {
    return "Exquisite dish prepared by our world-class chefs.";
  }
};

export const generateMenuItemImage = async (name: string, description: string): Promise<string | null> => {
  try {
    const aiImage = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await aiImage.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A professional, high-end food photography shot of a hotel menu item: ${name}. Description: ${description}. Gourmet presentation, cinematic lighting, 8k resolution, neutral elegant background.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "4:3",
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};
