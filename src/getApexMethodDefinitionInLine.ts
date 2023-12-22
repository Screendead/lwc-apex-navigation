import { ApexMethodDefinition } from './ApexMethodDefinition';

export function getApexMethodNameLocationInLine(
  apexMethodDefinition: ApexMethodDefinition,
  line: string
): number | null {
  const index = line.indexOf(apexMethodDefinition.methodName);

  if (index === -1) {
    return null;
  }

  return index;
}
