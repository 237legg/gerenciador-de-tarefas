import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";

export async function getProjectById(projectId: string) {
  if (!projectId) {
    throw new AppError("O ID do projeto é obrigatório para carregar o quadro.");
  }

  const board = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      columns: {
        orderBy: { position: "asc" },
        include: {
          tasks: {
            orderBy: { position: "asc" },
            include: {
              tags: true,
              members: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!board) {
    throw new AppError("Projeto não encontrado.");
  }
}
