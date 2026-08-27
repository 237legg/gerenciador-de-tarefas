import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";

export async function deleteProjectService(projectId: string) {
  if (!projectId) {
    throw new AppError(
      "O ID da projeto é obrigatório para realizar a exclusão."
    );
  }

  const deletedProject = await prisma.project.delete({
    where: { id: projectId },
  });
  return deletedProject;
}
