import * as vscode from 'vscode';
import { spawn } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('zeal-shortcut.queryWord', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		const sel = editor.selection;
		let text = editor.document.getText(sel);
		if (!text) {
			const range = editor.document.getWordRangeAtPosition(sel.active);
			if (!range) {
				return;
			}
			text = editor.document.getText(range);
		}
		const cfg = vscode.workspace.getConfiguration('zealShortcut');
		let zealPath = cfg.get<string>('zealPath') || '';
		if (!zealPath) {
			if (process.platform === 'darwin') {
				zealPath = '/Applications/Zeal.app/Contents/MacOS/Zeal';
			} else {
				zealPath = 'zeal';
			}
		}
		const child = spawn(zealPath, [text], { detached: true, stdio: 'ignore' });
		child.on('error', () => {
			vscode.window.showErrorMessage('Failed to run Zeal. Set zealShortcut.zealPath.');
		});
		child.unref();
	});
	context.subscriptions.push(disposable);
}

export function deactivate() {}
