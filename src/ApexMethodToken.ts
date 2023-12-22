import * as vscode from 'vscode';
import { ApexMethodDefinition } from './ApexMethodDefinition';

export type ApexMethodToken = {
  apexMethodDefinition: ApexMethodDefinition;
  range: vscode.Range;
};
