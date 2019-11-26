import { PropDefaultValue, PropDef } from '@storybook/components';
import { isNil, isPlainObject, isArray, isFunction, isString } from 'lodash';
// @ts-ignore
import reactElementToJSXString from 'react-element-to-jsx-string';
import { createSummaryValue, isTooLongForDefaultValueSummary } from '../../../../lib';
import { inspectValue, InspectionFunction } from '../inspection';
import { generateObject } from './generateObject';
import { generateArray } from './generateArray';
import { getPrettyElementIdentifier, getPrettyFuncIdentifier } from './prettyIdentifier';
import { OBJECT_CAPTION, FUNCTION_CAPTION, ELEMENT_CAPTION } from '../captions';
import { isHtmlTag } from '../isHtmlTag';

export type TypeResolver = (rawDefaultProp: any, propDef: PropDef) => PropDefaultValue;

export interface TypeResolvers {
  string: TypeResolver;
  object: TypeResolver;
  function: TypeResolver;
  default: TypeResolver;
}

function isReactElement(element: any): boolean {
  return !isNil(element.$$typeof);
}

export function extractFunctionName(func: Function, propName: string): string {
  const { name } = func;

  // Comparison with the prop name is to discard inferred function names.
  if (name !== '' && name !== 'anoynymous' && name !== propName) {
    return name;
  }

  return null;
}

const stringResolver: TypeResolver = rawDefaultProp => {
  return createSummaryValue(rawDefaultProp);
};

function generateReactObject(rawDefaultProp: any) {
  const { type } = rawDefaultProp;
  const { displayName } = type;

  const jsx = reactElementToJSXString(rawDefaultProp);

  if (!isNil(displayName)) {
    const prettyIdentifier = getPrettyElementIdentifier(displayName);

    return createSummaryValue(prettyIdentifier, prettyIdentifier !== jsx ? jsx : undefined);
  }

  if (isString(type)) {
    // This is an HTML element.
    if (isHtmlTag(type)) {
      const jsxCompact = reactElementToJSXString(rawDefaultProp, { tabStop: 0 });
      const jsxSummary = jsxCompact.replace(/\r?\n|\r/g, '');

      if (!isTooLongForDefaultValueSummary(jsxSummary)) {
        return createSummaryValue(jsxSummary);
      }
    }
  }

  return createSummaryValue(ELEMENT_CAPTION, jsx);
}

const objectResolver: TypeResolver = rawDefaultProp => {
  if (isReactElement(rawDefaultProp) && !isNil(rawDefaultProp.type)) {
    return generateReactObject(rawDefaultProp);
  }

  if (isPlainObject(rawDefaultProp)) {
    const inspectionResult = inspectValue(JSON.stringify(rawDefaultProp));

    return generateObject(inspectionResult);
  }

  if (isArray(rawDefaultProp)) {
    const inspectionResult = inspectValue(JSON.stringify(rawDefaultProp));

    return generateArray(inspectionResult);
  }

  return createSummaryValue(OBJECT_CAPTION);
};

const functionResolver: TypeResolver = (rawDefaultProp, propDef) => {
  let isElement = false;
  let inspectionResult;

  // Try to display the name of the component. The body of the component is ommited since the code has been transpiled.
  if (isFunction(rawDefaultProp.render)) {
    isElement = true;
  } else if (!isNil(rawDefaultProp.prototype) && isFunction(rawDefaultProp.prototype.render)) {
    isElement = true;
  } else {
    let innerElement;

    try {
      inspectionResult = inspectValue(rawDefaultProp.toString());

      const { hasParams, params } = inspectionResult.inferedType as InspectionFunction;
      if (hasParams) {
        // It might be a functional component accepting props.
        if (params.length === 1 && params[0].type === 'ObjectPattern') {
          innerElement = rawDefaultProp({});
        }
      } else {
        innerElement = rawDefaultProp();
      }

      if (!isNil(innerElement)) {
        if (isReactElement(innerElement)) {
          isElement = true;
        }
      }
    } catch (e) {
      // do nothing.
    }
  }

  const funcName = extractFunctionName(rawDefaultProp, propDef.name);
  if (!isNil(funcName)) {
    if (isElement) {
      return createSummaryValue(getPrettyElementIdentifier(funcName));
    }

    if (!isNil(inspectionResult)) {
      inspectionResult = inspectValue(rawDefaultProp.toString());
    }

    const { hasParams } = inspectionResult.inferedType as InspectionFunction;

    return createSummaryValue(getPrettyFuncIdentifier(funcName, hasParams));
  }

  return createSummaryValue(isElement ? ELEMENT_CAPTION : FUNCTION_CAPTION);
};

const defaultResolver: TypeResolver = rawDefaultProp => {
  return createSummaryValue(rawDefaultProp.toString());
};

const DEFAULT_TYPE_RESOLVERS: TypeResolvers = {
  string: stringResolver,
  object: objectResolver,
  function: functionResolver,
  default: defaultResolver,
};

export function createTypeResolvers(customResolvers: Partial<TypeResolvers> = {}): TypeResolvers {
  return {
    ...DEFAULT_TYPE_RESOLVERS,
    ...customResolvers,
  };
}

// When react-docgen cannot provide a defaultValue we take it from the raw defaultProp.
// It works fine for types that are not transpiled. For the types that are transpiled, we can only provide partial support.
// This means that:
//   - The detail might not be available.
//   - Identifiers might not be "prettified" for all the types.
export function createDefaultValueFromRawDefaultProp(
  rawDefaultProp: any,
  propDef: PropDef,
  typeResolvers: TypeResolvers = DEFAULT_TYPE_RESOLVERS
): PropDefaultValue {
  try {
    // Keep the extra () otherwise it will fail for functions.
    // eslint-disable-next-line prettier/prettier
    switch (typeof (rawDefaultProp)) {
      case 'string':
        return typeResolvers.string(rawDefaultProp, propDef);
      case 'object':
        return typeResolvers.object(rawDefaultProp, propDef);
      case 'function': {
        return typeResolvers.function(rawDefaultProp, propDef);
      }
      default:
        return typeResolvers.default(rawDefaultProp, propDef);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  return null;
}
