import * as vscode from 'vscode';

export function getLines(document: vscode.TextDocument) {
  return document.getText().split('\n');
}
