import * as vscode from 'vscode';

export function getLines(document: vscode.TextDocument): string[] {
  return document.getText().split('\n');
}
