import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function findApexMethodInClassFile(
  filePath: string,
  methodName: string
): Promise<vscode.Range[]> {
  const linesInFile = fs.readFileSync(filePath, 'utf-8').split('\n'),
    linesReferencingMethod = linesInFile.filter((line) =>
      line.includes(methodName)
    ),
    relevantLines = linesReferencingMethod.filter((line) => {
      const re = new RegExp(
        `(?:public|private|global)(?:\\sstatic)?.+${methodName}\\(`
      );

      return line.match(re);
    });

  return relevantLines.map((line) => {
    const lineNumber = linesInFile.indexOf(line),
      methodNameStartPosition = line.indexOf(methodName),
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
  });
}
