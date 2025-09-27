# Changelog

All notable changes to the Notekeep VS Code extension will be documented in this file.

## [0.1.2] - 2025-01-XX

### Fixed
- **Active section unfolding reliability**: Resolved issues where "active" sections would not unfold properly or would unfold incorrect sections
- **Simplified unfolding logic**: Reverted to more reliable pattern matching for active section detection
- **Extension command registration**: Fixed caching issues that could prevent commands from being recognized after updates
- **Command not found errors**: Improved extension activation and command registration reliability

### Changed
- **Removed popup notifications**: Replaced intrusive popup messages with console logging for better user experience
- **Improved error handling**: Enhanced logging for debugging without disrupting workflow

### Developer Improvements
- **Added development workflow**: New `npm run dev-install` command for clean testing
- **Documentation**: Added comprehensive development guides and troubleshooting

## [0.1.1] - 2025-01-XX

### Added
- **Hierarchical section detection**: Enhanced active section detection to work within TODO sections
- **Multiple active section support**: Ability to unfold multiple active sections simultaneously

### Fixed
- **TypeScript configuration**: Added DOM types for console support
- **Async handling**: Improved async/await handling in unfold operations

## [0.1.0] - 2025-01-XX

### Added
- **Auto-fold todo files**: Automatically folds all content when opening Markdown files starting with "todo"
- **Smart active section detection**: Automatically unfolds sections containing "active" in the name
- **Frontmatter folding**: Manual and automatic folding of YAML frontmatter sections
- **Manual commands**:
  - `notekeep.fold-frontmatter`: Fold frontmatter sections
  - `notekeep.unfold-active`: Unfold active sections
  - `notekeep.active`: Fold all then unfold active sections
- **Intelligent reprocessing**: Only folds on file open/reopen, not on tab switching
- **Case-insensitive matching**: Supports variations like "TODO", "todo", "Active", "ACTIVE"
- **Multiple header levels**: Works with any markdown header level (# ## ### etc.)

### Technical
- **FoldingRangeProvider**: Custom folding provider for frontmatter sections
- **Document state tracking**: Prevents duplicate folding when switching between tabs
- **Pattern matching**: Supports headers, HTML comments, code blocks, and list items