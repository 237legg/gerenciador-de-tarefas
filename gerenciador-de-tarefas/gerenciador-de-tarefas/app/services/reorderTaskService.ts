import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";

type TaskUpdateInput = {
  id: string;
  columnId: string;
  position: number;
};

export async function reorderTaskService(tasks: TaskUpdateInput[]) {
  if (!tasks || tasks.length === 0) {
    throw new AppError("Nenhuma tarefa foi enviada para atualizaçao");
  }
  //preparar atualizacoes
  const updateQueries = tasks.map((task) => {
    return prisma.task.update({
      where: {id: task.id},
      data: {
        columnId: task.columnId,
        position: task.position,
      },
    });
  });
  const updatedTasks = await prisma.$transaction(updateQueries);
  return updatedTasks;
}
