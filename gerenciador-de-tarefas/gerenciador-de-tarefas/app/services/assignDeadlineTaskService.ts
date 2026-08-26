import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";


export async function assignDeadlineTaskService(taskId: string, deadline: Date){
    if (!taskId) {
        throw new AppError("O ID da tarefa é obrigatório.");
    }
    
    if (!deadline) {
        throw new AppError("A data de entrega é obrigatória.");
    }
    const updatedTask = await prisma.task.update({
        where: { id: taskId},
        data: {
            deadline: deadline
            }
        });
    return updatedTask;
}