import keycode from 'keycode';
import Events from '@storybook/core-events';

export const features = {
  FULLSCREEN: 'FULLSCREEN',
  PANEL_VISIBILITY: 'PANEL_VISIBILITY',
  NAV_VISIBILITY: 'NAV_VISIBILITY',
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
};

function focusInInput(e) {
  return (
    /input|textarea/i.test(e.target.tagName) || e.target.getAttribute('contenteditable') !== null
  );
}

export default function handle(e) {
  if (e.keyCode === keycode('escape')) {
    return features.ESCAPE;
  }
  if (focusInInput(e)) {
    // if we're focused in an element that accepts input,
    // then we shouldn't perform a shortcut action
    return false;
  }

  if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
    switch (e.keyCode) {
      case keycode('right'):
        e.preventDefault();
        return features.NEXT_STORY;
      case keycode('left'):
        e.preventDefault();
        return features.PREV_STORY;
      case keycode('up'):
        e.preventDefault();
        return features.PREV_COMPONENT;
      case keycode('down'):
        e.preventDefault();
        return features.NEXT_COMPONENT;
      default: {
        //
      }
    }
  }

  switch (e.keyCode) {
    case keycode('F'):
      e.preventDefault();
      return features.FULLSCREEN;
    case keycode(','):
      e.preventDefault();
      return features.ABOUT;
    case keycode('S'):
      e.preventDefault();
      return features.PANEL_VISIBILITY;
    case keycode('D'):
      e.preventDefault();
      return features.PANEL_POSITION;
    case keycode('A'):
      e.preventDefault();
      return features.NAV_VISIBILITY;
    case keycode('E'):
      e.preventDefault();
      return features.NEXT_STORY;
    case keycode('Q'):
      e.preventDefault();
      return features.PREV_STORY;
    case 191: // slash
      e.preventDefault();
      return features.FOCUS_SEARCH;
    case keycode('1'):
      e.preventDefault();
      return features.FOCUS_NAV;
    case keycode('2'):
      e.preventDefault();
      return features.FOCUS_IFRAME;
    case keycode('3'):
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
