import { useState } from "react";
import { Plus } from "lucide-react";
import { useLeads } from "../hooks/useLeads";
import { LeadsTable } from "../components/leads/LeadsTable";
import { LeadSearchBar } from "../components/leads/LeadSearchBar";
import { LeadFormModal } from "../components/leads/LeadFormModal";
import { Button } from "../components/ui/Button";


export function LeadsPage() {
  const {
    leads,
    page,
    totalPages,
    totalCount,
    isLoading,
    handleSearch,
    goToNextPage,
    goToPreviousPage,
    createLead,
    updateLead,
    deleteLead,
  } = useLeads();

  // Controla o modal: null = fechado; {} (objeto vazio de "marcador") não é
  // usado aqui — usamos `undefined` para "criar novo" e o lead em si para "editar".
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadEmEdicao, setLeadEmEdicao] = useState(null);

  function abrirModalCriacao() {
    setLeadEmEdicao(null);
    setIsModalOpen(true);
  }

  function abrirModalEdicao(lead) {
    setLeadEmEdicao(lead);
    setIsModalOpen(true);
  }

  function fecharModal() {
    setIsModalOpen(false);
    setLeadEmEdicao(null);
  }

  /**
   * Decide se deve criar ou atualizar, dependendo de existir um
   * lead em edição. Isso é o que conecta o modal genérico (Passo 9)
   * com as duas operações reais do hook (createLead / updateLead).
   * @param {object} dadosFormulario
   */
  async function handleSubmitFormulario(dadosFormulario) {
    if (leadEmEdicao) {
      await updateLead(leadEmEdicao.id, dadosFormulario);
    } else {
      await createLead(dadosFormulario);
    }
  }

  /**
   * Confirmação simples antes de excluir — evita exclusão acidental
   * por clique errado no ícone de lixeira.
   * @param {object} lead
   */
  function handleDelete(lead) {
    const confirmou = window.confirm(`Excluir o lead "${lead.name}"?`);
    if (confirmou) deleteLead(lead.id);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Meus Leads</h1>
          <Button onClick={abrirModalCriacao}>
            <span className="flex items-center gap-1.5">
              <Plus size={16} />
              Novo Lead
            </span>
          </Button>
        </div>

        <div className="mb-4">
          <LeadSearchBar onSearch={handleSearch} />
        </div>

        <LeadsTable
          leads={leads}
          isLoading={isLoading}
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          onNextPage={goToNextPage}
          onPreviousPage={goToPreviousPage}
          onEdit={abrirModalEdicao}
          onDelete={handleDelete}
        />
      </div>

      <LeadFormModal
        isOpen={isModalOpen}
        initialData={leadEmEdicao}
        onClose={fecharModal}
        onSubmit={handleSubmitFormulario}
      />
    </div>
  );
}