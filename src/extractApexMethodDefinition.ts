import { ApexMethodDefinition } from './ApexMethodDefinition';

export function extractApexMethodDefinition(
  input: string
): ApexMethodDefinition {
  const re = /^import\s\w+\sfrom\s'@salesforce\/apex\/(\w+)\.(\w+)';$/,
    match = input.match(re);

  if (!match || !match[1] || !match[2]) {
    throw new Error(`String "${input}" does not match required pattern: ${re}`);
  }

  return {
    className: match[1],
    methodName: match[2],
  };
}
