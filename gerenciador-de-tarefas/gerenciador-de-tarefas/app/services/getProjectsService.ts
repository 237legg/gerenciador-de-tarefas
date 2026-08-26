import prisma from "../lib/prisma";

export async function getProjectsService(userId: string, search?: string) {
  const projectsList = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      projects: {
        where: {
          name: {
            contains: search || "",
            mode: "insensitive",
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return projectsList?.projects || [];
}
