import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";

export async function createProjectService(userId: string, name: string) {
  if (!name || name.trim() === "") {
    throw new AppError("O nome do projeto não pode estar vazio");
  }
  if (!userId) {
    throw new AppError("Não é possível criar um projeto sem um dono.");
  }
  const newProject = await prisma.project.create({
    data: {
      name: name.trim(),
      ownerId: userId,
    },
  });
  return newProject;
}
