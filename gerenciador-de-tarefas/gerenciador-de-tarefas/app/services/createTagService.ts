import prisma from "../lib/prisma";

export async function createTagService(
  projectId: string,
  name: string,
  color: string
) {
    const newTag = await prisma.tag.create({
      data: {
        name: name,
        projectId: projectId,
        color: color,
      },
    });
    return newTag;
}