import { PrismaService } from "../../prisma/prisma.service.js";
import { tenantWhere } from "./tenant-scope.js";

/**
 * Base para repositórios de domínio isolados por household (AGENTS §6/§11).
 * Domínios (transactions, accounts, goals…) estendem esta classe e **nunca**
 * montam um `where` sem passar por `scope`, garantindo que toda leitura/escrita
 * carregue o `householdId` da sessão (ADR-0008 / anti-IDOR).
 *
 * O `householdId` sempre vem do servidor (token → guard). Repositórios que
 * estendem esta base recebem o `householdId` como parâmetro explícito em cada
 * método, no formato `findX({ householdId, ... })`.
 */
export abstract class TenantScopedRepository {
  protected constructor(protected readonly prisma: PrismaService) {}

  /**
   * Retorna um `where` com o `householdId` forçado. Client não consegue
   * sobrescrever o tenant: o id da sessão é aplicado por último.
   */
  protected scope<W extends object>(
    householdId: string,
    where?: W,
  ): W & { householdId: string } {
    return tenantWhere(householdId, where);
  }
}
