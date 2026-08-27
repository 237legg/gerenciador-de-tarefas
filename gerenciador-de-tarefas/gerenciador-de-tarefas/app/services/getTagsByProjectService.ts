import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";

export async function getTagsByProjectService(projectId: string) {
  if (!projectId) {
    throw new AppError(
      "O ID do projeto é obrigatório para buscar as etiquetas."
    );
  }

  const tags = await prisma.tag.findMany({
    where: { projectId: projectId },
    orderBy: { name: "asc" }, 
  });

  return tags;
}