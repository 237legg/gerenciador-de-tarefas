"use server";

import { createProjectService } from "../services/createProjectService";
import { withErrorHandler } from "../lib/actionHandler";
import { revalidatePath } from "next/cache";
import { createColumnService } from "../services/createColumnService";
import { getProjectsService } from "../services/getProjectsService";
import { createTaskService } from "../services/createTaskService";
import { addTagTaskService } from "../services/addTagTaskService";
import { removeTagTaskService } from "../services/removeTagTaskService";
import { createTagService } from "../services/createTagService";

// buscar todos os projetos de um usuário de acordo com a evolucao da pesquisa
export const getProjects = withErrorHandler(
  async (userId: string, search?: string) => {
    const projects = await getProjectsService(userId, search);
    return projects;
  }
);

// cria um projeto novo
export const createProject = withErrorHandler(
  async (userId: string, projectName: string) => {
    const newProject = await createProjectService(userId, projectName);
    revalidatePath(`/`);
    return newProject;
  }
);

// criar uma nova coluna
export const createColumn = withErrorHandler(
  async (projectId: string, name: string) => {
    const newColumn = await createColumnService(projectId, name);
    revalidatePath(`/project/${projectId}`);
    return newColumn;
  }
);

//cria uma nova task
export const createTask = withErrorHandler(
  async (columnId: string, projectId: string, name: string) => {
    const newTask = await createTaskService(columnId, projectId, name);
    revalidatePath(`/project/${projectId}`);
    return newTask;
  }
);

//adicionar tag a task
export const addTagTask = withErrorHandler(
  async (taskId: string, tagId: string, projectId: string) => {
    const taskUpdate = await addTagTaskService(taskId, tagId);
    revalidatePath(`/project/${projectId}`);
    return taskUpdate;
  }
);

//remover tag da task
export const removeTagTask = withErrorHandler(
  async (taskId: string, tagId: string, projectId: string) => {
    const tagRemoved = await removeTagTaskService(taskId, tagId);
    revalidatePath(`/project/${projectId}`);
    return tagRemoved;
  }
);

//criar tag
export const createTag = withErrorHandler(
  async (projectId: string, name: string, color: string) => {
    const newTag = await createTagService(projectId, name, color);
    revalidatePath(`/project/${projectId}`);
    return createTagService;
  }
);
