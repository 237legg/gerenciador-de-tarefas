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
import { assignPeopleTaskService } from "../services/assignPeopleTaskService";
import { removePeopleTaskService } from "../services/removePeopleTaskService";
import { assignDeadlineTaskService } from "../services/assignDeadlineTaskService";
import { removeDeadlineTaskService } from "../services/removeDeadlineTaskService";
import { reorderTaskService } from "../services/reorderTaskService";
import { updateTaskService } from "../services/updateTaskService";
import { deleteTaskService } from "../services/deleteTaskService";
import { updateColumnService } from "../services/updateColumnService";
import { deleteColumnService } from "../services/deleteColumnService";
import { reorderColumnService } from "../services/reorderColumnService";
import { getProjectByIdService } from "../services/getProjectByIdService";
import { deleteProjectService } from "../services/deleteProjectService";
import { updateProjectService } from "../services/updateProjectService";
import { getTagsByProjectService } from "../services/getTagsByProjectService";
import { deleteTagService } from "../services/deleteTagService";

// buscar todos os projetos de um usuário de acordo com a evolucao da pesquisa
export const getProjects = withErrorHandler(
  async (userId: string, search?: string) => {
    const projects = await getProjectsService(userId, search);
    return projects;
  },
);

// cria um projeto novo
export const createProject = withErrorHandler(
  async (userId: string, projectName: string) => {
    const newProject = await createProjectService(userId, projectName);
    revalidatePath(`/`);
    return newProject;
  },
);

// criar uma nova coluna
export const createColumn = withErrorHandler(
  async (projectId: string, name: string) => {
    const newColumn = await createColumnService(projectId, name);
    revalidatePath(`/project/${projectId}`);
    return newColumn;
  },
);

//cria uma nova task
export const createTask = withErrorHandler(
  async (columnId: string, projectId: string, name: string) => {
    const newTask = await createTaskService(columnId, projectId, name);
    revalidatePath(`/project/${projectId}`);
    return newTask;
  },
);

//adicionar tag a task
export const addTagTask = withErrorHandler(
  async (taskId: string, tagId: string, projectId: string) => {
    const taskUpdate = await addTagTaskService(taskId, tagId);
    revalidatePath(`/project/${projectId}`);
    return taskUpdate;
  },
);

//remover tag da task
export const removeTagTask = withErrorHandler(
  async (taskId: string, tagId: string, projectId: string) => {
    const tagRemoved = await removeTagTaskService(taskId, tagId);
    revalidatePath(`/project/${projectId}`);
    return tagRemoved;
  },
);

//criar tag
export const createTag = withErrorHandler(
  async (projectId: string, name: string, color: string) => {
    const newTag = await createTagService(projectId, name, color);
    revalidatePath(`/project/${projectId}`);
    return newTag;
  },
);

//adicionar pessoas a uma task
export const assignPeopleTask = withErrorHandler(
  async (taskId: string, userId: string, projectId: string) => {
    const taskUpdate = await assignPeopleTaskService(taskId, userId);
    revalidatePath(`/project/${projectId}`);
    return taskUpdate;
  },
);

//remover pessoas de uma task
export const removePeopleTask = withErrorHandler(
  async (taskId: string, userId: string, projectId: string) => {
    const taskUpdate = await removePeopleTaskService(taskId, userId);
    revalidatePath(`/project/${projectId}`);
    return taskUpdate;
  },
);

//adicionar deadline a uma task
export const assignDeadlineTask = withErrorHandler(
  async (taskId: string, deadline: Date, projectId: string) => {
    const taskUpdate = await assignDeadlineTaskService(taskId, deadline);
    revalidatePath(`/project/${projectId}`);
    return taskUpdate;
  },
);

//remover deadline de uma task
export const removeDeadlineTask = withErrorHandler(
  async (taskId: string, projectId: string) => {
    const taskUpdate = await removeDeadlineTaskService(taskId);
    revalidatePath(`/project/${projectId}`);
    return taskUpdate;
  },
);

// reordenar tasks para o drag n drop
type TaskUpdateInput = {
  id: string;
  columnId: string;
  position: number;
};

export const reorderTask = withErrorHandler(
  async (tasks: TaskUpdateInput[], projectId: string) => {
    const result = await reorderTaskService(tasks);
    revalidatePath(`/project/${projectId}`);

    return result;
  },
);
//atualizar task
export const updateTask = withErrorHandler(
  async (
    taskId: string,
    title: string,
    description: string,
    projectId: string,
  ) => {
    const updatedTask = await updateTaskService(taskId, title, description);
    revalidatePath(`/project/${projectId}`);
    return updatedTask;
  },
);
//deletar task
export const deleteTask = withErrorHandler(
  async (taskId: string, projectId: string) => {
    const deletedTask = await deleteTaskService(taskId);
    revalidatePath(`/project/${projectId}`);
    return deletedTask;
  },
);
//atualizar coluna
export const updateColumn = withErrorHandler(
  async (columnId: string, title: string, projectId: string) => {
    const updatedColumn = await updateColumnService(columnId, title);
    revalidatePath(`/project/${projectId}`);
    return updatedColumn;
  },
);
//deletar coluna
export const deleteColumn = withErrorHandler(
  async (columnId: string, projectId: string) => {
    const deletedColumn = await deleteColumnService(columnId);
    revalidatePath(`/project/${projectId}`);
    return deletedColumn;
  },
);
//reordenar colunas (drag n drop)
type ColumnUpdateInput = {
  id: string;
  position: number;
};

export const reorderColumn = withErrorHandler(
  async (columns: ColumnUpdateInput[], projectId: string) => {
    const result = await reorderColumnService(columns);
    revalidatePath(`/project/${projectId}`);

    return result;
  },
);
//buscar um prj especifico e trazer todas colunas tasks e tags para renderizar a tela do projeto
export const getProjectById = withErrorHandler(async (projectId: string) => {
  const board = await getProjectByIdService(projectId);
  revalidatePath(`/project/${projectId}`);
  return board;
});
//deletar projeto
export const deleteProject = withErrorHandler(async (projectId: string) => {
  const deleteProject = await deleteProjectService(projectId);
  revalidatePath(`/project/${projectId}`);
  return deleteProject;
});
//renomear projeto
export const updateProject = withErrorHandler(
  async (projectName: string, projectId: string) => {
    const updatedProject = await updateProjectService(projectId, projectName);
    revalidatePath(`/project/${projectId}`);
    return updatedProject;
  },
);
//tags do projeto
export const getTagsByProject = withErrorHandler(async (projectId: string) => {
  const projectTags = await getTagsByProjectService(projectId);
  revalidatePath(`/project/${projectId}`);
  return projectTags;
});
//deletar tag globalmente
export const deleteTag = withErrorHandler(
  async (tagId: string, projectId: string) => {
    const deletedTag = await deleteTagService(tagId);
    revalidatePath(`/project/${projectId}`);
    return deletedTag;
  },
);
