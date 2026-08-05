import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * Proteção CSRF leve (ADR-0008 §Cookies/CSRF): endpoints de escrita só aceitam
 * requisições cujo header `Origin` esteja na allowlist (mesma do CORS). Pedidos
 * sem `Origin` (curl, testes server-to-server) não são vetor CSRF de browser e
 * passam. Enquanto os cookies forem `SameSite=Lax`, isto é reforço; virar
 * `SameSite=None` exigiria CSRF token dedicado.
 */
@Injectable()
export class OriginGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string | undefined> }>();
    const origin = request.headers.origin;

    if (!origin) {
      return true;
    }

    const allowed = this.config
      .get<string>("CORS_ORIGIN", "http://localhost:3000")
      .split(",")
      .map((value) => value.trim());

    if (!allowed.includes(origin)) {
      throw new ForbiddenException({
        code: "ORIGIN_NOT_ALLOWED",
        message: "Origem não permitida.",
      });
    }

    return true;
  }
}
