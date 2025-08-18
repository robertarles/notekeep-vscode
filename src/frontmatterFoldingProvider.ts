import * as vscode from 'vscode';

export class FrontmatterFoldingProvider implements vscode.FoldingRangeProvider {
	provideFoldingRanges(
		document: vscode.TextDocument,
		_context: vscode.FoldingContext,
		_token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.FoldingRange[]> {
		const lineCount = document.lineCount;
		if (lineCount === 0) {
			return [];
		}

		// Detect YAML frontmatter bounded by lines containing only ---
		let startLineIndex: number | null = null;
		let endLineIndex: number | null = null;

		for (let i = 0; i < Math.min(lineCount, 100); i++) {
			const lineText = document.lineAt(i).text.trim();
			if (i === 0 && lineText === '---') {
				startLineIndex = i;
				break;
			}
			// If not at the very top, allow optional BOM or blank lines before frontmatter
			if (i < 3 && (lineText === '' || lineText === '\ufeff')) {
				continue;
			}
			if (lineText === '---') {
				// Only consider as frontmatter if within first few lines
				startLineIndex = i;
				break;
			}
		}

		if (startLineIndex === null) {
			return [];
		}

		for (let j = startLineIndex + 1; j < Math.min(lineCount, startLineIndex + 200); j++) {
			const lineText = document.lineAt(j).text.trim();
			if (lineText === '---') {
				endLineIndex = j;
				break;
			}
		}

		if (endLineIndex === null) {
			return [];
		}

		// Fold from the opening marker line down to the closing marker line
		return [
			new vscode.FoldingRange(startLineIndex, endLineIndex, vscode.FoldingRangeKind.Region)
		];
	}
}


