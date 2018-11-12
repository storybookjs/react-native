import { localStorage } from 'global';

export const get = item => {
  try {
    const val = localStorage.getItem(item);
    return val ? JSON.parse(val) : false;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const setAll = (itemToSet, changes) => {
  try {
    const serializedChanges = JSON.stringify(changes);
    localStorage.setItem(itemToSet, serializedChanges);
  } catch (e) {
    console.error(e);
  }
};

export const setItem = (itemToSet, key, val) => {
  const changes = get(itemToSet);
  changes[key] = val;
  try {
    const serializedChanges = JSON.stringify(changes);
    localStorage.setItem(itemToSet, serializedChanges);
  } catch (e) {
    console.error(e);
  }
};
