const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida os campos do formulário de Lead.
 * @param {{name: string, email: string, companyName: string}} valores
 * @returns {{name?: string, email?: string, companyName?: string}} objeto de erros (vazio se válido)
 */
export function validateLeadForm(valores) {
  const erros = {};

  if (!valores.name.trim()) {
    erros.name = "Nome é obrigatório.";
  }

  if (!valores.email.trim()) {
    erros.email = "E-mail é obrigatório.";
  } else if (!REGEX_EMAIL.test(valores.email.trim())) {
    erros.email = "E-mail em formato inválido.";
  }

  if (!valores.companyName.trim()) {
    erros.companyName = "Empresa é obrigatória.";
  }

  return erros;
}