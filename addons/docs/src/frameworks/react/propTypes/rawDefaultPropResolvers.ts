import { isNil } from 'lodash';
import { TypeResolver, extractFunctionName, createTypeResolvers } from '../lib/defaultValues';
import { createSummaryValue } from '../../../lib';
import { FUNCTION_CAPTION, ELEMENT_CAPTION } from '../lib';
import {
  getPrettyElementIdentifier,
  getPrettyFuncIdentifier,
} from '../lib/defaultValues/prettyIdentifier';
import { inspectValue, InspectionFunction } from '../lib/inspection';

const funcResolver: TypeResolver = (rawDefaultProp, { name, type }) => {
  const isElement = type.summary === 'element' || type.summary === 'elementType';

  const funcName = extractFunctionName(rawDefaultProp, name);
  if (!isNil(funcName)) {
    // Try to display the name of the component. The body of the component is ommited since the code has been transpiled.
    if (isElement) {
      return createSummaryValue(getPrettyElementIdentifier(funcName));
    }

    const { hasParams } = inspectValue(rawDefaultProp.toString()).inferedType as InspectionFunction;

    return createSummaryValue(getPrettyFuncIdentifier(funcName, hasParams));
  }

  return createSummaryValue(isElement ? ELEMENT_CAPTION : FUNCTION_CAPTION);
};

export const rawDefaultPropTypeResolvers = createTypeResolvers({
  function: funcResolver,
});
