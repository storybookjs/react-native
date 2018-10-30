import { localStorage } from 'global';

export const getShortcut = shortcut => localStorage.getItem(shortcut);
export const setShortcut = shortcut => localStorage.getItem(shortcut);
