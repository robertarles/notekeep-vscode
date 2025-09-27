
import * as vscode from 'vscode';
import { FrontmatterFoldingProvider } from './frontmatterFoldingProvider';

export function activate(context: vscode.ExtensionContext) {
	console.log('Notekeep extension activated!');
	
	// Register a folding provider so frontmatter is a foldable range
	context.subscriptions.push(
		vscode.languages.registerFoldingRangeProvider(
			{ scheme: 'file', language: 'markdown' },
			new FrontmatterFoldingProvider()
		)
	);

	const isTodoMarkdown = (document: vscode.TextDocument): boolean => {
		if (document.languageId !== 'markdown') return false;
		const fileName = document.uri.fsPath.split(/[\\/]/).pop() || '';
		return fileName.toLowerCase().startsWith('todo');
	};

	const findActiveSectionsUnderTodo = (document: vscode.TextDocument): number[] => {
		const text = document.getText();
		const lines = text.split('\n');
		const activeSectionLines: number[] = [];

		// Find all TODO sections and their levels
		const todoSections: Array<{line: number, level: number}> = [];

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const headerMatch = line.match(/^(#+)\s+.*todo.*$/i);
			if (headerMatch) {
				todoSections.push({
					line: i,
					level: headerMatch[1].length
				});
			}
		}

		// For each TODO section, find active subsections
		for (const todoSection of todoSections) {
			const todoLevel = todoSection.level;
			const todoLine = todoSection.line;

			// Find the end of this TODO section (next header of same or higher level, or end of document)
			let sectionEnd = lines.length;
			for (let i = todoLine + 1; i < lines.length; i++) {
				const headerMatch = lines[i].match(/^(#+)\s+/);
				if (headerMatch && headerMatch[1].length <= todoLevel) {
					sectionEnd = i;
					break;
				}
			}

			// Within this TODO section, find active subsections
			for (let i = todoLine + 1; i < sectionEnd; i++) {
				const line = lines[i];
				const headerMatch = line.match(/^(#+)\s+.*active.*$/i);
				if (headerMatch && headerMatch[1].length > todoLevel) {
					activeSectionLines.push(i);
					console.log(`Found active section at line ${i} under TODO section at line ${todoLine}`);
				}
			}
		}

		return activeSectionLines;
	};

	const foldAllForEditor = async (editor: vscode.TextEditor) => {
		try {
			console.log('Attempting foldAll for editor:', editor.document.uri.toString());
			await vscode.window.showTextDocument(editor.document, editor.viewColumn, false);
			await vscode.commands.executeCommand('editor.foldAll');
			console.log('FoldAll executed for:', editor.document.fileName);

			// After folding all, automatically unfold any "active" sections under "TODO" sections
			const activeSectionLines = findActiveSectionsUnderTodo(editor.document);

			for (const lineNumber of activeSectionLines) {
				const pos = new vscode.Position(lineNumber, 0);
				editor.selection = new vscode.Selection(pos, pos);
				await vscode.commands.executeCommand('editor.unfold');
				console.log('Auto-unfolded active section at line:', lineNumber);
			}

			if (activeSectionLines.length === 0) {
				console.log('No active sections found under TODO sections');
			}
		} catch (err) {
			console.log('Error during foldAllForEditor:', err);
		}
	};

	// Track which documents have been processed to avoid duplicate folding
	const processedDocuments = new Set<string>();

	// Auto-fold when opening markdown files that start with "todo"
	const autoFoldDisposable = vscode.workspace.onDidOpenTextDocument((document) => {
		console.log('=== Document opened event fired ===');
		console.log('Document URI:', document.uri.toString());
		console.log('Document language:', document.languageId);
		console.log('Document filename:', document.fileName);
		
		if (!isTodoMarkdown(document)) {
			console.log('Not a target markdown (todo*), skipping');
			return;
		}
		
		const editor = vscode.window.visibleTextEditors.find(
			(e) => e.document.uri.toString() === document.uri.toString()
		);
		if (editor) {
			console.log('Found editor for opened todo*, folding all');
			void foldAllForEditor(editor);
		} else {
			console.log('No visible editor found for opened todo*');
		}
	});

	// Track when documents are closed to allow reprocessing on reopen
	const closeDocumentDisposable = vscode.workspace.onDidCloseTextDocument((document) => {
		const docUri = document.uri.toString();
		if (processedDocuments.has(docUri)) {
			console.log('Document closed, removing from processed set:', document.fileName);
			processedDocuments.delete(docUri);
		}
	});

	// Also fold when the active editor changes to a matching file (but only if not already processed)
	const activeEditorDisposable = vscode.window.onDidChangeActiveTextEditor((editor) => {
		if (!editor) return;
		console.log('Active editor changed:', editor.document.fileName);
		
		const docUri = editor.document.uri.toString();
		if (isTodoMarkdown(editor.document) && !processedDocuments.has(docUri)) {
			console.log('Active editor is unprocessed todo*, folding all');
			processedDocuments.add(docUri);
			void foldAllForEditor(editor);
		}
	});

	// Run once on activation for any already-open editors
	for (const editor of vscode.window.visibleTextEditors) {
		try {
			if (isTodoMarkdown(editor.document)) {
				console.log('Activation pass: folding todo* editor:', editor.document.fileName);
				processedDocuments.add(editor.document.uri.toString());
				void foldAllForEditor(editor);
			}
		} catch (err) {
			console.log('Error during activation fold pass:', err);
		}
	}

	// Register the fold frontmatter command
	const foldFrontmatter = vscode.commands.registerCommand('notekeep.fold-frontmatter', () => {
		console.log('Fold frontmatter command executed');
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			console.log('No active editor found for fold frontmatter command');
			return;
		}

		const document = editor.document;
		const text = document.getText();

		// Find the first --- marker
		const firstMarkerIndex = text.indexOf('---');
		if (firstMarkerIndex === -1) {
			console.log('No frontmatter markers found in this document');
			return;
		}

		// Convert character position to line
		const startLine = text.substring(0, firstMarkerIndex).split('\n').length - 1;

		// Move cursor to the start line and fold
		const startPos = new vscode.Position(startLine, 0);
		editor.selection = new vscode.Selection(startPos, startPos);
		vscode.commands.executeCommand('editor.fold');
	});

	// Register a toggle command: fold all then unfold active
	const notekeepToggle = vscode.commands.registerCommand('notekeep.active', () => {
		console.log('=== Notekeep.active command executed ===');

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			console.log('No active editor found');
			return;
		}

		console.log('Active editor found:', editor.document.fileName);
		void foldAllForEditor(editor);
	});

	// Register the unfold active section command
	const unfoldActive = vscode.commands.registerCommand('notekeep.unfold-active', async () => {
		console.log('Unfold active command executed');
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			console.log('No active editor found for unfold active command');
			return;
		}

		const activeSectionLines = findActiveSectionsUnderTodo(editor.document);

		for (const lineNumber of activeSectionLines) {
			const pos = new vscode.Position(lineNumber, 0);
			editor.selection = new vscode.Selection(pos, pos);
			await vscode.commands.executeCommand('editor.unfold');
			console.log('Manually unfolded active section at line:', lineNumber);
		}

		if (activeSectionLines.length === 0) {
			console.log('No active sections found under TODO sections');
		} else {
			console.log(`Unfolded ${activeSectionLines.length} active section(s)`);
		}
	});

	context.subscriptions.push(autoFoldDisposable, closeDocumentDisposable, activeEditorDisposable, foldFrontmatter, notekeepToggle, unfoldActive);
	console.log('All commands and event listeners registered');
}

export function deactivate() {
	console.log('Notekeep extension deactivated');
}

