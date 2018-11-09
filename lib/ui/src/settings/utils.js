import { controlOrMetaKey, optionOrAltSymbol } from '../../../components/src/treeview/utils';

export const isSetEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));

export const parseKey = e => {
  console.log('parseKey');
  if (e.altKey) {
    return 'alt';
  }
  if (e.ctrlKey) {
    return 'control';
  }
  if (e.metaKey) {
    return 'meta';
  }
  if (e.shiftKey) {
    return 'shift';
  }
  if (e.key === 'Enter') {
    return 'enter';
  }
  if (e.key === ' ') {
    return 'space';
  }
  if (e.key === 'Escape') {
    return 'escape';
  }
  if (e.key && e.key.length === 1) {
    return e.key.toUpperCase();
  }
  return e.key;
};

export const keyToSymbol = key => {
  if (key === 'alt') {
    return optionOrAltSymbol();
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
  if (key === 'escape') {
    return 'esc';
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

export const defaultHotkeys = Object.freeze({
  fullScreen: new Set(['F']),
  togglePanel: new Set(['S']), // Panel visibility
  panelPosition: new Set(['D']),
  navigation: new Set(['A']),
  search: new Set(['/']),
  focusNav: new Set(['1']),
  focusIframe: new Set(['2']),
  focusPanel: new Set(['3']),
  prevComponent: new Set(['alt', 'ArrowUp']),
  nextComponent: new Set(['alt', 'ArrowDown']),
  prevStory: new Set(['alt', 'ArrowLeft']),
  nextStory: new Set(['alt', 'ArrowRight']),
  shortcutsPage: new Set(['shift', ',', controlOrMetaKey()]),
  aboutPage: new Set([',']),
});

export const defaultKeyboardShortcuts = Object.freeze({
  fullScreen: new Set(['F']),
  togglePanel: new Set(['S']), // Panel visibility
  panelPosition: new Set(['D']),
  navigation: new Set(['A']),
  search: new Set(['/']),
  focusNav: new Set(['1']),
  focusIframe: new Set(['2']),
  focusPanel: new Set(['3']),
  prevComponent: new Set(['alt', 'ArrowUp']),
  nextComponent: new Set(['alt', 'ArrowDown']),
  prevStory: new Set(['alt', 'ArrowLeft']),
  nextStory: new Set(['alt', 'ArrowRight']),
  shortcutsPage: new Set(['shift', ',', controlOrMetaKey()]),
  aboutPage: new Set([',']),
});
