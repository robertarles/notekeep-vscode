---
Notekeep VSCode extension
---

A VS Code extension that provides tools for managing Markdown documents, specifically for folding frontmatter sections.

## Features

- **Fold Frontmatter:** Automatically folds the frontmatter section (content between `---` markers) at the beginning of Markdown files to keep your documents clean and readable.

## Commands

- `notekeep.fold-frontmatter`: Folds the frontmatter section in the active Markdown editor.

## Usage

1. Open a Markdown file that contains frontmatter (content between `---` markers at the top)
2. Run the command `notekeep.fold-frontmatter` from the Command Palette
3. The frontmatter section will be automatically folded

## Frontmatter Detection

The extension automatically detects frontmatter sections that follow the standard format:

```markdown
---
title: Document Title
author: Author Name
date: 2024-01-01
---
```

## Contributions

Contributions are welcome!

### Developer Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/robertarles/notekeep.vscode.git
   ```

2. Navigate to the project directory:

   ```bash
   cd notekeep.vscode
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Open the project in VS Code.
5. Press `F5` to open a new Extension Development Host window with the extension running.

### Manual Installation for Local Testing

To test the extension locally without launching a separate development host, you can package it and install it manually.

1. **Package the extension:**
   Run the packaging script from the project root:

   ```bash
   npm run package
   ```

   This will create a `.vsix` file (e.g., `notekeep.vscode-0.0.1.vsix`).

2. **Install the VSIX file:**
   In VS Code, open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run the **"Extensions: Install from VSIX..."** command. Select the `.vsix` file you just created.

3. **Reload VS Code:**
   After installation, you will be prompted to reload VS Code to activate the extension.
