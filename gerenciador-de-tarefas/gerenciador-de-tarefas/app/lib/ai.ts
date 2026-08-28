import OpenAI from "openai";

// hot-reload do Next.js não estourar o limite de conexões da API
const globalForOpenAI = globalThis as unknown as {
  openai: OpenAI | undefined;
};

export const aiClient =
  globalForOpenAI.openai ??
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

if (process.env.NODE_ENV !== "production") {
  globalForOpenAI.openai = aiClient;
}
