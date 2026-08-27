import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";

export async function updateTaskService(
  taskId: string,
  taskName: string,
  description: string
) {
  if (!taskId) {
    throw new AppError("O ID da tarefa é obrigatório para a atualização.");
  }
  if (!taskName || taskName.trim() === "") {
    throw new AppError("A Tarefa Nao Pode ter um Titulo Vazio");
  }
  const updateTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: taskName.trim(),
      description: description,
    },
  });
  return updateTask;
}
