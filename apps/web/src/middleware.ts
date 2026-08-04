import { NextResponse, type NextRequest } from "next/server";

/**
 * Proteção de rota no edge (ADR-0008 §Sessão web). Checa o cookie-dica de sessão
 * (não o token, que é httpOnly). É reforço — o guard real de dados é a API.
 * Prefixos protegidos crescem conforme as telas da área `(app)` forem criadas.
 */
const SESSION_HINT_COOKIE = "tally_session";
const PROTECTED_PREFIXES = ["/dashboard"];

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !request.cookies.has(SESSION_HINT_COOKIE)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
