/**
 * Botão de ação primária — usado para CTAs como "Novo Lead".
 * @param {{children: React.ReactNode, onClick?: () => void, type?: string, disabled?: boolean}} props
 */
export function Button({ children, onClick, type = "button", disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium
                 hover:bg-indigo-700 transition-colors
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}