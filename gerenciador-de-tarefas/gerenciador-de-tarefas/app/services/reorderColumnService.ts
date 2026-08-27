import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";

type ColumnUpdateInput = {
  id: string;
  position: number;
};

export async function reorderColumnService(columns: ColumnUpdateInput[]) {
  if (!columns || columns.length === 0) {
    throw new AppError("Nenhuma coluna foi enviada para atualizaçao");
  }
  //preparar atualizacoes
  const updateQueries = columns.map((column) => {
    return prisma.column.update({
      where: { id: column.id },
      data: {
        position: column.position,
      },
    });
  });
  const updatedColumns = await prisma.$transaction(updateQueries);
  return updatedColumns;
}
