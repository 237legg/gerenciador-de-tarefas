import { aiClient } from "../lib/ai";
import { getProjectStatusTool, getOverdueTasksTool } from "./analyticsService";
import OpenAI from "openai";

export async function chatWithAnalystService(
  projectId: string,
  userMessage: string,
  chatHistory: any[] = [],
) {
  const tools: OpenAI.Chat.ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: "getProjectStatus",
        description:
          "Busca o número de tarefas em cada coluna do projeto atual para ver onde estão os gargalos.",
        parameters: {
          type: "object",
          properties: { projectId: { type: "string" } },
          required: ["projectId"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "getOverdueTasks",
        description:
          "Busca a lista de tarefas que já passaram do prazo de entrega.",
        parameters: {
          type: "object",
          properties: { projectId: { type: "string" } },
          required: ["projectId"],
        },
      },
    },
  ];
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content:
        "Você é um analista de dados de projetos Kanban. Responda de forma clara, curta e amigável. Use as ferramentas disponíveis para buscar dados reais sempre que necessário.",
    },
    ...chatHistory,
    { role: "user", content: userMessage },
  ];
  const response = await aiClient.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
    tools: tools,
    tool_choice: "auto",
  });

  const responseMessage = response.choices[0].message;
  if (responseMessage.tool_calls) {
    messages.push(responseMessage);

    for (const toolCall of responseMessage.tool_calls) {
      if (toolCall.type === "function") {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);

        let functionResult = "";

        if (functionName === "getProjectStatus") {
          const data = await getProjectStatusTool(functionArgs.projectId);
          functionResult = JSON.stringify(data);
        } else if (functionName === "getOverdueTasks") {
          const data = await getOverdueTasksTool(functionArgs.projectId);
          functionResult = JSON.stringify(data);
        }

        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          content: functionResult,
        });
      }
    }
    const secondResponse = await aiClient.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
    });

    return secondResponse.choices[0].message.content;
  }

  return responseMessage.content;
}

type AIMetadataResponse = {
  suggestedTags: string[];
  detectedDeadline: string | null;
};

export async function tagDeadlineSuggestionService(
  title: string,
  description: string = "",
): Promise<AIMetadataResponse> {
  const prompt = `
    Você é um assistente de produtividade integrado a um sistema Kanban.
    Analise o título e a descrição da tarefa abaixo.
    
    1. Sugira de 1 a 3 etiquetas (tags) curtas e diretas que categorizem a tarefa (ex: "Bug", "Marketing", "Urgente").
    2. Identifique se há alguma menção a prazos (ex: "até sexta", "para o dia 15"). Se houver, calcule a data no formato ISO 8601 (YYYY-MM-DDTHH:mm:ssZ). Considere que hoje é ${new Date().toISOString()}. Se não houver prazo, retorne null.

    Tarefa: ${title}
    Descrição: ${description}

    Responda EXCLUSIVAMENTE em formato JSON válido, com a seguinte estrutura exata:
    {
      "suggestedTags": ["tag1", "tag2"],
      "detectedDeadline": "2026-09-15T12:00:00Z" ou null
    }
  `;

  const response = await aiClient.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "Você é um assistente que retorna apenas JSON. ",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  const rawContent = response.choices[0].message.content;

  if (!rawContent) {
    return { suggestedTags: [], detectedDeadline: null };
  }

  const parsedData = JSON.parse(rawContent) as AIMetadataResponse;

  return parsedData;
}

export async function generateSubtasksService(
  title: string,
  description: string = "",
): Promise<string[]> {
  const prompt = `
    Você é um especialista em produtividade focado em metodologia ágil.
    Analise o título e a descrição da tarefa abaixo e quebre-a em um checklist prático, sequencial e acionável.
    Gere entre 3 a 7 etapas, dependendo da complexidade.
    
    Tarefa: ${title}
    Descrição: ${description}

    Responda EXCLUSIVAMENTE em formato JSON válido, com a seguinte estrutura:
    {
      "subtasks": ["Passo 1", "Passo 2", "Passo 3"]
    }
  `;

  const response = await aiClient.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "Você é um assistente estrutural que retorna apenas JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });

  const rawContent = response.choices[0].message.content;

  if (!rawContent) {
    return [];
  }

  const parsedData = JSON.parse(rawContent) as { subtasks: string[] };
  return parsedData.subtasks || [];
}

export async function summarizeDescriptionService(
  description: string,
): Promise<string> {
  if (!description || description.trim().length < 30) {
    return description;
  }
  const prompt = `
    Você é um especialista em produtividade e clareza.
    Abaixo está a descrição bruta de uma tarefa. Reescreva-a para torná-la concisa, direta e fácil de ler, removendo enrolações, mas mantendo todas as informações, requisitos e contextos essenciais.
    
    Descrição original:
    ${description}

    Responda EXCLUSIVAMENTE em formato JSON válido, com a seguinte estrutura:
    {
      "summary": "descrição enxuta aqui"
    }
  `;
  const response = await aiClient.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Você é um assistente de redação técnica que retorna apenas JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });

  const rawContent = response.choices[0].message.content;

  if (!rawContent) {
    throw new Error("Falha ao gerar o resumo da descrição.");
  }

  const parsedData = JSON.parse(rawContent) as { summary: string };

  return parsedData.summary;
}

