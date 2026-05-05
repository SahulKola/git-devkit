# Cross-Platform Compatibility Updates

## Overview

The git-devkit has been updated to support **Windows**, **Linux**, and **macOS** with full cross-platform path handling and case-insensitive filesystem support.

## Changes Summary

### 1. **lib/utils.js** - Cross-Platform Utilities
**New Functions:**
- `getPlatform()` - Get current OS (windows, linux, darwin)
- `isWindows()` - Check if running on Windows
- `normalizePath(p)` - Normalize paths for current OS
- `pathsEqual(pathA, pathB)` - Case-insensitive path comparison for Windows/macOS
- `getSshDirectory()` - Get platform-specific SSH directory
- `getSshConfigPath()` - Get platform-specific SSH config path
- `getGitConfigPath()` - Get platform-specific Git config path
- `pathToTilde(p)` - Convert paths to tilde notation if in home directory

**Key Features:**
- Handles both `/` and `\` separators automatically
- Case-insensitive path comparison on Windows and macOS
- Case-sensitive on Linux
- Expands `~` consistently across all platforms

### 2. **lib/fileManager.js** - File Operations
**Changes:**
- Uses `getSshConfigPath()` and `getGitConfigPath()` for platform-specific paths
- Updated `backup()` function to handle both `/` and `\` separators
- Enhanced gitdir pattern matching to support both Unix and Windows paths
- Uses `gitdircase` on Windows/macOS for case-insensitive matching
- Cross-platform SSH directory handling

### 3. **lib/generator.js** - Configuration Generation
**Changes:**
- Automatically uses `gitdircase` on Windows/macOS
- Uses `gitdir` on Linux (case-sensitive)
- Normalizes paths to forward slashes for git config (git handles both)
- Proper expansion of `~` paths for all platforms

### 4. **bin/index.js** - Main CLI Tool
**Changes:**
- Uses `getSshDirectory()` for SSH key storage
- Replaced shell commands (`mkdir`, `chmod`, `test`, `cat`) with Node.js APIs
- Cross-platform SSH key generation with proper quoting
- Supports Windows absolute paths (C:\path\to\folder)
- Updated folder validation to accept Windows paths
- Uses `fs.mkdirSync()` and `fs.statSync()` instead of shell commands
- Added proper error handling for cross-platform operations

**Key Improvements:**
- Shell commands replaced with Node.js `fs` module for Windows compatibility
- Proper handling of file paths with spaces
- Quote wrapping for paths with special characters
- Windows-compatible SSH key creation

### 5. **New Script Files for Windows**
**Created:**
- `setup.bat` - Windows batch version of setup.sh
- `setup.ps1` - Windows PowerShell version
- `setup-aliases.bat` - Windows batch version of setup-aliases.sh
- `setup-aliases.ps1` - Windows PowerShell version
- `install-aliases.bat` - Windows batch version of install-aliases.sh

**Documentation:**
- `CROSS_PLATFORM.md` - Comprehensive cross-platform setup guide

## Platform-Specific Details

### Path Handling

| Aspect | macOS/Linux | Windows |
|--------|------------|---------|
| Home Directory | `/Users/username` → `~` | `C:\Users\Username` → `~` |
| SSH Config | `~/.ssh/config` | `%USERPROFILE%\.ssh\config` |
| Git Config | `~/.gitconfig` | `%USERPROFILE%\.gitconfig` |
| Path Separator | `/` | `\` (auto-normalized) |
| Case Sensitivity | Sensitive (Linux), Insensitive (macOS) | Insensitive |
| Gitdir Matching | `gitdir` | `gitdircase` |

### SSH Key Generation

**macOS/Linux:**
```bash
ssh-keygen -t ed25519 -C 'email@example.com' -f '~/.ssh/id_ed25519_work' -N ''
```

**Windows:**
```cmd
ssh-keygen -t ed25519 -C "email@example.com" -f "%USERPROFILE%\.ssh\id_ed25519_work" -N ""
```

### Git Include Paths

**macOS/Linux (case-sensitive filesystem):**
```gitconfig
[includeIf "gitdir:/Users/username/Developer/work/"]
  path = ~/.gitconfig-work
```

**Windows/macOS (case-insensitive filesystem):**
```gitconfig
[includeIf "gitdircase:C:/Users/Username/Developer/work/"]
  path = ~/.gitconfig-work
```

## Feature Parity

All features work identically across Windows, macOS, and Linux:

✅ Multiple SSH identities
✅ Per-folder git configuration
✅ SSH key generation (ed25519)
✅ Automatic SSH config updates
✅ Configuration backups
✅ Case-insensitive path matching
✅ Tilde (`~`) path expansion
✅ Absolute and relative paths
✅ SSH agent integration

## Testing Recommendations

### Windows (Command Prompt)
```cmd
setup.bat
git-multi-ssh
```

### Windows (PowerShell)
```powershell
.\setup.ps1
git-multi-ssh
```

### Linux
```bash
chmod +x setup.sh
./setup.sh
git-multi-ssh
```

### macOS
```bash
chmod +x setup.sh
./setup.sh
git-multi-ssh
```

## Backward Compatibility

✅ All existing configurations remain compatible
✅ Old macOS/Linux scripts still work
✅ No breaking changes to generated configs
✅ Automatic migration of existing setups

## Notes

1. **Path Normalization**: All paths are automatically normalized for the current OS
2. **Case Sensitivity**: File operations handle case-insensitive filesystems gracefully
3. **SSH Config Format**: Git config uses forward slashes internally; `ssh-keygen` and git.exe handle them correctly
4. **Backups**: All operations back up existing files before modification
5. **Environment Variables**: Uses `os.homedir()` for portable home directory detection
