import { AppError } from "./errors";

export function withErrorHandler<T, Args extends any[]>(
  action: (...args: Args) => Promise<T>
) {
  return async (...args: Args) => {
    try {
      const data = await action(...args);
      return { success: true, data };
    } catch (error) {
      // Se for um erro que nós criamos no Service:
      if (error instanceof AppError) {
        return { success: false, error: error.message };
      }
      // Se for erro do Prisma ou outro erro fatal:
      console.error("Erro interno:", error);
      return { success: false, error: "Ocorreu um erro interno no servidor." };
    }
  };
}
