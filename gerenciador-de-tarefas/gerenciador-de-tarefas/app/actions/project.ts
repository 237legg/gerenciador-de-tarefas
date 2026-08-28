"use server";

import prisma from "../lib/prisma";
import { generateFullProjectService } from "../services/aiServices";
import { withErrorHandler } from "../lib/actionHandler";
import { redirect } from "next/navigation";

export const createProjectFromPrompt = withErrorHandler(
  async (userId: string, userPrompt: string) => {
    const projectData = await generateFullProjectService(userPrompt);
    const newProject = await prisma.project.create({
      data: {
        name: projectData.projectName,
        ownerId: userId,
      },
    });

    for (let colIndex = 0; colIndex < projectData.columns.length; colIndex++) {
      const column = projectData.columns[colIndex];

      await prisma.column.create({
        data: {
          name: column.name,
          position: colIndex,
          projectId: newProject.id,
          tasks: {
            create: column.tasks.map((task, taskIndex) => ({
              title: task.title,
              description: task.description,
              position: taskIndex,
              projectId: newProject.id,
            })),
          },
        },
      });
    }
    redirect(`/project/${newProject.id}`);
  },
);
