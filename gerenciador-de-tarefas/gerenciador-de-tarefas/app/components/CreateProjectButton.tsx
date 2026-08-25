"use client";

import { useState, useTransition } from "react";
import { createProject } from "../actions/board";

export function CreateProjectButton() {
  // useState guarda o que o usuario digita
  const [name, setName] = useState("");

  //useTransition para o loading
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    if (name.trim() === "") return; //nao cria projeto sem nome

    startTransition(async () => {
      const UserId = "0268e445-a2fd-4702-952d-28e6b2472211";
      const result = await createProject(UserId, name);

      if (result.success) {
        setName("");
        alert("Projeto Criado Com Sucesso");
      } else {
        alert("Erro ao criar Projeto");
      }
    });
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Nome do novo projeto..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isPending}
        className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />

      <button
        onClick={handleCreate}
        disabled={isPending || name.trim() === ""}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
      >
        {isPending ? "Criando..." : "Criar Projeto"}
      </button>
    </div>
  );
}
