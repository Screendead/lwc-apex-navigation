import * as vscode from 'vscode';

export function getApexMethodTokenRange(
  currentLine: vscode.TextLine,
  position: vscode.Position,
  apexMethodName: string
): vscode.Range {
  let indices = [];
  let index = 0;

  while ((index = currentLine.text.indexOf(apexMethodName, index)) !== -1) {
    indices.push(index);
    index += apexMethodName.length; // Move to the end of the current found substring
  }

  const tokenRange = indices
    .map(
      (index) =>
        new vscode.Range(
          new vscode.Position(currentLine.lineNumber, index),
          new vscode.Position(
            currentLine.lineNumber,
            index + apexMethodName.length
          )
        )
    )
    .find((range) => range.contains(position));

  if (tokenRange === undefined) {
    throw new Error(
      `Token ${apexMethodName} not found in string "${currentLine.text}" (line number ${currentLine.lineNumber})`
    );
  }

  return tokenRange;
}
