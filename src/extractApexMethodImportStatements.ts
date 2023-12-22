export function extractApexMethodImportStatements(lines: string[]): string[] {
  return lines.filter(
    (line) => line.startsWith('import') && line.includes('@salesforce/apex')
  );
}