type TaskForAnalysis = {
  id: string;
  title: string;
  deadline: Date | null;
  tags: { name: string }[];
};
export async function getPriorityTaskService(
  tasks: TaskForAnalysis[],
): Promise<{ priorityTaskId: string; reason: string } | null> {
  if (!tasks || tasks.length < 2) {
    return null;
  }
  const tasksPayload = tasks.map((t) => ({
    id: t.id,
    title: t.title,
    deadline: t.deadline,
    tags: t.tags.map((tag) => tag.name),
  }));

  const prompt = `
    Você é um gerente de projetos ágil. Analise a lista de tarefas abaixo e determine qual deve ser feita PRIMEIRO.
    Dê peso maior para tarefas com prazo (deadline) mais próximo da data de hoje (${new Date().toISOString()}) e etiquetas de urgência (ex: "Bug", "Urgente").
    
    Lista de Tarefas:
    ${JSON.stringify(tasksPayload, null, 2)}

    Responda EXCLUSIVAMENTE em formato JSON com o ID da tarefa escolhida e uma justificativa curta (máx 15 palavras).
    {
      "priorityTaskId": "id_da_tarefa_aqui",
      "reason": "Vence amanhã e está marcada como Urgente."
    }
  `;

  const response = await aiClient.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "Retorne apenas JSON válido." },
      { role: "user", content: prompt },
    ],
    temperature: 0.1, // usar 100% logica
  });

  const rawContent = response.choices[0].message.content;
  if (!rawContent) return null;

  return JSON.parse(rawContent) as { priorityTaskId: string; reason: string };
}

export async function processVoiceToTaskService(audioFile: File) {
  const transcription = await aiClient.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
  });
  const rawText = transcription.text;
  if (!rawText) throw new Error("Não foi possível transcrever o áudio.");

  const prompt = `
    Transforme a seguinte transcrição de áudio em um cartão de tarefa Kanban.
    Crie um título curto e direto. Organize os detalhes e solicitações em uma descrição clara, utilizando tópicos (bullet points) se houver múltiplos itens.
    
    Transcrição: "${rawText}"

    Responda EXCLUSIVAMENTE em formato JSON:
    {
      "name": "Título da Tarefa",
      "description": "Descrição estruturada..."
      "deadline": "Prazo final da tarefa, se o texto nao especificar nada, retore null nesse campo"
    }
  `;

  const response = await aiClient.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "Você formata transcrições de voz retornando apenas JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  const structuredContent = response.choices[0].message.content;
  if (!structuredContent) throw new Error("Falha ao estruturar a tarefa.");

  return JSON.parse(structuredContent) as {
    name: string;
    description: string;
    deadline: Date | null;
  };
}

export async function improveWritingService(
  draft: string,
  tone: "profissional" | "amigável" | "direto" = "profissional",
): Promise<string> {
  if (!draft || draft.trim().length < 5) return draft;

  const prompt = `
    Reescreva o texto abaixo para torná-lo mais claro, corrigindo erros gramaticais e ajustando o tom para ficar estritamente "${tone}".
    O texto original pode ser uma descrição de tarefa ou uma resposta a um cliente. Mantenha as informações originais intactas.

    Texto Original: "${draft}"

    Responda EXCLUSIVAMENTE em formato JSON válido:
    {
      "improvedText": "texto reescrito aqui"
    }
  `;

  const response = await aiClient.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "Você é um revisor de textos que retorna apenas JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  });

  const rawContent = response.choices[0].message.content;
  if (!rawContent) throw new Error("Falha ao reescrever o texto.");

  return (JSON.parse(rawContent) as { improvedText: string }).improvedText;
}

export type AIProjectGeneration = {
  projectName: string;
  columns: {
    name: string;
    tasks: {
      title: string;
      description: string;
    }[];
  }[];
};

export async function generateFullProjectService(
  userPrompt: string,
): Promise<AIProjectGeneration> {
  const prompt = `
    Você é um gerente de projetos especialista em metodologias ágeis.
    O usuário solicitou a criação do seguinte projeto: "${userPrompt}"
    
    Crie um quadro Kanban completo para essa solicitação. Defina um nome para o projeto, crie de 3 a 5 colunas lógicas (ex: Backlog, Fazendo, Revisão, Feito) e popule cada coluna com 2 a 5 tarefas relevantes, detalhando o título e uma breve descrição do que precisa ser feito.

    Responda EXCLUSIVAMENTE em formato JSON com esta estrutura exata:
    {
      "projectName": "Nome do Projeto",
      "columns": [
        {
          "name": "Nome da Coluna",
          "tasks": [
            { "title": "Título", "description": "Descrição detalhada" }
          ]
        }
      ]
    }
  `;

  const response = await aiClient.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "Arquiteto de software que retorna apenas JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.5,
  });

  const rawContent = response.choices[0].message.content;
  if (!rawContent) throw new Error("Falha ao gerar o projeto.");

  return JSON.parse(rawContent) as AIProjectGeneration;
}
