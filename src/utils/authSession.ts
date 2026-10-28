const decodeBase64Url = (value: string): string => {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padding = (4 - (normalized.length % 4)) % 4;
    return atob(normalized.padEnd(normalized.length + padding, '='));
};

export const getTokenExpiresAt = (token: string | null): number | null => {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    try {
        const payload = JSON.parse(decodeBase64Url(parts[1]));
        if (typeof payload?.exp !== 'number' || !Number.isFinite(payload.exp)) {
            return null;
        }
        return payload.exp * 1000;
    } catch {
        return null;
    }
};

export const isTokenExpired = (token: string | null, now = Date.now()): boolean => {
    if (!token) return true;
    const expiresAt = getTokenExpiresAt(token);
    return expiresAt === null || expiresAt <= now;
};

export const clearStoredSession = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};
