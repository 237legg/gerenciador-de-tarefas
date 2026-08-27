import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";

export async function updateColumnService(
  columnId: string,
  columnName: string
) {
  if (!columnId) {
    throw new AppError("ID da coluna nao encontrado");
  }
  if (!columnName || columnName.trim() === "") {
    throw new AppError("Nao é possível criar uma coluna sem Nome!");
  }
  const updatedColumn = await prisma.column.update({
    where: { id: columnId },
    data: { name: columnName },
  });
  return updatedColumn;
}
