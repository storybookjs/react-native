/* eslint-disable import/export */
import { logger } from '@storybook/client-logger';
import addons from '@storybook/addons';
import { FORCE_RE_RENDER } from '@storybook/core-events';

interface Hook {
  name: string;
  memoizedState?: any;
  deps?: any[] | undefined;
}

interface Effect {
  create: () => (() => void) | void;
  destroy?: (() => void) | void;
}

type AbstractFunction = (...args: any[]) => any;

const hookListsMap = new WeakMap<AbstractFunction, Hook[]>();
let mountedDecorators = new Set<AbstractFunction>();

let currentHooks: Hook[] = [];
let nextHookIndex = 0;
const getNextHook = () => {
  const hook = currentHooks[nextHookIndex];
  nextHookIndex += 1;
  return hook;
};
let currentPhase: 'MOUNT' | 'UPDATE' | 'NONE' = 'NONE';
let currentEffects: Effect[] = [];
let prevEffects: Effect[] = [];
let currentDecoratorName: string | null = null;
let hasUpdates = false;

const triggerEffects = () => {
  // destroy removed effects
  prevEffects.forEach(effect => {
    if (!currentEffects.includes(effect) && effect.destroy) {
      effect.destroy();
    }
  });
  // trigger added effects
  currentEffects.forEach(effect => {
    if (!prevEffects.includes(effect)) {
      // eslint-disable-next-line no-param-reassign
      effect.destroy = effect.create();
    }
  });
  prevEffects = currentEffects;
  currentEffects = [];
};

const hookify = (fn: AbstractFunction) => (...args: any[]) => {
  currentDecoratorName = fn.name;
  if (mountedDecorators.has(fn)) {
    currentPhase = 'UPDATE';
    currentHooks = hookListsMap.get(fn) || [];
  } else {
    currentPhase = 'MOUNT';
    currentHooks = [];
    hookListsMap.set(fn, currentHooks);
  }
  nextHookIndex = 0;

  const result = fn(...args);

  if (currentPhase === 'UPDATE' && getNextHook() != null) {
    throw new Error(
      'Rendered fewer hooks than expected. This may be caused by an accidental early return statement.'
    );
  }

  currentDecoratorName = null;
  return result;
};

// Counter to prevent infinite loops.
let numberOfRenders = 0;
const RENDER_LIMIT = 25;
export const applyHooks = (
  applyDecorators: (storyFn: AbstractFunction, decorators: AbstractFunction[]) => any
) => (storyFn: AbstractFunction, decorators: AbstractFunction[]) => {
  const decorated = applyDecorators(hookify(storyFn), decorators.map(hookify));
  return (...args: any[]) => {
    hasUpdates = false;
    let result = decorated(...args);
    mountedDecorators = new Set([storyFn, ...decorators]);
    numberOfRenders = 1;
    while (hasUpdates) {
      hasUpdates = false;
      result = decorated(...args);
      numberOfRenders += 1;
      if (numberOfRenders > RENDER_LIMIT) {
        throw new Error(
          'Too many re-renders. Storybook limits the number of renders to prevent an infinite loop.'
        );
      }
    }
    currentPhase = 'NONE';
    triggerEffects();
    return result;
  };
};

const areDepsEqual = (deps: any[], nextDeps: any[]) =>
  deps.length === nextDeps.length && deps.every((dep, i) => dep === nextDeps[i]);

