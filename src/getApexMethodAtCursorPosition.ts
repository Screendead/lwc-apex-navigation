import * as vscode from 'vscode';
import { ApexMethodDefinition } from './ApexMethodDefinition';
import { ApexMethodToken } from './ApexMethodToken';

export function getApexMethodAtCursorPosition(
  apexMethodTokens: ApexMethodToken[],
  cursorPosition: vscode.Position
): ApexMethodDefinition | null {
  const apexMethodTokensUnderCursor = apexMethodTokens.filter(({ range }) =>
    range.contains(cursorPosition)
  );

  if (apexMethodTokensUnderCursor.length === 0) {
    return null;
  } else if (apexMethodTokensUnderCursor.length > 1) {
    const listOfMethods = apexMethodTokensUnderCursor
      .map(
        (token) =>
          `${token.apexMethodDefinition.className}.${token.apexMethodDefinition.methodName}`
      )
      .join(',');

    throw new Error(
      `Current cursor position is within more than one valid Apex method: ${listOfMethods}`
    );
  }

  return apexMethodTokensUnderCursor[0].apexMethodDefinition;
}
