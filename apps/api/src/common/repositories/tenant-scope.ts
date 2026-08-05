/**
 * Núcleo do isolamento por household (AGENTS §6/§11, ADR-0008). Toda query de
 * domínio deve construir seu `where` por aqui: o `householdId` derivado da
 * sessão é injetado por ÚLTIMO, sobrescrevendo qualquer `householdId` que tenha
 * vindo no filtro do client — assim é impossível forjar tenant via input.
 *
 * Lança se o `householdId` estiver ausente/vazio: sem tenant não há query. É um
 * erro de programação (guard/decorator faltando), não um input inválido.
 */
export function tenantWhere<W extends object>(
  householdId: string,
  where?: W,
): W & { householdId: string } {
  if (!householdId) {
    throw new Error("householdId ausente no escopo de tenancy");
  }

  return { ...(where ?? ({} as W)), householdId };
}
