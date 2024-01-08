import { ApexMethodDefinition } from './ApexMethodDefinition';

export function getApexMethodNameLocationInLine(
  methodName: string,
  line: string
): number | null {
  const index = line.indexOf(methodName);

  if (index === -1) {
    return null;
  }

  return index;
}
