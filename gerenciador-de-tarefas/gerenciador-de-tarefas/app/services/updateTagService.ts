import prisma from "../lib/prisma";
import { AppError } from "../lib/errors";

export async function updateTagService(tagId: string, tagName: string) {
  if (!tagId) {
    throw new AppError("O ID da tag é obrigatório para a atualização.");
  }
  if (!tagName || tagName.trim() === "") {
    throw new AppError("A Tag Nao Pode ter um Titulo Vazio");
  }
  const updateTag = await prisma.tag.update({
    where: { id: tagId },
    data: {
      name: tagName.trim(),
    },
  });
  return updateTag;
}
