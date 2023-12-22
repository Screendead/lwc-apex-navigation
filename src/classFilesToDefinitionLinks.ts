import * as vscode from 'vscode';
import { getDefinitionLinks } from './getDefinitionLinks';

export async function classFilesToDefinitionLinks(
  classFiles: string[],
  methodName: string,
  apexMethodTokenRange: vscode.Range
): Promise<vscode.LocationLink[]> {
  return (
    await Promise.all(
      classFiles.map((classFile) => {
        return getDefinitionLinks(classFile, methodName, apexMethodTokenRange);
      })
    )
  )
    .flat()
    .filter((item): item is vscode.LocationLink => item !== null);
}
