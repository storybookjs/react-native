export enum InspectionType {
  OBJECT = 'object',
  ARRAY = 'array',
  FUNCTION = 'func',
  ELEMENT = 'element',
  STRING = 'string',
}

export interface InspectionResult {
  inferedType: InspectionType;
}

export function inspectValue(value: string): InspectionResult {
  const trimmedValue = value.trimLeft();
  let type = InspectionType.STRING;

  if (trimmedValue.startsWith('{')) {
    type = InspectionType.OBJECT;
  } else if (trimmedValue.startsWith('[')) {
    type = InspectionType.ARRAY;
  } else if (trimmedValue.startsWith('()') || trimmedValue.startsWith('function')) {
    type = mightBeComponent(trimmedValue) ? InspectionType.ELEMENT : InspectionType.FUNCTION;
  } else if (trimmedValue.startsWith('class') && mightBeComponent(trimmedValue)) {
    type = InspectionType.ELEMENT;
  }

  return {
    inferedType: type,
  };
}

function mightBeComponent(value: string): boolean {
  return value.includes('React') || value.includes('Component') || value.includes('render');
}
