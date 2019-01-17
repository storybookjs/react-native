export enum types {
  TAB = 'tab',
  PANEL = 'panel',
  TOOL = 'tool',
}

export type Types = types | string;

export function isSupportedType(type: Types): boolean {
  return !!Object.values(types).find(typeVal => typeVal === type);
}
