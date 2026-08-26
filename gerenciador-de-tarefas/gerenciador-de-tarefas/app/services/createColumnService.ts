import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";

export async function createColumnService(projectId: string, name: string) {
  if (!name || name.trim() === "") {
    throw new AppError("O nome da lista não pode estar vazio.");
  }

  if (!projectId) {
    throw new AppError("É necessário um projeto válido para criar a lista.");
  }
  const lastColumn = await prisma.column.findFirst({
    where: { projectId: projectId },
    orderBy: { position: "desc" },
  });

  const nextPosition = lastColumn ? lastColumn.position + 1 : 0;
  const newColumn = await prisma.column.create({
    data: {
      name: name.trim(),
      projectId: projectId,
      position: nextPosition,
    },
  });

  return newColumn;
}
