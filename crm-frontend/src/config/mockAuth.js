/**
 * MOCK TEMPORÁRIO — substituir quando a autenticação real (JWT) for implementada.
 *
 * Hoje não existe login no sistema. Este organizationId simula o valor que,
 * no futuro, será extraído do token JWT decodificado da sessão autenticada.
 *
 * IMPORTANTE: nenhum componente deve declarar esse valor "na mão" — sempre
 * importar daqui, para que a troca futura pelo valor real do JWT seja feita
 * em um único lugar.
 */
export const MOCK_ORGANIZATION_ID = "11111111-1111-1111-1111-111111111111";