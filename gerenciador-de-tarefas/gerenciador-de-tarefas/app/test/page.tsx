import { ProjectSearch } from "../components/ProjectSearch";
import { CreateProjectButton } from "../components/CreateProjectButton";
import { Column } from "../components/Column";
import { CreateColumnButton } from "../components/CreateColumnButton";

export default function TestPage() {
  // IDs fakes apenas para o teste visual não quebrar
  const fakeUserId = "usuario-teste-123";
  const fakeProjectId = "projeto-teste-456";

  // Dados fakes para testarmos o visual dos cartões e colunas
  const mockTasks = [
    {
      id: "task-1",
      title: "Estudar Server Actions",
      tags: [{ id: "tag-1", name: "Estudo", color: "bg-blue-500" }],
    },
    {
      id: "task-2",
      title: "Criar banco de dados no Prisma",
      tags: [{ id: "tag-2", name: "Backend", color: "bg-green-500" }],
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* 1. ÁREA DO DASHBOARD (Gerenciamento de Projetos) */}
      <section className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Meus Projetos</h1>
            <CreateProjectButton />
          </div>
          
          {/* Lupa de pesquisa que criamos */}
          <ProjectSearch userId={fakeUserId} />
        </div>
      </section>

      {/* 2. ÁREA DO KANBAN (Gerenciamento de Tarefas do Projeto) */}
      <section className="flex-1 p-6 bg-blue-600 overflow-x-auto">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">Quadro de Teste (Visão do Projeto)</h2>
          
          {/* Container horizontal para as colunas rolarem para o lado */}
          <div className="flex items-start gap-4">
            
            {/* Coluna 1: Com tarefas */}
            <Column name="A Fazer" tasks={mockTasks} />
            
            {/* Coluna 2: Vazia para ver como fica */}
            <Column name="Em Andamento" tasks={[]} />
            
            {/* Botão de adicionar nova coluna no final */}
            <CreateColumnButton projectId={fakeProjectId} />
            
          </div>
        </div>
      </section>

    </main>
  );
}