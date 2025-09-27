# Development Notes

## VS Code Extension Caching Issues

VS Code has aggressive caching that can cause problems during development:

### Problem
- Commands may not be registered properly
- Changes to `package.json` contributions may not take effect
- Extension activation may use cached version

### Solution
Always use clean reinstall for testing:

```bash
npm run dev-install
```

### Never Do This During Development
```bash
# ❌ This may use cached version
code --install-extension extension.vsix
```

### Always Do This Instead
```bash
# ✅ Clean reinstall prevents caching issues
npm run dev-install
```

## Extension Commands

- `notekeep.fold-frontmatter` - Fold document frontmatter
- `notekeep.unfold-active` - Unfold active sections
- `notekeep.active` - Fold all then unfold active sections

## Testing Checklist

1. Make code changes
2. Run `npm run dev-install`
3. Test commands in VS Code
4. If commands not found → reload VS Code window
5. Verify auto-folding works on todo files

## Common Issues

- **"Command not found"** → Use `npm run dev-install`, not manual install
- **Commands work but behavior unchanged** → Check console logs for errors
- **Extension not activating** → Check `activationEvents` in package.json