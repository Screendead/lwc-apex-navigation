import * as vscode from 'vscode';
import { ApexMethodDefinition } from './ApexMethodDefinition';
import { getApexMethodNameLocationInLine } from './getApexMethodDefinitionInLine';
import { ApexMethodToken } from './ApexMethodToken';

export function getApexMethodTokensInLine(
  apexMethodDefinitions: ApexMethodDefinition[],
  line: string,
  lineNumber: number
): ApexMethodToken[] {
  return apexMethodDefinitions
    .map((apexMethodDefinition) => {
      const startPosition = getApexMethodNameLocationInLine(
        apexMethodDefinition,
        line
      );

      if (startPosition === null) {
        return null;
      }

      const endPosition =
          startPosition + apexMethodDefinition.methodName.length,
        range = new vscode.Range(
          new vscode.Position(lineNumber, startPosition),
          new vscode.Position(lineNumber, endPosition)
        );

      return { apexMethodDefinition, range };
    })
    .filter((item): item is ApexMethodToken => item !== null);
}
