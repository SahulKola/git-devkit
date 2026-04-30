export function expandHome(p) {
    if (p.startsWith('~')) {
        return p.replace('~', process.env.HOME);
    }
    return p;
}

export function normalizeAccountType(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}