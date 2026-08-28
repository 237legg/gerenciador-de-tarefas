import prisma from "../lib/prisma";
export async function getProjectStatusTool(projectId: string) {
  const columns = await prisma.column.findMany({
    where: { projectId },
    include: { _count: { select: { tasks: true } } },
  });

  return columns.map((col) => ({
    coluna: col.name,
    totalTarefas: col._count.tasks,
  }));
}

export async function getOverdueTasksTool(projectId: string) {
  const now = new Date();
  const overdueTasks = await prisma.task.findMany({
    where: {
      column: { projectId },
      deadline: { lt: now },
    },
    select: { title: true, deadline: true },
  });

  return overdueTasks;
}
