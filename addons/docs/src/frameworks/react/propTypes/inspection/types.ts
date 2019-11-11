export enum InspectionType {
  IDENTIFIER = 'Identifier',
  LITERAL = 'Literal',
  OBJECT = 'Object',
  ARRAY = 'Array',
  FUNCTION = 'Function',
  CLASS = 'Class',
  ELEMENT = 'Element',
  UNKNOWN = 'Unknown',
}

export interface BaseInspectionInferedType {
  type: InspectionType;
}

// TODO: Fix this.
// export interface OptionalIdentifierInspectionType extends BaseInspectionInferedType {
//   identifier?: string;
// }

// export interface RequiredIdentifierInspectionType extends BaseInspectionInferedType {
//   identifier: string;
// }

// export type IdentifiableInspectionType =
//   | OptionalIdentifierInspectionType
//   | RequiredIdentifierInspectionType;

export interface InspectionIdentifier extends BaseInspectionInferedType {
  type: InspectionType.IDENTIFIER;
  identifier: string;
}

export interface InspectionLiteral extends BaseInspectionInferedType {
  type: InspectionType.LITERAL;
}

export interface InspectionObject extends BaseInspectionInferedType {
  type: InspectionType.OBJECT;
}

export interface InspectionArray extends BaseInspectionInferedType {
  type: InspectionType.ARRAY;
}

export interface InspectionClass extends BaseInspectionInferedType {
  type: InspectionType.CLASS;
  identifier: string;
  // TODO: Might remove this prop.
  isDefinition: boolean;
}

export interface InspectionFunction extends BaseInspectionInferedType {
  type: InspectionType.FUNCTION;
  identifier?: string;
  // TODO: Might remove this prop.
  isDefinition: boolean;
  hasArguments: boolean;
}

export interface InspectionElement extends BaseInspectionInferedType {
  type: InspectionType.ELEMENT;
  identifier?: string;
  // TODO: Might remove this prop.
  isDefinition: boolean;
  // TODO: Might Remove this prop.
  isJsx: boolean;
}

export interface InspectionUnknown extends BaseInspectionInferedType {
  type: InspectionType.UNKNOWN;
}

export type InspectionInferedType =
  | InspectionIdentifier
  | InspectionLiteral
  | InspectionObject
  | InspectionArray
  | InspectionClass
  | InspectionFunction
  | InspectionElement
  | InspectionUnknown;

export interface InspectionResult {
  inferedType: InspectionInferedType;
  ast?: any;
}
