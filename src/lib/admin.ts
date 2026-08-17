export const ADMIN_EMAIL_ALLOWLIST = (
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? 'tarang130704@gmail.com'
)
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);

export function isAdminEmail(email: string | null | undefined): boolean {
    if (!email) return false;
    return ADMIN_EMAIL_ALLOWLIST.includes(email);
}
