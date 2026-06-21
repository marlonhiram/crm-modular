/**
 * Mapa de cores por status. Centralizado aqui para não duplicar
 * lógica de cor em cada lugar que exibir o status de um Lead.
 */
const CORES_POR_STATUS = {
  New: "bg-blue-50 text-blue-700",
  Contacted: "bg-amber-50 text-amber-700",
  Qualified: "bg-green-50 text-green-700",
  Lost: "bg-gray-100 text-gray-600",
};

/**
 * Exibe o status de um Lead como uma etiqueta colorida.
 * @param {{status: string}} props
 */
export function Badge({ status }) {
  const cores = CORES_POR_STATUS[status] ?? "bg-gray-100 text-gray-600";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cores}`}>
      {status}
    </span>
  );
}