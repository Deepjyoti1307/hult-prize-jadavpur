const AUTH_COOKIE_NAME = 'tarang_auth';
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function setAuthCookie(uid: string) {
    if (typeof document === 'undefined') return;
    document.cookie = `${AUTH_COOKIE_NAME}=${uid}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearAuthCookie() {
    if (typeof document === 'undefined') return;
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
