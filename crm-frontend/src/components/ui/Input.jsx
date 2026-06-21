/**
 * Input de texto padrão do projeto, com label e mensagem de erro opcional.
 * @param {{label: string, value: string, onChange: (v: string) => void, type?: string, error?: string, placeholder?: string}} props
 */
export function Input({ label, value, onChange, type = "text", error, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`px-3 py-2 rounded-md border text-sm text-gray-700
                    focus:outline-none focus:ring-2 focus:ring-indigo-500
                    ${error ? "border-red-400" : "border-gray-200"}`}
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}