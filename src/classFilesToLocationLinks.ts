import * as vscode from 'vscode';
import { getLocationLinks } from './getLocationLinks';

export async function classFilesToLocationLinks(
  classFiles: string[],
  methodName: string,
  apexMethodTokenRange: vscode.Range
): Promise<vscode.LocationLink[]> {
  return (
    await Promise.all(
      classFiles.map((classFile) => {
        return getLocationLinks(classFile, methodName, apexMethodTokenRange);
      })
    )
  )
    .flat()
    .filter((item): item is vscode.LocationLink => item !== null);
}
