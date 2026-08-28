"use server";

import { chatWithAnalystService } from "../services/aiServices";

export async function sendMessageToAnalyst(
  projectId: string,
  message: string,
  history: any[],
) {
  try {
    const reply = await chatWithAnalystService(projectId, message, history);
    return reply;
  } catch (error) {
    console.error("Erro no chat da IA:", error);
    throw new Error("Falha ao se comunicar com o analista.");
  }
}
