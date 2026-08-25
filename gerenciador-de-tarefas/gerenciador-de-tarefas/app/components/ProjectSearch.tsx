"use client";

import { useEffect, useState, useTransition } from "react";
import { getProjects } from "../actions/board";

interface ProjectSearchProps {
  userId: string;
}

export function ProjectSearch({ userId }: ProjectSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  //useEffect reload e sempre que o 'searchTerm' muda
  useEffect(() => {
    startTransition(async () => {
      const results = await getProjects(userId, searchTerm);
      setProjects(results);
    });
  }, [searchTerm, userId]); //quem ativa esse efeito

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 space-y-6">
      {/* Lupa */}
      <div className="relative">
        <span className="absolute left-3 top-3 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Buscar projetos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {isPending && (
          <span className="absolute right-3 top-3 text-xs text-blue-500">
            Buscando...
          </span>
        )}
      </div>

      {/* Lista de Projetos Filtrados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {projects.length === 0 && !isPending ? (
          <p className="text-gray-500">Nenhum projeto encontrado.</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="p-4 bg-white rounded-lg shadow border"
            >
              <h3 className="font-bold text-gray-700">{project.name}</h3>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
