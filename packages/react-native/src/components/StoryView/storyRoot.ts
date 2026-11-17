/**
 * Tracks the host element that wraps the rendered story, so the `mount` annotation can hand it to
 * play functions as `canvasElement`. Only used with `features.ondeviceInteractions`.
 */

type StoryRoot = { id?: string; element: unknown };

let storyRoot: StoryRoot = { element: null };
const listeners = new Set<() => void>();

/** Bumped on each forced remount. It's part of the story wrapper's key, so the story remounts. */
let storyMountKey = 0;

export function getStoryMountKey() {
  return storyMountKey;
}

export function remountStoryRoot() {
  storyMountKey += 1;
  storyRoot = { element: null };
}

export function setStoryRoot(id: string | undefined, element: unknown) {
  if (element) {
    storyRoot = { id, element };
  } else if (storyRoot.id === id) {
    storyRoot = { element: null };
  }
  listeners.forEach((listener) => listener());
}

/** Resolves with the story's root element once it mounts, or `null` after `timeoutMs`. */
export function waitForStoryRoot(id: string, timeoutMs = 5000): Promise<unknown> {
  return new Promise((resolve) => {
    const check = () => {
      if (storyRoot.id !== id || !storyRoot.element) return;
      cleanup();
      resolve(storyRoot.element);
    };
    const timeout = setTimeout(() => {
      cleanup();
      console.warn(`Story ${id} did not mount a root element within ${timeoutMs}ms`);
      resolve(null);
    }, timeoutMs);
    const cleanup = () => {
      clearTimeout(timeout);
      listeners.delete(check);
    };
    listeners.add(check);
    check();
  });
}
