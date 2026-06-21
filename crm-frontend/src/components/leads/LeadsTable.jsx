import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "../ui/Badge";
import { IconButton } from "../ui/IconButton";
import { Button } from "../ui/Button";

/**
 * Tabela de listagem de Leads com paginação Próximo/Anterior.
 * @param {{
 *   leads: Array<object>,
 *   isLoading: boolean,
 *   page: number,
 *   totalPages: number,
 *   totalCount: number,
 *   onNextPage: () => void,
 *   onPreviousPage: () => void,
 *   onEdit: (lead: object) => void,
 *   onDelete: (lead: object) => void
 * }} props
 */
export function LeadsTable({
  leads,
  isLoading,
  page,
  totalPages,
  totalCount,
  onNextPage,
  onPreviousPage,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="px-4 py-3 font-medium">Nome</th>
            <th className="px-4 py-3 font-medium">E-mail</th>
            <th className="px-4 py-3 font-medium">Empresa</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                Carregando...
              </td>
            </tr>
          )}

          {!isLoading && leads.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                Nenhum lead encontrado.
              </td>
            </tr>
          )}

          {!isLoading &&
            leads.map((lead) => (
              <tr key={lead.id} className="border-b border-gray-100 text-gray-700">
                <td className="px-4 py-3 font-medium">{lead.name}</td>
                <td className="px-4 py-3 text-gray-500">{lead.email}</td>
                <td className="px-4 py-3">{lead.companyName}</td>
                <td className="px-4 py-3">
                  <Badge status={lead.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <IconButton
                      icon={<Pencil size={16} />}
                      label="Editar lead"
                      onClick={() => onEdit(lead)}
                    />
                    <IconButton
                      icon={<Trash2 size={16} />}
                      label="Excluir lead"
                      variant="danger"
                      onClick={() => onDelete(lead)}
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        <span className="text-sm text-gray-500">
          Página {page} de {totalPages} · {totalCount} leads no total
        </span>
        <div className="flex gap-2">
          <Button onClick={onPreviousPage} disabled={page <= 1}>
            Anterior
          </Button>
          <Button onClick={onNextPage} disabled={page >= totalPages}>
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}