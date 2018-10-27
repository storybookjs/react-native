import { optionOrAlt } from '../../../components/src/treeview/utils';

export const isSetEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));

export const parseKey = ({ altKey, ctrlKey, key, metaKey, shiftKey }) => {
  if (altKey) {
    return 'alt';
  }
  if (ctrlKey) {
    return 'control';
  }
  if (metaKey) {
    return 'meta';
  }
  if (shiftKey) {
    return 'shift';
  }
  if (key === 'Enter') {
    return 'enter';
  }
  if (key === ' ') {
    return 'space';
  }
  return key;
};

export const keyToSymbol = key => {
  if (key === 'alt') {
    return optionOrAlt();
  }
  if (key === 'control') {
    return '⌃';
  }
  if (key === 'meta') {
    return '⌘';
  }
  if (key === 'shift') {
    return '⇧​';
  }
  if (key === 'enter') {
    return '⏎';
  }
  if (key === ' ') {
    return 'SPACE';
  }
  if (key === 'ArrowUp') {
    return '▲';
  }
  if (key === 'ArrowDown') {
    return '▼';
  }
  if (key === 'ArrowLeft') {
    return '◀︎';
  }
  if (key === 'ArrowRight') {
    return '▶︎';
  }
  return key.toUpperCase();
};
