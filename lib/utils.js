import os from 'os';
import path from 'path';

/**
 * Get the platform (windows, linux, darwin)
 */
export function getPlatform() {
    return process.platform;
}

/**
 * Check if running on Windows
 */
export function isWindows() {
    return process.platform === 'win32';
}

/**
 * Expand home directory path across all platforms
 * Handles both ~ and $HOME on Unix, %USERPROFILE% on Windows
 */
export function expandHome(p) {
    const home = os.homedir();
    if (p.startsWith('~')) {
        return p.replace('~', home);
    }
    return p;
}

/**
 * Normalize path for current platform
 * Converts forward slashes to backslashes on Windows, ensures consistency
 */
export function normalizePath(p) {
    const expanded = expandHome(p);
    return path.normalize(expanded);
}

/**
 * Compare paths case-insensitively on case-insensitive filesystems
 * (Windows and macOS by default)
 */
export function pathsEqual(pathA, pathB) {
    const normalized1 = normalizePath(pathA);
    const normalized2 = normalizePath(pathB);
    
    // Case-insensitive on Windows and macOS
    if (isWindows() || process.platform === 'darwin') {
        return normalized1.toLowerCase() === normalized2.toLowerCase();
    }
    // Case-sensitive on Linux
    return normalized1 === normalized2;
}

/**
 * Get SSH directory path for the current OS
 */
export function getSshDirectory() {
    const home = os.homedir();
    if (isWindows()) {
        // On Windows, prefer .ssh in USERPROFILE
        return path.join(home, '.ssh');
    }
    return path.join(home, '.ssh');
}

/**
 * Get SSH config path for the current OS
 */
export function getSshConfigPath() {
    const sshDir = getSshDirectory();
    if (isWindows()) {
        // Windows can use both config file (no extension) or config.txt
        // Standard is config without extension
        return path.join(sshDir, 'config');
    }
    return path.join(sshDir, 'config');
}

/**
 * Get git config path for the current OS
 */
export function getGitConfigPath() {
    const home = os.homedir();
    if (isWindows()) {
        return path.join(home, '.gitconfig');
    }
    return path.join(home, '.gitconfig');
}

/**
 * Convert absolute path to tilde notation if in home directory
 */
export function pathToTilde(p) {
    const home = os.homedir();
    const normalized = normalizePath(p);
    const homeNormalized = normalizePath(home);
    
    if (normalized.toLowerCase().startsWith(homeNormalized.toLowerCase())) {
        return '~' + normalized.substring(homeNormalized.length);
    }
    return normalized;
}

/**
 * Normalize account type (lowercase, alphanumeric with hyphens only)
 */
export function normalizeAccountType(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}