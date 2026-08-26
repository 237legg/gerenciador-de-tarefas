import prisma from "../lib/prisma";

export async function removeTagTaskService(taskId: string, tagId: string) {
  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      tags: {
        disconnect: { id: tagId },
      },
    },
  });
  return updatedTask;
}
