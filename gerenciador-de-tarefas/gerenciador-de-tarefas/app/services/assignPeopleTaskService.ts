import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";


export async function assignPeopleTaskService(taskId: string, userId: string){
    if (!taskId || !userId) {
        throw new AppError("O ID da tarefa e o ID do usuário são obrigatórios para a remoção.");
    }
    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
            members:{
                connect: { id: userId }
        }
         }
    });
    return updatedTask;
}