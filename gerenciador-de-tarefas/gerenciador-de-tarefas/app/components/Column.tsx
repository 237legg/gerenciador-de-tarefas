import React from 'react';
// Se quiser usar o TaskCard que criamos antes, é só importar:
// import { TaskCard } from "./TaskCard";

type Task = {
  id: string;
  title: string;
  // tags?: any[] // (Pode adicionar as tags aqui depois se for usar o TaskCard)
};

// CORREÇÃO: Trocamos o "=" pelo ":"
type ColumnProps = {
  name: string;
  tasks?: Task[];
};

export function Column({ name, tasks = [] }: ColumnProps) {
  return (
    <div className="bg-gray-100 w-80 shrink-0 rounded-xl p-3 flex flex-col gap-3 max-h-full">
      
      {/* 1. Cabeçalho da Coluna (Nome e Contador) */}
      <div className="flex justify-between items-center px-1">
        <h3 className="font-semibold text-gray-700 text-sm">{name}</h3>
        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full font-medium">
          {tasks.length}
        </span>
      </div>

      {/* 2. Área das Tarefas (Com scroll interno se tiver muitos itens) */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        {tasks.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">Nenhuma tarefa.</p>
        ) : (
          tasks.map((task) => (
            // Se você importar o TaskCard, substitua esta div por: <TaskCard key={task.id} task={task} />
            <div 
              key={task.id} 
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-grab hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <p className="text-gray-800 text-sm font-medium">{task.title}</p>
            </div>
          ))
        )}
      </div>

      {/* 3. Botão de Adicionar Tarefa */}
      <button className="text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-200 px-2 py-1.5 rounded-md transition text-left flex items-center gap-2 mt-1">
        <span className="text-lg leading-none">+</span> Adicionar um cartão
      </button>
      
    </div>
  );
}