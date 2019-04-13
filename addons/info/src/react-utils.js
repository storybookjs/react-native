import { isMemo } from 'react-is';

export function getType(typeOrMemo) {
  return isMemo(typeOrMemo) ? typeOrMemo.type : typeOrMemo;
}

export function getDisplayName(typeOrMemo) {
  if (typeof typeOrMemo === 'string') {
    return typeOrMemo;
  }

  const type = getType(typeOrMemo);
  return type.displayName || type.name || 'Unknown';
}
