"use server"; // Isso diz ao Next.js que este código só roda no servidor (seguro)

import prisma from "../lib/prisma"; // Ajuste o caminho se necessário
import { revalidatePath } from "next/cache";

// buscar todos os projetos de um usuário de acordo com a evolucao da pesquisa
export async function getProjects(userId: string, search?: string) {
  const projectsList = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      projects: {
        where: {
          name: {
            contains: search || "",
            mode: "insensitive",
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return projectsList?.projects || []; // retorna um array de Projetos
}

// cria um projeto novo
export async function createProject(userId: string, projectName: string) {
  try {
    //utilizei try/catch para evitar que erro de conexao com db quebre a aplicacao
    const newProject = await prisma.project.create({
      data: {
        name: projectName,
        ownerId: userId,
      },
    });
    revalidatePath("/");
    return { success: true, data: newProject };
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    return { success: false, error: "Falha ao criar o projeto" };
  }
}

// criar uma nova Coluna
export async function createColumn(projectId: string, name: string) {
  try {
    const lastColumn = await prisma.column.findFirst({
      where: { projectId: projectId },
      orderBy: { position: "desc" },
    });
    const nextPosition = lastColumn ? lastColumn.position + 1 : 0;

    const newColumn = await prisma.column.create({
      data: {
        name: name,
        position: nextPosition,
        projectId: projectId,
      },
    });

    revalidatePath("/project/${projectId}");
    return { success: true, data: newColumn };
  } catch (error) {
    console.error("Erro ao criar coluna:", error);
    return { success: false, error: "Falha ao criar a coluna." };
  }
}

//cria uma nova task
export async function createTask(
  columnId: string,
  projectId: string,
  name: string
) {
  try {
    const lastTask = await prisma.task.findFirst({
      where: { projectId: projectId },
      orderBy: { position: "desc" },
    });
    const nextPosition = lastTask ? lastTask.position + 1 : 0;

    const newTask = await prisma.task.create({
      data: {
        title: name,
        projectId: projectId,
        columnId: columnId,
        position: nextPosition,
      },
    });
    revalidatePath("/project/${projectId}");
    return { success: true, data: newTask };
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return { success: false, error: "Falha ao criar a tarefa." };
  }
}


