import * as vscode from 'vscode';
import { findApexMethodInClassFile } from './findApexMethodInClassFile';

export async function getDefinitionLinks(
  classFile: string,
  methodName: string,
  apexMethodTokenRange: vscode.Range
): Promise<vscode.LocationLink[]> {
  const targetRanges = await findApexMethodInClassFile(classFile, methodName);

  return targetRanges.map((targetRange) => {
    const definitionLink: vscode.DefinitionLink = {
      originSelectionRange: apexMethodTokenRange,
      targetUri: vscode.Uri.file(classFile),
      targetRange,
    };

    return definitionLink;
  });
}
