---
title: Notekeep VS Code Extension
---
A VS Code extension that provides intelligent folding for Markdown documents, specifically designed for managing todo lists and notes with automatic frontmatter and section management.

## Recent Updates

### v0.1.2 - Bug Fixes & Reliability Improvements
- **🐛 Fixed**: Active section unfolding reliability - sections now unfold correctly every time
- **⚡ Improved**: Simplified and more reliable unfolding algorithm
- **🔧 Fixed**: Extension command registration issues that could cause "command not found" errors
- **🔇 Removed**: Intrusive popup notifications - replaced with non-disruptive console logging
- **👨‍💻 Added**: Development tools and documentation for contributors

## Features

- **Auto-Fold Todo Files**: Automatically folds all content when opening Markdown files that start with "todo" (e.g., `todo.md`, `todo.personal.md`, `todo.disney.md`)
- **Smart Active Section Detection**: Automatically unfolds any section containing "active" in the name after folding everything
- **Frontmatter Folding**: Provides manual control over frontmatter sections
- **Intelligent Folding**: Only folds on file open, not on tab switching, with smart reprocessing when files are reopened

## Commands

- `notekeep.fold-frontmatter`: Manually folds the frontmatter section in the active Markdown editor
- `notekeep.unfold-active`: Unfolds any section named "active" in the current document
- `notekeep.active`: Toggle command that folds all content then unfolds the active section

## Usage

### Automatic Behavior

1. **Open any Markdown file** that starts with "todo" (e.g., `todo.md`, `todo.personal.md`)
2. **Content automatically folds** - everything collapses including frontmatter
3. **Active section automatically unfolds** - any section with "active" in the name becomes visible
4. **Switch between tabs** without triggering refolding
5. **Close and reopen** the same file to trigger folding again

### Manual Commands

- **Fold Frontmatter**: Use `notekeep.fold-frontmatter` to manually fold just the frontmatter
- **Unfold Active**: Use `notekeep.unfold-active` to manually unfold any "active" section
- **Toggle All**: Use `notekeep.active` to manually fold everything then unfold the active section

## Frontmatter Detection

The extension automatically detects frontmatter sections that follow the standard format:

```markdown
---
title: Document Title
author: Author Name
date: 2024-01-01
---
```

## Active Section Detection

The extension automatically detects and unfolds sections containing "active" in various formats:

- **Markdown Headings**: `# Active Tasks`, `## Currently Active`, `### ACTIVE`
- **HTML Comments**: `<!-- Active section -->`
- **Code Blocks**: ````active code`
- **List Items**: `- Active item`

## Installation

Install from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=robertarles.notekeep-vscode) or search for "Notekeep" in VS Code's Extensions view.

## Requirements

- Visual Studio Code 1.87.0 or higher
- Markdown files for full functionality

## Development

### Local Testing & Installation

When developing changes to this extension, use these commands for proper testing:

#### Clean Development Install
```bash
npm run dev-install
```
This command:
1. Builds the extension (`npm run build`)
2. Uninstalls any existing version (`code --uninstall-extension`)
3. Installs the newly built version (`code --install-extension`)

#### Alternative alias
```bash
npm run dev-reinstall
```

#### Why Clean Installation?
VS Code aggressively caches extensions and commands. Simply installing over an existing version may not update:
- Command registrations
- Extension activation events
- Package.json contributions

**Always use `dev-install` instead of just `code --install-extension` when testing changes.**

#### Manual Steps (if npm command fails)
```bash
npm run build
code --uninstall-extension robertarles.notekeep-vscode
code --install-extension notekeep-vscode-[version].vsix
```

### Debugging
- Press `F5` in VS Code to launch Extension Development Host
- Use `Developer: Reload Window` to refresh after changes
- Check console output for extension logs

## License

This extension is provided as-is for public use.
