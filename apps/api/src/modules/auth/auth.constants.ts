/** Nomes de cookie centralizados (ADR-0008 §Cookies). */
export const ACCESS_COOKIE = "tally_access";
export const REFRESH_COOKIE = "tally_refresh";

/**
 * Cookie-dica NÃO sensível (sem token), legível pelo middleware do Next para
 * saber se há sessão sem depender do access token de 15min. Vale pela duração do
 * refresh; o `httpOnly` é false de propósito, mas ele não carrega segredo algum.
 */
export const SESSION_HINT_COOKIE = "tally_session";

/** Path mínimo do refresh cookie: só alcança os endpoints de refresh/logout. */
export const REFRESH_COOKIE_PATH = "/v1/auth";

/** Bytes de entropia do refresh token opaco. */
export const REFRESH_TOKEN_BYTES = 32;

/** Cookie temporário com o `state` do OAuth (CSRF do fluxo de redirect). */
export const OAUTH_STATE_COOKIE = "tally_oauth_state";
export const OAUTH_STATE_COOKIE_PATH = "/v1/auth/oauth";
export const OAUTH_STATE_TTL_MS = 10 * 60_000;
