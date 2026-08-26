import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";


export async function removeDeadlineTaskService(taskId: string){
    if (!taskId) {
        throw new AppError("O ID da tarefa é obrigatório.");
    }
    const updatedTask = await prisma.task.update({
        where: { id: taskId},
        data: {
            deadline: null
            }
        });
    return updatedTask;
}