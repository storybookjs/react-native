// eslint-disable-next-line no-unused-vars
import React from 'react';
import { objectOf, string } from 'prop-types';
import { controlOrMetaKey, optionOrAltSymbol } from '../../../components/src/treeview/utils';
import { get, setAll } from './persist';

export const isShortcutTaken = (arr1, arr2) => JSON.stringify(arr1) === JSON.stringify(arr2);

export const parseKey = e => {
  const keys = [];
  if (e.altKey) {
    keys.push('alt');
  }
  if (e.ctrlKey) {
    keys.push('control');
  }
  if (e.metaKey) {
    keys.push('meta');
  }
  if (e.key && e.key.length === 1 && e.key !== ' ') {
    keys.push(e.key.toUpperCase());
  }
  if (e.shiftKey) {
    keys.push('shift');
  }
  if (e.key === ' ') {
    keys.push('space');
  }
  if (e.key === 'Escape') {
    keys.push('escape');
  }
  if (e.key === 'ArrowRight') {
    keys.push('ArrowRight');
  }
  if (e.key === 'ArrowDown') {
    keys.push('ArrowDown');
  }
  if (e.key === 'ArrowUp') {
    keys.push('ArrowUp');
  }
  if (e.key === 'ArrowLeft') {
    keys.push('ArrowLeft');
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
    error: false,
  },
  togglePanel: {
    value: ['S'],
    error: false,
  },
  panelPosition: {
    value: ['D'],
    error: false,
  },
  navigation: {
    value: ['A'],
    error: false,
  },
  toolbar: {
    value: ['T'],
    error: false,
  },
  search: {
    value: ['/'],
    error: false,
  },
  focusNav: {
    value: ['1'],
    error: false,
  },
  focusIframe: {
    value: ['2'],
    error: false,
  },
  focusPanel: {
    value: ['3'],
    error: false,
  },
  prevComponent: {
    value: ['alt', 'ArrowUp'],
    error: false,
  },
  nextComponent: {
    value: ['alt', 'ArrowDown'],
    error: false,
  },
  prevStory: {
    value: ['alt', 'ArrowLeft'],
    error: false,
  },
  nextStory: {
    value: ['alt', 'ArrowRight'],
    error: false,
  },
  shortcutsPage: {
    value: ['shift', ',', controlOrMetaKey()],
    error: false,
  },
  aboutPage: {
    value: [','],
    error: false,
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
    (acc, i) => ({ ...acc, [i[0]]: { value: [...i[1]], error: false } }),
    []
  );

export const initShortcutKeys = () => {
  const shortcutKeys = get('shortcutKeys');

  if (!shortcutKeys) {
    setAll('shortcutKeys', serializableKeyboardShortcuts);
  }
  return shortcutKeys;
};

export const mapToKeyEl = inputValue => {
  if (inputValue && inputValue.length > 0) {
    return inputValue.map(k => keyToSymbol(k));
  }
  return undefined;
};
