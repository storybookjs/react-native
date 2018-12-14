import React from 'react';
import { objectOf, string } from 'prop-types';
import { controlOrMetaKey, optionOrAltSymbol } from '../../../components/src/treeview/utils';
import { get, setAll } from './persist';
import { Key } from './components';

export const isSetEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));

export const parseKey = e => {
  const keys = [];
  if (e.key && e.key.length === 1) {
    keys.push(e.key.toUpperCase());
  }
  if (e.altKey && e.key !== 'Alt') {
    keys.push('alt');
  }
  if (e.ctrlKey && e.key !== 'Control') {
    keys.push('control');
  }
  if (e.metaKey && e.key !== 'Meta') {
    keys.push('meta');
  }
  if (e.shiftKey && e.key !== 'Shift') {
    keys.push('shift');
  }
  if (e.key === ' ') {
    keys.push('space');
  }
  if (e.key === 'Escape') {
    keys.push('escape');
  } else {
    keys.push(e.key);
  }
  return keys;
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
  if (key === 'Enter' || key === 'Backspace' || key === 'Esc') {
    return '';
  }
  if (key === 'escape') {
    return '';
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
    value: ['F'],
    error: '',
  },
  togglePanel: {
    value: ['S'],
    error: '',
  },
  panelPosition: {
    value: ['D'],
    error: '',
  },
  navigation: {
    value: ['A'],
    error: '',
  },
  toolbar: {
    value: ['T'],
    error: '',
  },
  search: {
    value: ['/'],
    error: '',
  },
  focusNav: {
    value: ['1'],
    error: '',
  },
  focusIframe: {
    value: ['2'],
    error: '',
  },
  focusPanel: {
    value: ['3'],
    error: '',
  },
  prevComponent: {
    value: ['alt', 'ArrowUp'],
    error: '',
  },
  nextComponent: {
    value: ['alt', 'ArrowDown'],
    error: '',
  },
  prevStory: {
    value: ['alt', 'ArrowLeft'],
    error: '',
  },
  nextStory: {
    value: ['alt', 'ArrowRight'],
    error: '',
  },
  shortcutsPage: {
    value: ['shift', ',', controlOrMetaKey()],
    error: '',
  },
  aboutPage: {
    value: [','],
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
