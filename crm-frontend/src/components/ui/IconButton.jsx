/**
 * Botão de ícone usado nas linhas da tabela (Editar / Excluir).
 * @param {{icon: React.ReactNode, onClick: () => void, label: string, variant?: 'default' | 'danger'}} props
 */
export function IconButton({ icon, onClick, label, variant = "default" }) {
  const cores =
    variant === "danger"
      ? "text-red-600 hover:text-red-700 hover:bg-red-50"
      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`p-2 rounded-md transition-colors ${cores}
                  focus:outline-none focus:ring-2 focus:ring-indigo-500`}
    >
      {icon}
    </button>
  );
}