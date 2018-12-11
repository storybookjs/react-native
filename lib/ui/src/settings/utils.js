import React from 'react';
import { objectOf, string } from 'prop-types';
import { controlOrMetaKey, optionOrAltSymbol } from '../../../components/src/treeview/utils';
import { get, setAll } from './persist';
import { Key } from './components';

export const isSetEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));

export const parseKey = e => {
  if (e.key === 'Enter' || e.key === 'Backspace' || e.key === 'Tab') {
    return e.key;
  }
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
    return '↑';
  }
  if (key === 'ArrowDown') {
    return '↓';
  }
  if (key === 'ArrowLeft') {
    return '←';
  }
  if (key === 'ArrowRight') {
    return '→';
  }
  return key.toUpperCase();
};

export const labelsArr = [
  'Go full screen',
  'Toggle panel',
  'Toggle panel position',
  'Toggle navigation',
  'Toggle toolbar',
  'Focus search',
  'Focus navigation',
  'Focus iFrame',
  'Focus panel',
  'Previous component',
  'Next component',
  'Previous story',
  'Next story',
  'Go to shortcuts page',
  'Go to about page',
];
export const defaultShortcutSets = Object.freeze({
  fullScreen: {
    value: new Set(['F']),
    error: '',
  },
  togglePanel: {
    value: new Set(['S']),
    error: '',
  },
  panelPosition: {
    value: new Set(['D']),
    error: '',
  },
  navigation: {
    value: new Set(['A']),
    error: '',
  },
  toolbar: {
    value: new Set(['T']),
    error: '',
  },
  search: {
    value: new Set(['/']),
    error: '',
  },
  focusNav: {
    value: new Set(['1']),
    error: '',
  },
  focusIframe: {
    value: new Set(['2']),
    error: '',
  },
  focusPanel: {
    value: new Set(['3']),
    error: '',
  },
  prevComponent: {
    value: new Set(['alt', 'ArrowUp']),
    error: '',
  },
  nextComponent: {
    value: new Set(['alt', 'ArrowDown']),
    error: '',
  },
  prevStory: {
    value: new Set(['alt', 'ArrowLeft']),
    error: '',
  },
  nextStory: {
    value: new Set(['alt', 'ArrowRight']),
    error: '',
  },
  shortcutsPage: {
    value: new Set(['shift', ',', controlOrMetaKey()]),
    error: '',
  },
  aboutPage: {
    value: new Set([',']),
    error: '',
  },
});

export const serializableKeyboardShortcuts = {
  fullScreen: ['F'],
  togglePanel: ['S'], // Panel visibiliy
  panelPosition: ['D'],
  navigation: ['A'],
  toolbar: ['T'],
  search: ['/'],
  focusNav: ['1'],
  focusIframe: ['2'],
  focusPanel: ['3'],
  prevComponent: ['alt', 'ArrowUp'],
  nextComponent: ['alt', 'ArrowDown'],
  prevStory: ['alt', 'ArrowLeft'],
  nextStory: ['alt', 'ArrowRight'],
  shortcutsPage: ['shift', ',', controlOrMetaKey()],
  aboutPage: [','],
};

export const shortcutKeyShape = {
  fullScreen: objectOf(string).isRequired,
  togglePanel: objectOf(string).isRequired,
  panelPosition: objectOf(string).isRequired,
  navigation: objectOf(string).isRequired,
  toolbar: objectOf(string).isRequired,
  search: objectOf(string).isRequired,
  focusNav: objectOf(string).isRequired,
  focusIframe: objectOf(string).isRequired,
  focusPanel: objectOf(string).isRequired,
  prevComponent: objectOf(string).isRequired,
  nextComponent: objectOf(string).isRequired,
  prevStory: objectOf(string).isRequired,
  nextStory: objectOf(string).isRequired,
  shortcutsPage: objectOf(string).isRequired,
  aboutPage: objectOf(string).isRequired,
};

export const serializedLocalStorage = obj =>
  Object.entries(obj).reduce(
    (acc, i) => ({ ...acc, [i[0]]: { value: new Set(i[1]), error: false } }),
    {}
  );

export const initShortcutKeys = () => {
  const shortcutKeys = get('shortcutKeys');

  if (!shortcutKeys) {
    setAll('shortcutKeys', serializableKeyboardShortcuts);
  }
  return shortcutKeys;
};

export const mapToKeyEl = inputValue => {
  if (inputValue && inputValue.size > 0) {
    return Array.from(inputValue).map(k => <Key>{keyToSymbol(k)}</Key>);
  }
  return undefined;
};
