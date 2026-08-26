import React from "react";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  tags: Tag[];
}

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-grab hover:border-blue-400 hover:shadow-md transition-all group flex flex-col gap-2">
      {/* TAGS */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1">
          {task.tags.map((tag) => (
            <span
              key={tag.id}
              className={`${tag.color} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <p className="text-gray-800 text-sm font-medium">{task.title}</p>

      {/* footer do cartao */}
      <div className="flex justify-between items-center mt-1">
        {/* icone editar (group-hover) */}
        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-700 text-xs">
          ✎ Editar
        </button>
      </div>
    </div>
  );
}
