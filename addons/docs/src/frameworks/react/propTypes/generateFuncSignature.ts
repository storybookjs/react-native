import { isNil } from 'lodash';
import { ExtractedJsDocParam, ExtractedJsDocReturns } from '../../../lib/jsdocParser';

export function generateFuncSignature(
  params: ExtractedJsDocParam[],
  returns: ExtractedJsDocReturns
): string {
  const hasParams = !isNil(params);
  const hasReturns = !isNil(returns);

  if (!hasParams && !hasReturns) {
    return '';
  }

  const funcParts = [];

  if (hasParams) {
    const funcParams = params.map((x: ExtractedJsDocParam) => {
      const prettyName = x.getPrettyName();
      const typeName = x.getTypeName();

      if (!isNil(typeName)) {
        return `${prettyName}: ${typeName}`;
      }

      return prettyName;
    });

    funcParts.push(`(${funcParams.join(', ')})`);
  } else {
    funcParts.push('()');
  }

  if (hasReturns) {
    funcParts.push(`=> ${returns.getTypeName()}`);
  }

  return funcParts.join(' ');
}

export function generateShortFuncSignature(
  params: ExtractedJsDocParam[],
  returns: ExtractedJsDocReturns
): string {
  const hasParams = !isNil(params);
  const hasReturns = !isNil(returns);

  if (!hasParams && !hasReturns) {
    return '';
  }

  const funcParts = [];

  if (hasParams) {
    funcParts.push('( ... )');
  } else {
    funcParts.push('()');
  }

  if (hasReturns) {
    funcParts.push(`=> ${returns.getTypeName()}`);
  }

  return funcParts.join(' ');
}

export function toMultilineSignature(signature: string): string {
  return signature.replace(/,/g, ',\r\n');
}
