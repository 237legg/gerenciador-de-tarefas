import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";

type CreateTaskInput = {
  projectId: string;
  columnId: string;
  name: string;
  description?: string;
  deadline?: Date | null;
};

export async function createTaskService({
  projectId,
  columnId,
  name,
  description = "",
  deadline = null,
}: CreateTaskInput) {
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
      title: name.trim(),
      description: description.trim(),
      projectId,
      columnId,
      position: nextPosition,
      deadline,
    },
  });
  return newTask;
}