function useHook(name: string, callback: (hook: Hook) => void, deps?: any[] | undefined): Hook {
  if (currentPhase === 'MOUNT') {
    if (deps != null && !Array.isArray(deps)) {
      logger.warn(
        `${name} received a final argument that is not an array (instead, received ${deps}). When specified, the final argument must be an array.`
      );
    }
    const hook: Hook = { name, deps };
    currentHooks.push(hook);
    callback(hook);
    return hook;
  }

  if (currentPhase === 'UPDATE') {
    const hook = getNextHook();
    if (hook == null) {
      throw new Error('Rendered more hooks than during the previous render.');
    }

    if (hook.name !== name) {
      logger.warn(
        `Storybook has detected a change in the order of Hooks${
          currentDecoratorName ? ` called by ${currentDecoratorName}` : ''
        }. This will lead to bugs and errors if not fixed.`
      );
    }

    if (deps != null && hook.deps == null) {
      logger.warn(
        `${name} received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.`
      );
    }

    if (deps != null && hook.deps != null && deps.length !== hook.deps.length) {
      logger.warn(`The final argument passed to ${name} changed size between renders. The order and size of this array must remain constant.
Previous: ${hook.deps}
Incoming: ${deps}`);
    }

    if (deps == null || hook.deps == null || !areDepsEqual(deps, hook.deps)) {
      callback(hook);
      hook.deps = deps;
    }
    return hook;
  }

  throw new Error(
    'Storybook preview hooks can only be called inside decorators and story functions.'
  );
}

function useMemoLike<T>(name: string, nextCreate: () => T, deps: any[] | undefined): T {
  const { memoizedState } = useHook(
    name,
    hook => {
      // eslint-disable-next-line no-param-reassign
      hook.memoizedState = nextCreate();
    },
    deps
  );
  return memoizedState;
}

export function useMemo<T>(nextCreate: () => T, deps?: any[]): T {
  return useMemoLike('useMemo', nextCreate, deps);
}

export function useCallback<T>(callback: T, deps?: any[]): T {
  return useMemoLike('useCallback', () => callback, deps);
}

function useRefLike<T>(name: string, initialValue: T): { current: T } {
  return useMemoLike(name, () => ({ current: initialValue }), []);
}

export function useRef<T>(initialValue: T): { current: T } {
  return useRefLike('useRef', initialValue);
}

function triggerUpdate() {
  // Rerun storyFn if updates were triggered synchronously, force rerender otherwise
  if (currentPhase !== 'NONE') {
    hasUpdates = true;
  } else {
    try {
      addons.getChannel().emit(FORCE_RE_RENDER);
    } catch (e) {
      logger.warn('State updates of Storybook preview hooks work only in browser');
    }
  }
}

function useStateLike<S>(
  name: string,
  initialState: (() => S) | S
): [S, (update: ((prevState: S) => S) | S) => void] {
  const stateRef = useRefLike(
    name,
    // @ts-ignore S type should never be function, but there's no way to tell that to TypeScript
    typeof initialState === 'function' ? initialState() : initialState
  );
  const setState = (update: ((prevState: S) => S) | S) => {
    // @ts-ignore S type should never be function, but there's no way to tell that to TypeScript
    stateRef.current = typeof update === 'function' ? update(stateRef.current) : update;
    triggerUpdate();
  };
  return [stateRef.current, setState];
}

export function useState<S>(
  initialState: (() => S) | S
): [S, (update: ((prevState: S) => S) | S) => void] {
  return useStateLike('useState', initialState);
}

export function useReducer<S, A>(
  reducer: (state: S, action: A) => S,
  initialState: S
): [S, (action: A) => void];
export function useReducer<S, I, A>(
  reducer: (state: S, action: A) => S,
  initialArg: I,
  init: (initialArg: I) => S
): [S, (action: A) => void];
export function useReducer<S, A>(
  reducer: (state: S, action: A) => S,
  initialArg: any,
  init?: any
): [S, (action: A) => void] {
  const initialState: (() => S) | S = init != null ? () => init(initialArg) : initialArg;
  const [state, setState] = useStateLike('useReducer', initialState);
  const dispatch = (action: A) => setState(prevState => reducer(prevState, action));
  return [state, dispatch];
}

export function useEffect(create: () => (() => void) | void, deps?: any[]): void {
  const effect = useMemoLike('useEffect', () => ({ create }), deps);
  currentEffects.push(effect);
}
