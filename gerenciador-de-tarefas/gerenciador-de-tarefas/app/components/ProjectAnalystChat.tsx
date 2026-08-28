"use client";

import { useState, useRef, useEffect } from "react";
import { sendMessageToAnalyst } from "../actions/chat";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ProjectAnalystChat({ projectId }: { projectId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Olá! Sou o analista do seu projeto. Quer saber sobre gargalos ou tarefas atrasadas?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await sendMessageToAnalyst(
        projectId,
        userMessage.content,
        messages,
      );

      if (reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Ops, ocorreu um erro ao consultar o banco de dados.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 h-96 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl mb-4 flex flex-col overflow-hidden">
          {/* Cabeçalho */}
          <div className="bg-gray-800 p-3 border-b border-gray-700 flex justify-between items-center">
            <span className="font-bold text-white flex items-center gap-2">
              ✨ Analista IA
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-[85%] text-sm ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-200"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-400 p-3 rounded-lg text-sm animate-pulse">
                  Consultando o banco...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Texto */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte algo..."
              disabled={isLoading}
              className="flex-1 bg-gray-900 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-bold disabled:opacity-50 hover:bg-purple-500 transition-colors"
            >
              Enviar
            </button>
          </form>
        </div>
      )}

      {/* Botão Flutuante (Gatilho) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-105"
        >
          ✨ Perguntar à IA
        </button>
      )}
    </div>
  );
}
