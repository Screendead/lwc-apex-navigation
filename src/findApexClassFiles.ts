import * as vscode from 'vscode';
import * as fs from 'fs';

export async function findApexClassFiles(className: string): Promise<string[]> {
  const searchTerm = `class ${className}`,
    clsFiles = await vscode.workspace.findFiles(
      'force-app/main/default/classes/**/*.cls'
    ),
    clsFilesContainingSearchTerm = clsFiles.filter((file) => {
      const content = fs.readFileSync(file.fsPath, 'utf-8');
      return content.includes(searchTerm);
    });

  return clsFilesContainingSearchTerm.map((file) => file.fsPath);
}
