"use client";

import { useState, useTransition } from "react";
import { createColumn } from "../actions/board";
interface CreateColumnButtonProps {
  projectId: string;
}
export function CreateColumnButton({ projectId }: CreateColumnButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [isPending, startTransition] = useTransition();
  const handleCreateColumn = () => {
    if (columnName.trim() === "") return;

    startTransition(async () => {
      const result = await createColumn(projectId, columnName);
      if (result.success) {
        setColumnName("");
        setIsOpen(false);
      } else {
        alert("Erro ao criar coluna: " + result.error);
      }
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-white/20 hover:bg-white/30 text-white w-80 shrink-0 rounded-xl p-4 text-left font-semibold transition"
      >
        + Adicionar outra coluna
      </button>
    );
  }
  return (
    <div className="bg-gray-100 w-80 shrink-0 rounded-xl p-3 flex flex-col gap-3 h-fit">
      <input
        type="text"
        placeholder="Insira o título da coluna..."
        value={columnName}
        onChange={(e) => setColumnName(e.target.value)}
        disabled={isPending}
        autoFocus 
        className="w-full px-3 py-2 rounded-md border-2 border-transparent focus:border-blue-500 outline-none text-gray-800"
      />

      <div className="flex items-center gap-2">
        <button
          onClick={handleCreateColumn}
          disabled={isPending || columnName.trim() === ""}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition disabled:opacity-50"
        >
          {isPending ? "Adicionando..." : "Adicionar lista"}
        </button>

        {/* Botão para cancelar e fechar */}
        <button
          onClick={() => {
            setIsOpen(false);
            setColumnName("");
          }}
          disabled={isPending}
          className="text-gray-500 hover:text-gray-800 px-2 text-lg font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
