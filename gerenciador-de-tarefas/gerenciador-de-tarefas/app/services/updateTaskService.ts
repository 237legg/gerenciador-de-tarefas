import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";
import { Prisma } from "../../prisma/generated/client";
type UpdateTaskInput = {
  title?: string;
  description?: string;
  checklist?: Prisma.InputJsonValue;
};
export async function updateTaskService(
  taskId: string,
  dataToUpdate: UpdateTaskInput,
) {
  if (!taskId) {
    throw new AppError("O ID da tarefa é obrigatório para a atualização.");
  }
  if (dataToUpdate.title !== undefined && dataToUpdate.title.trim() === "") {
    throw new AppError("A Tarefa Nao Pode ter um Titulo Vazio");
  }
  const updateTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: dataToUpdate.title ? dataToUpdate.title.trim() : undefined,
      description:
        dataToUpdate.description !== undefined
          ? dataToUpdate.description
          : undefined,
      checklist:
        dataToUpdate.checklist !== undefined
          ? dataToUpdate.checklist
          : undefined,
    },
  });
  return updateTask;
}
