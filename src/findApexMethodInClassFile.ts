import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function findApexMethodInClassFile(
  filePath: string,
  methodName: string
): Promise<vscode.Range | null> {
  const content = fs.readFileSync(filePath, 'utf-8').split('\n'),
    linesReferencingMethod = content.filter((line) =>
      line.includes(methodName)
    ),
    definition = linesReferencingMethod.find((line) => {
      const re = new RegExp(
        `(?:public|private|global)(?:\\sstatic)?.+${methodName}\\(`
      );

      return line.match(re);
    });

  if (!definition) {
    return null;
  }

  const lineNumber = content.indexOf(definition),
    methodNameStartPosition = definition.indexOf(methodName),
    methodNameEndPosition = methodNameStartPosition + methodName.length,
    destinationStartPosition = new vscode.Position(
      lineNumber,
      methodNameStartPosition
    ),
    destinationEndPosition = new vscode.Position(
      lineNumber,
      methodNameEndPosition
    );

  return new vscode.Range(destinationStartPosition, destinationEndPosition);
}
