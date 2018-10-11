export const types = {
  TAB: 'tab',
  PANEL: 'panel',
  TOOL: 'tool',
};

export function isSupportedType(type) {
  return Object.key(types).find(typeKey => types[typeKey] === type);
}
