import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function findApexClassFiles(className: string): Promise<string[]> {
  const searchTerm = `class ${className}`,
    clsFiles = await vscode.workspace.findFiles(
      'force-app/main/default/classes/**/*.cls'
    );

  return clsFiles
    .filter((file) => {
      const content = fs.readFileSync(file.fsPath, 'utf-8');
      return content.includes(searchTerm);
    })
    .map((file) => file.fsPath);
}
