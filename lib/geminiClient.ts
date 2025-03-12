import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from "expo-file-system";

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function prepareFile(uri: string) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return {
    data: base64,
    mimeType: "audio/wav",
  };
}

export async function transcription(uri: string) {
  try {
    const fileData = await prepareFile(uri);

    const result = await model.generateContent([
      "Transcript this audio clip.",
      {
        inlineData: {
          data: fileData.data,
          mimeType: fileData.mimeType,
        },
      },
    ]);

    return { response: result.response.text() };
  } catch (error) {
    console.error("Failed to transcribe audio: ", error);
    throw error;
  }
}

export async function textToSpeech(text: string) {
  try {
    const result = await model.generateContent(text);
    return result.response.text().replace(/\*/g, "");
  } catch (error) {
    console.error("Failed to generate speech audio: ", error);
    throw error;
  }
}
