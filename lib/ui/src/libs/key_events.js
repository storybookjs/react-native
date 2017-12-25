/* eslint-disable no-fallthrough */
import keycode from 'keycode';

export const features = {
  FULLSCREEN: 'FULLSCREEN',
  ADDON_PANEL: 'ADDON_PANEL',
  STORIES_PANEL: 'STORIES_PANEL',
  SHORTCUTS_HELP: 'SHORTCUTS_HELP',
  ESCAPE: 'ESCAPE',
  NEXT_STORY: 'NEXT_STORY',
  PREV_STORY: 'PREV_STORY',
  SHOW_SEARCH: 'SHOW_SEARCH',
  ADDON_PANEL_IN_RIGHT: 'ADDON_PANEL_IN_RIGHT',
};

export function isModifierPressed(e) {
  return (e.ctrlKey || e.keyCode === 91 || e.metaKey) && e.shiftKey;
}

function focusInInput(e) {
  return (
    /input|textarea/i.test(e.target.tagName) || e.target.getAttribute('contenteditable') !== null
  );
}

export default function handle(e) {
  if (e.keyCode === keycode('escape')) {
    // We don't need to preventDefault escape.
    // Just getting the event is enough for us.
    return features.ESCAPE;
  }
  if (focusInInput(e)) {
    // if we're focused in an element that accepts input,
    // then we shouldn't perform a shortcut action
    return false;
  }

  if (!isModifierPressed(e)) return false;

  switch (e.keyCode) {
    case keycode('F'):
      e.preventDefault();
      return features.FULLSCREEN;
    case keycode('C'):
    // backward-compatibility
    case keycode('D'):
      e.preventDefault();
      return features.ADDON_PANEL;
    case keycode('X'):
    // backward-compatibility
    case keycode('L'):
      e.preventDefault();
      return features.STORIES_PANEL;
    case keycode('right'):
      e.preventDefault();
      return features.NEXT_STORY;
    case keycode('left'):
      e.preventDefault();
      return features.PREV_STORY;
    case keycode('O'):
    // backward-compatibility
    case keycode('P'):
      e.preventDefault();
      return features.SHOW_SEARCH;
    case keycode('G'):
    // backward-compatibility
    case keycode('J'):
      e.preventDefault();
      return features.ADDON_PANEL_IN_RIGHT;
    default:
      return false;
  }
}
