import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

const PAGE_SIZE_PADRAO = 10;

/**
 * Hook responsável por toda a lógica de listagem, busca, paginação
 * e operações de CRUD de Leads.
 *
 * Os componentes nunca devem chamar axiosInstance diretamente para Leads —
 * sempre devem passar por este hook (DEC-004), facilitando uma futura
 * migração para TanStack Query sem alterar nenhum componente.
 */
export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

 /**
   * PENDÊNCIA TÉCNICA (DEC-006): o backend ainda não implementa paginação
   * nem busca server-side — devolve o array completo de Leads. Por isso,
   * calculamos página/busca aqui no frontend como remendo temporário.
   * Reverter quando o backend implementar Skip/Take/Count reais.
   */
  const fetchLeads = useCallback(async (paginaAlvo = page, termoBusca = search) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/leads");
      const todosLeads = response.data;

      const termo = termoBusca.trim().toLowerCase();
      const filtrados = termo
        ? todosLeads.filter(
            (lead) =>
              lead.name.toLowerCase().includes(termo) ||
              lead.email.toLowerCase().includes(termo) ||
              lead.companyName.toLowerCase().includes(termo)
          )
        : todosLeads;

      const totalCountCalculado = filtrados.length;
      const totalPagesCalculado = Math.ceil(totalCountCalculado / PAGE_SIZE_PADRAO) || 1;
      const inicio = (paginaAlvo - 1) * PAGE_SIZE_PADRAO;
      const paginaDeLeads = filtrados.slice(inicio, inicio + PAGE_SIZE_PADRAO);

      setLeads(paginaDeLeads);
      setTotalPages(totalPagesCalculado);
      setTotalCount(totalCountCalculado);
      setPage(paginaAlvo);
    } catch (error) {
      // O toast de erro já é exibido pelo interceptor global (DEC-002).
      // Aqui só precisamos garantir que a UI não fique com dado inconsistente.
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);
  // Dispara a busca inicial e sempre que a página mudar.
  useEffect(() => {
    fetchLeads(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  /**
   * Atualiza o termo de busca e volta para a página 1
   * (busca nova sempre reinicia a paginação).
   * @param {string} novoTermo
   */
  function handleSearch(novoTermo) {
    setSearch(novoTermo);
    fetchLeads(1, novoTermo);
  }

  function goToNextPage() {
    if (page < totalPages) setPage((p) => p + 1);
  }

  function goToPreviousPage() {
    if (page > 1) setPage((p) => p - 1);
  }

  /**
   * Cria um novo Lead e recarrega a página atual.
   * @param {{name: string, email: string, companyName: string, status: string}} novoLead
   */
  async function createLead(novoLead) {
    await axiosInstance.post("/leads", novoLead);
    await fetchLeads(page, search);
  }

  /**
   * Atualiza um Lead existente e recarrega a página atual.
   * NOTA: rota PUT ainda não existe no backend (DEC-005) — vai retornar 404
   * até ser implementada.
   * @param {string} id
   * @param {{name: string, email: string, companyName: string, status: string}} dadosAtualizados
   */
  async function updateLead(id, dadosAtualizados) {
    await axiosInstance.put(`/leads/${id}`, dadosAtualizados);
    await fetchLeads(page, search);
  }

  /**
   * Exclui um Lead e recarrega a página atual.
   * NOTA: rota DELETE ainda não existe no backend (DEC-005) — vai retornar
   * 404 até ser implementada.
   * @param {string} id
   */
  async function deleteLead(id) {
    await axiosInstance.delete(`/leads/${id}`);
    await fetchLeads(page, search);
  }

  return {
    leads,
    page,
    totalPages,
    totalCount,
    search,
    isLoading,
    handleSearch,
    goToNextPage,
    goToPreviousPage,
    createLead,
    updateLead,
    deleteLead,
  };
}