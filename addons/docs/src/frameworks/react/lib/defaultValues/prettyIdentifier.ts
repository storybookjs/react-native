import {
  InspectionIdentifiableInferedType,
  InspectionFunction,
  InspectionType,
} from '../inspection';

export function getPrettyIdentifier(inferedType: InspectionIdentifiableInferedType): string {
  const { type, identifier } = inferedType;

  switch (type) {
    case InspectionType.FUNCTION:
      return getPrettyFuncIdentifier(identifier, (inferedType as InspectionFunction).hasParams);
    case InspectionType.ELEMENT:
      return getPrettyElementIdentifier(identifier);
    default:
      return identifier;
  }
}

export function getPrettyFuncIdentifier(identifier: string, hasArguments: boolean): string {
  return hasArguments ? `${identifier}( ... )` : `${identifier}()`;
}

export function getPrettyElementIdentifier(identifier: string) {
  return `<${identifier} />`;
}
