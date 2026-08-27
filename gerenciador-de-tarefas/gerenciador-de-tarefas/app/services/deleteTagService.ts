import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";

export async function deleteTagService(tagId: string) {
  if (!tagId) {
    throw new AppError(
      "O ID da tarefa é obrigatório para realizar a exclusão."
    );
  }

  const deletedTag = await prisma.tag.delete({
    where: { id: tagId },
  });
  return deletedTag;
}
