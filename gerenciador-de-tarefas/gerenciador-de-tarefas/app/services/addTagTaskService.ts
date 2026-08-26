import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";

export async function addTagTaskService(taskId: string, tagId: string) {
  if (!taskId || !tagId) {
    throw new AppError("O ID da tarefa e da etiqueta são obrigatórios.");
  }
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      tags: {
        connect: { id: tagId },
      },
    },
  });
  return updatedTask;
}
