import axios from "axios";
import toast from "react-hot-toast";

// Instância centralizada do Axios.
// Nenhum outro arquivo deve usar axios.get/post diretamente — sempre importar daqui.
const axiosInstance = axios.create({
  baseURL: "http://localhost:5151/api/", // ajuste para a porta real do seu backend .NET
  timeout: 10000,
});

/**
 * Interceptor de resposta: captura qualquer erro de qualquer chamada
 * feita por essa instância e exibe um feedback visual (toast) automaticamente.
 * Isso garante que NENHUMA chamada à API falhe silenciosamente.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const mensagem = getMensagemDeErro(error);
    toast.error(mensagem);
    // Repropaga o erro para quem chamou poder tratar casos específicos se precisar
    return Promise.reject(error);
  }
);

/**
 * Traduz o erro técnico do Axios em uma mensagem amigável ao usuário.
 * @param {import('axios').AxiosError} error
 * @returns {string}
 */
function getMensagemDeErro(error) {
  if (!error.response) {
    return "Não foi possível conectar ao servidor. Verifique sua conexão.";
  }

  const status = error.response.status;

  if (status === 404) return "Recurso não encontrado.";
  if (status === 400) return "Dados inválidos enviados.";
  if (status >= 500) return "Erro interno do servidor. Tente novamente.";

  return "Ocorreu um erro inesperado.";
}

export default axiosInstance;