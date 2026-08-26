"use client"

import { useState, useTransition } from "react";
import { removeTagTask, createTag, addTagTask } from "../actions/board";

interface Tag {
    id: string;
    name: string;
    color: string;
}

interface Task{
    id: string;
    name: string;
    tags: Tag[];
}

interface TaskMenuProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
}

interface   TaskCardProps{
    task: Task;
    projectId: string;
}

export function TaskMenu({ task, isOpen, onClose, projectId }: TaskMenuProps) {
    const [title, setTitle] = useState(task.name);
    const [isPending, startTransition] = useTransition();

    const handleRemoveTag = (tagId: string) => {
        startTransition(async () => {
            const result = await removeTagTask(task.id, tagId, projectId);
            if(!result.success){
                alert("Erro ao remover etiqueta: " + result.error);
            }
        });
    };

    const handleAddTag = (tagId: string) => {
        startTransition(async () => {
            const result = await addTagTask(task.id, tagId, projectId);
            if(!result.success){
                alert("Erro ao adicionar etiqueta: " + result.error);
            }
        });
    };

    const handleCreateTag = (name: string, color: string) => {
        startTransition(async () => {
            const result = await createTag(projectId, name, color);
            if(!result.success){
                alert("Erro ao criar etiqueta: " + result.error);
            }
        });
    };

    if(!isOpen) return null;

    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/*container modal*/}
            <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl flex flex-col relative overflow-hidden">
                {/*botao fechar*/}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold text-xl">
                    X
                </button>
                {/*conteudo modal*/}


            </div>
        </div>
    )
}