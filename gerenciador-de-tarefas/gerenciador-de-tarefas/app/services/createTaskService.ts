import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";

export async function createTaskService(
  columnId: string,
  projectId: string,
  name: string
) {
  if (!name || name.trim() === "") {
    throw new AppError("O título da tarefa é obrigatório.");
  }

  if (!columnId || !projectId) {
    throw new AppError("Referência de projeto ou coluna inválida.");
  }
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
  return newTask;
}
