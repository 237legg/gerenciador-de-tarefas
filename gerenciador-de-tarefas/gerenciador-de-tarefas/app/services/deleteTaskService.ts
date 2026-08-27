import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";

export async function deleteTaskService(taskId: string) {
  if (!taskId) {
    throw new AppError(
      "O ID da tarefa é obrigatório para realizar a exclusão."
    );
  }

  const deletedTask = await prisma.task.delete({
    where: { id: taskId },
  });
  return deletedTask;
}
