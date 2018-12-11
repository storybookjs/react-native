import Events from '@storybook/core-events';
import { localStorage } from 'global';
import { parseKey } from '../settings/utils';

export const features = {
  FULLSCREEN: 'FULLSCREEN',
  PANEL_VISIBILITY: 'PANEL_VISIBILITY',
  NAV_VISIBILITY: 'NAV_VISIBILITY',
  TOOL_VISIBILITY: 'TOOL_VISIBILITY',
  SHORTCUTS_HELP: 'SHORTCUTS_HELP',
  ESCAPE: 'ESCAPE',
  NEXT_STORY: 'NEXT_STORY',
  PREV_STORY: 'PREV_STORY',
  NEXT_COMPONENT: 'NEXT_COMPONENT',
  PREV_COMPONENT: 'PREV_COMPONENT',
  FOCUS_SEARCH: 'FOCUS_SEARCH',
  FOCUS_NAV: 'FOCUS_NAV',
  FOCUS_IFRAME: 'FOCUS_IFRAME',
  FOCUS_PANEL: 'FOCUS_PANEL',
  PANEL_POSITION: 'PANEL_POSITION',
  SHORTCUTS: 'SHORTCUTS',
};

function focusInInput(e) {
  return (
    /input|textarea/i.test(e.target.tagName) || e.target.getAttribute('contenteditable') !== null
  );
}

const pressed = {
  fullScreen: [],
  togglePanel: [],
  panelPosition: [],
  navigation: [],
  toolbar: [],
  search: [],
  focusNav: [],
  focusIframe: [],
  focusPanel: [],
  prevComponent: [],
  nextComponent: [],
  prevStory: [],
  nextStory: [],
  shortcutsPage: [],
  aboutPage: [],
};

const addKeyToTempShortcutArr = (shortcutName, shortcutKeys = {}, parsedEvent) => {
  if (shortcutKeys[shortcutName]) {
    const hotkeys = Array.from(shortcutKeys[shortcutName]);
    pressed[shortcutName].push(parsedEvent);

    pressed[shortcutName].splice(
      -hotkeys.length - 1,
      pressed[shortcutName].length - hotkeys.length
    );

    const stringified = pressed[shortcutName];

    return stringified.join('') === hotkeys.join('');
  }
};

export default function handle(e) {
  const shortcutKeys = JSON.parse(localStorage.getItem('shortcutKeys'));
  if (e.key === 'Escape') {
    return features.ESCAPE;
  }
  if (focusInInput(e)) {
    // if we're focused in an element that accepts input,
    // then we shouldn't perform a shortcut action
    return false;
  }
  const parsedEvent = parseKey(e);

  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 188) {
    return features.SHORTCUTS;
  }

  if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
    switch (!!parsedEvent) {
      case addKeyToTempShortcutArr('nextStory', shortcutKeys, parsedEvent):
        e.preventDefault();
        return features.NEXT_STORY;
      case addKeyToTempShortcutArr('prevStory', shortcutKeys, parsedEvent):
        e.preventDefault();
        return features.PREV_STORY;
      case addKeyToTempShortcutArr('prevComponent', shortcutKeys, parsedEvent):
        e.preventDefault();
        return features.PREV_COMPONENT;
      case addKeyToTempShortcutArr('nextComponent', shortcutKeys, parsedEvent):
        e.preventDefault();
        return features.NEXT_COMPONENT;
      default: {
        //
      }
    }
  }

  switch (!!parsedEvent) {
    case addKeyToTempShortcutArr('fullScreen', shortcutKeys, parsedEvent):
      e.preventDefault();
      return features.FULLSCREEN;
    case addKeyToTempShortcutArr('aboutPage', shortcutKeys, parsedEvent):
      e.preventDefault();
      return features.ABOUT;
    case addKeyToTempShortcutArr('togglePanel', shortcutKeys, parsedEvent):
      e.preventDefault();
      return features.PANEL_VISIBILITY;
    case addKeyToTempShortcutArr('panelPosition', shortcutKeys, parsedEvent):
      e.preventDefault();
      return features.PANEL_POSITION;
    case addKeyToTempShortcutArr('navigation', shortcutKeys, parsedEvent):
      e.preventDefault();
      return features.NAV_VISIBILITY;
    case addKeyToTempShortcutArr('toolbar', shortcutKeys, parsedEvent):
      e.preventDefault();
      return features.TOOL_VISIBILITY;
    case addKeyToTempShortcutArr('search', shortcutKeys, parsedEvent):
      e.preventDefault();
      return features.FOCUS_SEARCH;
    case addKeyToTempShortcutArr('focusNav', shortcutKeys, parsedEvent):
      e.preventDefault();
      return features.FOCUS_NAV;
    case addKeyToTempShortcutArr('focusIframe', shortcutKeys, parsedEvent):
      e.preventDefault();
      return features.FOCUS_IFRAME;
    case addKeyToTempShortcutArr('focusPanel', shortcutKeys, parsedEvent):
      e.preventDefault();
      return features.FOCUS_PANEL;
    default:
      return false;
  }
}

// window.keydown handler to dispatch a key event to the preview channel
export function handleKeyboardShortcuts(channel) {
  return event => {
    const parsedEvent = handle(event);
    if (parsedEvent) {
      channel.emit(Events.APPLY_SHORTCUT, { event: parsedEvent });
    }
  };
}
