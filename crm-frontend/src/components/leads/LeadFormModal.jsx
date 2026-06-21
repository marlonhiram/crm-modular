import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { validateLeadForm } from "../../utils/leadValidation";

const STATUS_OPCOES = ["New", "Contacted", "Qualified", "Lost"];

const VALORES_VAZIOS = { name: "", email: "", companyName: "", status: "New" };

/**
 * Modal de criação/edição de Lead. O mesmo componente serve para os dois
 * casos: se `initialData` for null, está em modo criação; se vier preenchido,
 * está em modo edição.
 * @param {{
 *   isOpen: boolean,
 *   initialData: object | null,
 *   onClose: () => void,
 *   onSubmit: (dados: object) => Promise<void>
 * }} props
 */
export function LeadFormModal({ isOpen, initialData, onClose, onSubmit }) {
  const [valores, setValores] = useState(VALORES_VAZIOS);
  const [erros, setErros] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modoEdicao = Boolean(initialData);

  // Sempre que o modal abrir, popula o formulário (com os dados do lead
  // em edição, ou vazio em criação) e limpa erros de uma submissão anterior.
  useEffect(() => {
    if (isOpen) {
      setValores(initialData ?? VALORES_VAZIOS);
      setErros({});
    }
  }, [isOpen, initialData]);

  // Permite fechar o modal pressionando Esc — acessibilidade básica.
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleChange(campo, valor) {
    setValores((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errosValidacao = validateLeadForm(valores);
    setErros(errosValidacao);

    if (Object.keys(errosValidacao).length > 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(valores);
      onClose();
    } catch (error) {
      // O toast de erro já é exibido pelo interceptor global (DEC-002).
      // Mantemos o modal aberto para o usuário poder tentar novamente.
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {modoEdicao ? "Editar Lead" : "Novo Lead"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-1"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nome"
            value={valores.name}
            onChange={(v) => handleChange("name", v)}
            error={erros.name}
            placeholder="Ex: Ana Souza"
          />
          <Input
            label="E-mail"
            type="email"
            value={valores.email}
            onChange={(v) => handleChange("email", v)}
            error={erros.email}
            placeholder="ana@empresa.com"
          />
          <Input
            label="Empresa"
            value={valores.companyName}
            onChange={(v) => handleChange("companyName", v)}
            error={erros.companyName}
            placeholder="Ex: Tech Solutions"
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={valores.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {STATUS_OPCOES.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}