export function expandHome(p) {
    if (p.startsWith('~')) {
        return p.replace('~', process.env.HOME);
    }
    return p;
}