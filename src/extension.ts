import * as vscode from 'vscode';
import { findApexClassFiles } from './findApexClassFiles';
import { findApexMethodInClassFile } from './findApexMethodInClassFile';
import { extractApexMethodImportStatements } from './extractApexMethodImportStatements';
import { extractApexMethodDefinition } from './extractApexMethodDefinition';
import { getLines } from './getLines';
import { getApexMethodTokensInLine } from './getApexMethodTokensInLine';
import { getApexMethodAtCursorPosition } from './getApexMethodAtCursorPosition';
import { getApexMethodTokenRange } from './getApexMethodTokenRange';
import { classFilesToLocationLinks } from './classFilesToLocationLinks';

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "lwc-apex-navigation" is now active');

  const disposable = vscode.languages.registerDefinitionProvider(
    {
      language: 'javascript',
      scheme: 'file',
    },
    {
      async provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
      ) {
        const lines = getLines(document),
          currentLine = document.lineAt(position.line),
          apexMethodImportStatements = extractApexMethodImportStatements(lines),
          apexMethodDefinitions = apexMethodImportStatements.map(
            extractApexMethodDefinition
          ),
          apexMethodTokensInCurrentLine = getApexMethodTokensInLine(
            apexMethodDefinitions,
            currentLine.text,
            position.line
          ),
          apexMethodAtCursorPosition = getApexMethodAtCursorPosition(
            apexMethodTokensInCurrentLine,
            position
          );

        if (apexMethodAtCursorPosition === null) {
          return null;
        }

        const apexMethodTokenRange = getApexMethodTokenRange(
            currentLine,
            position,
            apexMethodAtCursorPosition.methodName
          ),
          classFiles = await findApexClassFiles(
            apexMethodAtCursorPosition.className
          );

        if (classFiles.length === 0) {
          throw new Error(
            `Apex method ${apexMethodAtCursorPosition.className}.${apexMethodAtCursorPosition.methodName} correctly identified, but no file was found containing the enclosing class.`
          );
        }

        return classFilesToLocationLinks(
          classFiles,
          apexMethodAtCursorPosition.methodName,
          apexMethodTokenRange
        );
      },
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
