import { CreateProjectButton } from "./components/CreateProjectButton";
import { getProjects } from "./actions/board"; // Aquela função de buscar que fizemos antes

export default async function Home() {
  // Mesmo ID fake que você usou no botão
  const fakeUserId = "id-do-usuario-aqui";
  const projects = await getProjects(fakeUserId);

  return (
    <main className="p-10 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Meus Quadros</h1>
        <CreateProjectButton />
      </div>

      {/* Lista de Projetos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-gray-700">
              {project.name}
            </h2>
          </div>
        ))}

        {projects.length === 0 && (
          <p className="text-gray-500 col-span-full">
            Nenhum projeto encontrado. Crie um acima!
          </p>
        )}
      </div>
    </main>
  );
}
