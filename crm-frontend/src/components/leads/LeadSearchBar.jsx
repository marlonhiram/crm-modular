import { Search } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Barra de busca com debounce — evita disparar uma chamada à API
 * a cada tecla digitada, esperando 400ms de pausa na digitação.
 * @param {{onSearch: (termo: string) => void}} props
 */
export function LeadSearchBar({ onSearch }) {
  const [valorDigitado, setValorDigitado] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(valorDigitado);
    }, 400);

    // Limpa o timer anterior sempre que o usuário digitar de novo
    // antes dos 400ms — isso é o que efetivamente cria o "debounce".
    return () => clearTimeout(timer);
  }, [valorDigitado]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-full max-w-md">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={valorDigitado}
        onChange={(e) => setValorDigitado(e.target.value)}
        placeholder="Buscar por nome, e-mail ou empresa..."
        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200
                   text-sm text-gray-700 placeholder:text-gray-400
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}