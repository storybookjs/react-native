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

// // TODO: Add tests
// export function generateCompactFuncSignature(
//   params: ExtractedJsDocParam[],
//   returns: ExtractedJsDocReturns
// ): string {
//   const hasParams = !isNil(params);
//   const hasReturns = !isNil(returns);

//   const funcParts = [];

//   if (hasParams) {
//     funcParts.push('( ... )');
//   } else {
//     funcParts.push('()');
//   }

//   if (hasReturns) {
//     funcParts.push(`=> ${returns.getTypeName()}`);
//   }

//   return funcParts.join(' ');
// }

// TODO: Add tests
// export function generateCompactFuncSignature(
//   params: ExtractedJsDocParam[],
//   returns: ExtractedJsDocReturns
// ): string {
//   const hasParams = !isNil(params);
//   const hasReturns = !isNil(returns);

//   const returnsPart = hasReturns ? ` => ${returns.getTypeName()}` : '';

//   if (hasParams) {
//     const paramsParts = [];
//     // 2 is for '()'.
//     let currentLength = 2 + returnsPart.length;

//     for (let i = 0; i < params.length; i += 1) {
//       const param = params[i].getPrettyName();
//       const paramLength = param.length;

//       if (currentLength + paramLength < MAX_EXPANDABLE_LENGTH) {
//         paramsParts.push(param);
//         // 2 is for ', '.
//         currentLength += paramLength + 2;
//       } else {
//         paramsParts.push('...');
//         break;
//       }
//     }

//     return `(${paramsParts.join(', ')})${returnsPart}`;
//   }

//   return `()${returnsPart}`;
// }

// // TODO: Add tests
// export function generateCompactFuncSignature(
//   params: ExtractedJsDocParam[],
//   returns: ExtractedJsDocReturns
// ): string {
//   const hasParams = !isNil(params);
//   const hasReturns = !isNil(returns);

//   const returnsPart = hasReturns ? ` => ${returns.getTypeName()}` : '';

//   if (hasParams) {
//     const paramsParts = [];
//     // 2 is for '()'.
//     let currentLength = 2 + returnsPart.length;

//     for (let i = 0; i < params.length; i += 1) {
//       const param = generateSignatureArg(params[i]);
//       const paramLength = param.length;

//       // if (currentLength + paramLength < MAX_TYPE_SUMMARY_LENGTH) {
//       if (currentLength + paramLength < 70) {
//         paramsParts.push(param);
//         // 2 is for ', '.
//         currentLength += paramLength + 2;
//       } else {
//         paramsParts.push('...');
//         break;
//       }
//     }

//     return `(${paramsParts.join(', ')})${returnsPart}`;
//   }

//   return `()${returnsPart}`;
// }
