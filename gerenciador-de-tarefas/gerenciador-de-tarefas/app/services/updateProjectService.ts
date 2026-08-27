import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";

export async function updateProjectService(
  projectId: string,
  projectName: string
) {
  if (!projectId) {
    throw new AppError("O ID do projeto é obrigatório para a atualização.");
  }
  if (!projectName || projectName.trim() === "") {
    throw new AppError("A Tarefa Nao Pode ter um Titulo Vazio");
  }
  const updateProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      name: projectName.trim(),
    },
  });
  return updateProject;
}
