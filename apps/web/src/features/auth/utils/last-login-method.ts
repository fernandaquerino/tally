export type LoginMethod = "email" | "google" | "github";

const LAST_LOGIN_METHOD_COOKIE = "tally_last_login_method";

/** Lê apenas uma preferência de UX; este cookie nunca autentica a sessão. */
export function readLastLoginMethod(): LoginMethod | null {
  const value = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${LAST_LOGIN_METHOD_COOKIE}=`))
    ?.split("=")[1];

  return value === "email" || value === "google" || value === "github"
    ? value
    : null;
}
