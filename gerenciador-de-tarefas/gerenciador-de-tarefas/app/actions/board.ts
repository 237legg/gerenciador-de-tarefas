"use server"; // Isso diz ao Next.js que este código só roda no servidor (seguro)

import prisma from "../lib/prisma"; // Ajuste o caminho se necessário
import { revalidatePath } from "next/cache";

// buscar todos os projetos de um usuário
export async function getProjects(userId: string) {
  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    include: {
      columns: true, 
    },
  });

  return projects; // retorna um array de Projetos
}

// cria um projeto novo
export async function createProject(userId: string, projectName: string){
  try{ //utilizei try/catch para evitar que erro de conexao com db quebre a aplicacao
  const newProject = await prisma.project.create({
    data: {
      name: projectName,
      ownerId : userId,
    },
  });
  revalidatePath('/')
  return{ success: true, data: newProject}
}catch(error){
  console.error("Erro ao criar projeto:", error)
  return{ success: false, error: "Falha ao criar o projeto"}
}
}

// Exemplo 2: Criar uma nova Coluna
export async function createColumn(
  projectId: string,
  name: string,
  position: number
) {
  const newColumn = await prisma.column.create({
    data: {
      name: name,
      position: position,
      projectId: projectId,
    },
  });

  // Atualiza a tela automaticamente para mostrar a nova coluna
  revalidatePath(`/project/${projectId}`);

  return newColumn;
}
