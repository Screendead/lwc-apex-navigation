import * as vscode from 'vscode';
import { findApexClassFiles } from './findApexClassFiles';
import { findApexMethodInClassFile } from './findApexMethodInClassFile';

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
        const availableApexMethods: {
            className: string;
            methodName: string;
          }[] = document
            .getText()
            .split('\n')
            .filter(
              (line) =>
                line.startsWith('import') && line.includes('@salesforce/apex/')
            )
            .map((line) => {
              const className = line.match(
                  /@salesforce\/apex\/(\w+)\.\w+/
                )?.[1],
                methodName = line.split(' ')[1];

              if (!className || !methodName) {
                return null;
              }

              return { className, methodName };
            })
            .filter(
              (item): item is { className: string; methodName: string } =>
                item !== null
            ),
          currentLine = document.lineAt(position.line).text,
          currentApexMethods = availableApexMethods
            .filter(({ methodName }) => currentLine.indexOf(methodName) !== -1)
            .map(({ className, methodName }) => {
              const methodNamePosition = currentLine.indexOf(methodName),
                startPosition = new vscode.Position(
                  position.line,
                  methodNamePosition
                ),
                endPosition = new vscode.Position(
                  position.line,
                  methodNamePosition + methodName.length
                );

              return {
                className,
                methodName,
                originStartPosition: startPosition,
                originEndPosition: endPosition,
              };
            })
            .filter(({ originStartPosition, originEndPosition }) => {
              return (
                position.isAfterOrEqual(originStartPosition) &&
                position.isBeforeOrEqual(originEndPosition)
              );
            });

        if (currentApexMethods.length === 0) {
          return null;
        } else if (currentApexMethods.length > 1) {
          console.log('Apex Methods', currentApexMethods);
          return null;
        }

        const [methodInfo] = currentApexMethods,
          classFiles = await findApexClassFiles(methodInfo.className);

        if (classFiles.length === 0) {
          return null;
        } else if (classFiles.length > 1) {
          console.log('Apex Class Files', classFiles);
          return null;
        }

        const fileToOpen = {
            ...methodInfo,
            classFile: classFiles[0],
          },
          targetRange = await findApexMethodInClassFile(
            fileToOpen.classFile,
            methodInfo.methodName
          );

        if (targetRange === null) {
          return null;
        }

        const definitionLink: vscode.DefinitionLink = {
          originSelectionRange: new vscode.Range(
            fileToOpen.originStartPosition,
            fileToOpen.originStartPosition
          ),
          targetUri: vscode.Uri.file(fileToOpen.classFile),
          targetRange,
        };

        return [definitionLink];
      },
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
