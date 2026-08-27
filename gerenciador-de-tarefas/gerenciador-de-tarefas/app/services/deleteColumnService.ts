import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";

export async function deleteColumnService(columnId: string) {
  if (!columnId) {
    throw new AppError(
      "O ID da coluna é obrigatório para realizar a exclusão."
    );
  }

  const deletedColumn = await prisma.column.delete({
    where: { id: columnId },
  });
  return deletedColumn;
}
