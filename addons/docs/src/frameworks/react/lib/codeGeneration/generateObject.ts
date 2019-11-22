import { generateCode } from './generateCode';

export function generateCompactObject(ast: any): string {
  let result = generateCode(ast, true);

  // Cannot get escodegen to add a space before the last } with the compact mode settings.
  // This fix it until a better solution is found.
  if (!result.endsWith(' }')) {
    result = `${result.slice(0, -1)} }`;
  }

  return result;
}
