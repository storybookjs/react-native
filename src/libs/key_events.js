import keycode from 'keycode';

export const features = {
  FULLSCREEN: 1,
  DOWN_PANEL: 2,
  LEFT_PANEL: 3,
  SHORTCUTS_HELP: 4,
  ESCAPE: 5,
  NEXT_STORY: 6,
  PREV_STORY: 7,
};

export function isModifierPressed(e) {
  return (e.ctrlKey || e.keyCode === 91 || e.metaKey) && e.shiftKey;
}

export default function handle(e) {
  if (e.keyCode === keycode('escape')) {
    // We don't need to preventDefault escape.
    // Just getting the event is enough for us.
    return features.ESCAPE;
  }

  if (!isModifierPressed(e)) return false;

  switch (e.keyCode) {
    case keycode('F'):
      e.preventDefault();
      return features.FULLSCREEN;
    case keycode('D'):
      e.preventDefault();
      return features.DOWN_PANEL;
    case keycode('L'):
      e.preventDefault();
      return features.LEFT_PANEL;
    case keycode('right'):
      e.preventDefault();
      return features.NEXT_STORY;
    case keycode('left'):
      e.preventDefault();
      return features.PREV_STORY;
    default:
      return false;
  }
}
