import { PropType, PropSummaryValue } from '@storybook/components';
import { isNil } from 'lodash';
import { DocgenPropType } from '../types';
import { createSummaryValue } from '../../utils';

enum FlowTypesType {
  UNION = 'union',
  ARRAY = 'Array',
  SIGNATURE = 'signature',
}

interface DocgenFlowUnionType extends DocgenPropType {
  elements: { name: string; value: string }[];
}

function generateUnion(type: DocgenFlowUnionType): PropSummaryValue {
  if (!isNil(type.raw)) {
    return createSummaryValue(type.raw);
  }

  if (!isNil(type.elements)) {
    return createSummaryValue(type.elements.map(x => x.value).join(' | '));
  }

  return createSummaryValue(type.name);
}

function generateArray(type: DocgenPropType): PropSummaryValue {
  if (!isNil(type.raw)) {
    return createSummaryValue(type.raw);
  }

  return createSummaryValue(type.name);
}

function generateSignature(type: DocgenPropType): PropSummaryValue {
  if (!isNil(type.raw)) {
    return createSummaryValue(type.raw);
  }

  return createSummaryValue(type.name);
}

export function createType(type: DocgenPropType): PropType {
  switch (type.name) {
    case FlowTypesType.UNION:
      return generateUnion(type as DocgenFlowUnionType);
    case FlowTypesType.ARRAY:
      return generateArray(type);
    case FlowTypesType.SIGNATURE:
      return generateSignature(type);
    default:
      return createSummaryValue(type.name);
  }
}
