import { MOCK_ORGANIZATION_ID } from "../config/mockAuth";

/**
 * Lista fake de Leads, simulando o que o backend devolverá quando o CRUD
 * completo (PUT/DELETE) estiver implementado.
 *
 * REMOVER este arquivo e suas referências quando o backend estiver completo.
 */
export const MOCK_LEADS = [
  {
    id: "a1111111-0000-0000-0000-000000000001",
    name: "Ana Souza",
    email: "ana.souza@email.com",
    companyName: "Tech Solutions",
    status: "New",
    createdAt: "2026-06-18T10:00:00Z",
    organizationId: MOCK_ORGANIZATION_ID,
  },
  {
    id: "a1111111-0000-0000-0000-000000000002",
    name: "Bruno Lima",
    email: "bruno.lima@email.com",
    companyName: "Construtora Lima",
    status: "Contacted",
    createdAt: "2026-06-19T09:30:00Z",
    organizationId: MOCK_ORGANIZATION_ID,
  },
  {
    id: "a1111111-0000-0000-0000-000000000003",
    name: "Carla Mendes",
    email: "carla.mendes@email.com",
    companyName: "Mendes Advocacia",
    status: "Qualified",
    createdAt: "2026-06-20T14:15:00Z",
    organizationId: MOCK_ORGANIZATION_ID,
  },
];

/**
 * Simula a resposta paginada do backend (mesmo formato do DEC-001/DEC-003),
 * incluindo filtro por nome/email/empresa.
 * @param {number} page
 * @param {number} pageSize
 * @param {string} search
 */
export function getMockLeadsPage(page = 1, pageSize = 10, search = "") {
  const termo = search.trim().toLowerCase();

  const filtrados = termo
    ? MOCK_LEADS.filter(
        (lead) =>
          lead.name.toLowerCase().includes(termo) ||
          lead.email.toLowerCase().includes(termo) ||
          lead.companyName.toLowerCase().includes(termo)
      )
    : MOCK_LEADS;

  const totalCount = filtrados.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const inicio = (page - 1) * pageSize;
  const data = filtrados.slice(inicio, inicio + pageSize);

  return { data, page, pageSize, totalCount, totalPages };
}