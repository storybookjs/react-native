export enum types {
  TAB = 'tab',
  PANEL = 'panel',
  TOOL = 'tool',
  PREVIEW = 'preview',
  NOTES_ELEMENT = 'notes-element',
}

export type Types = types | string;

export function isSupportedType(type: Types): boolean {
  return !!Object.values(types).find(typeVal => typeVal === type);
}
