import { Platform } from 'react-native';
import {
  composeConfigs,
  addons as previewAddons,
  View as PreviewView,
  PreviewWithSelection,
  SelectionStore,
} from 'storybook/internal/preview-api';
import { addons as managerAddons } from 'storybook/manager-api';
import './polyfill';

import type { ReactRenderer } from '@storybook/react';
import { Channel } from 'storybook/internal/channels';
import { STORY_RENDER_PHASE_CHANGED } from 'storybook/internal/core-events';
import type {
  Addon_StorySortParameterV7,
  Args,
  ModuleExports,
  NormalizedProjectAnnotations,
  NormalizedStoriesSpecifier,
  ProjectAnnotations,
} from 'storybook/internal/types';
import { View } from './View';
import { remountStoryRoot, waitForStoryRoot } from './components/StoryView/storyRoot';
import type { RNElement } from './test/elements';
import { prepareStories, type ReactNativeOptions } from './prepareStories';
export { prepareStories, type ReactNativeOptions } from './prepareStories';

type StoryEntry = NormalizedStoriesSpecifier & {
  req: {
    keys(): string[];
    (id: string): unknown;
  };
};

const createPreviewRoot = (): ReactRenderer['canvasElement'] =>
  ({
    component: () => <></>,
    canvasElement: null,
    mount: () => Promise.resolve({}),
    storyResult: null,
    T: null,
  }) as unknown as ReactRenderer['canvasElement'];

const getReactNativeProjectAnnotations = (getView: () => View | undefined) =>
  ({
    renderToCanvas: (context) => {
      if (globalThis.FEATURES?.ondeviceInteractions && context.forceRemount) {
        remountStoryRoot();
      }
      getView()?._setStory(context.storyContext);
    },
    render: (args, context) => {
      const { id, component: Component } = context;

      if (!Component) {
        throw new Error(
          `Unable to render story ${id} as the component annotation is missing from the default export`
        );
      }

      return <Component {...args} />;
    },
  }) satisfies ProjectAnnotations<ReactRenderer>;

type Mount = NonNullable<ProjectAnnotations<ReactRenderer>['mount']>;

/**
 * Gives play functions the story's root host element as `canvasElement`, and like the web, `canvas`
 * (queries scoped to it) and `userEvent` from `@storybook/react-native/test`. `mount()` resolves
 * with `canvas`, as it does on the web.
 */
const interactionsProjectAnnotations = {
  mount: ((context) => async () => {
    await context.renderToCanvas();
    const root = await waitForStoryRoot(context.id);
    // The ref attaches before the story's effects run, so wait a tick for them.
    await new Promise((resolve) => setTimeout(resolve, 0));
    context.canvasElement = root as ReactRenderer['canvasElement'];
    if (!root) return root;

    const { createInstrumentedCanvas, createInstrumentedUserEvent } =
      require('./test') as typeof import('./test');
    const canvas = createInstrumentedCanvas(root as RNElement);
    Object.assign(context, { canvas, userEvent: createInstrumentedUserEvent() });
    return canvas;
  }) as Mount,
} satisfies ProjectAnnotations<ReactRenderer>;

const getBuiltInProjectAnnotations = (getView: () => View | undefined) =>
  globalThis.FEATURES?.ondeviceInteractions
    ? [getReactNativeProjectAnnotations(getView), interactionsProjectAnnotations]
    : [getReactNativeProjectAnnotations(getView)];

/**
 * Since we aren't supporting  these web addons yet in react native (or reimplement them) then we should disable them
 * to avoid running code for addons that are not supported.
 */
globalThis.FEATURES = Object.assign(globalThis.FEATURES ?? {}, {
  measure: false,
  outline: false,
  interactions: false,
  viewport: false,
  highlight: false,
  backgrounds: false,
});

/** The parts of Storybook's `StoryRender`, which isn't exported, that cancelling a run uses. */
type RunnableRender = {
  renderId: number;
  isPending: () => boolean;
  cancelRender: () => void;
};

type TeardownRenderArgs = Parameters<PreviewWithSelection<ReactRenderer>['teardownRender']>;

/**
 * Storybook's renderSelection is not safe to run concurrently: when Fast Refresh updates, story selection or
 * remote control overlap, a torn-down render can be left in `storyRenders`, which then breaks args updates.
 * This runs them one at a time.
 */
class ReactNativePreview extends PreviewWithSelection<ReactRenderer> {
  private renderSelectionQueue: Promise<unknown> = Promise.resolve();

  protected renderSelection(options?: { persistedArgs?: Args }): Promise<void> {
    const run = this.renderSelectionQueue.then(() => super.renderSelection(options));
    this.renderSelectionQueue = run.catch(() => {});
    return run;
  }

  // Storybook tears down a story that is still rendering (e.g. its loaders are running) by waiting briefly and then
  // reloading the page, which restarts the app in Expo and never resolves elsewhere in React Native. Abort the render
  // instead: once its loaders finish it sees the abort and doesn't draw.
  async teardownRender(...[render, options]: TeardownRenderArgs) {
    if (render && 'isPending' in render && render.isPending()) {
      this.storyRenders = this.storyRenders.filter((r) => r !== render);
      render.torndown = true;
      render.cancelRender();
      if (render.story) await this.storyStoreValue?.cleanupStory(render.story);
      return;
    }

    await super.teardownRender(render, options);
  }

  private forceRemountId = 0;

  // Storybook's `StoryRender.remount()` waits for a running play function by reloading the page, so
  // pressing Rerun in the Interactions panel during a run would wait forever. Cancel the run, wait
  // for it to end and then remount. When remounts come in quick succession, only the last one runs.
  async onForceRemount({ storyId }: { storyId: string }) {
    if (!globalThis.FEATURES?.ondeviceInteractions) {
      return super.onForceRemount({ storyId });
    }

    const forceRemountId = ++this.forceRemountId;
    // Docs renders don't have play functions, so only story renders are rerun.
    const renders = this.storyRenders.flatMap((render) =>
      render.id === storyId && 'remount' in render ? [render] : []
    );
    await Promise.all(renders.map((render) => cancelRun(this.channel, render)));
    if (forceRemountId !== this.forceRemountId) return;
    await Promise.all(renders.map((render) => render.remount()));
  }
}

/**
 * Cancels a story's run and resolves once it has ended. A cancelled run ends with an "aborted",
 * "errored" or "finished" phase change as soon as its play function returns.
 */
function cancelRun(channel: Channel, render: RunnableRender) {
  if (!render.isPending()) return Promise.resolve();

  return new Promise<void>((resolve) => {
    const onPhaseChanged = ({ renderId, newPhase }: { renderId: number; newPhase: string }) => {
      if (renderId !== render.renderId || !['aborted', 'errored', 'finished'].includes(newPhase)) {
        return;
      }
      channel.off(STORY_RENDER_PHASE_CHANGED, onPhaseChanged);
      // The phase change is emitted from inside `StoryRender.render()`, which still updates the
      // render before returning, so remount after it.
      setTimeout(resolve, 0);
    };
    channel.on(STORY_RENDER_PHASE_CHANGED, onPhaseChanged);
    render.cancelRender();
  });
}

// Note this is a workaround for setImmediate not being defined
if (Platform.OS === 'web' && typeof globalThis.setImmediate === 'undefined') {
  require('setimmediate');
}

export const getProjectAnnotations =
  (view: View, annotations: ModuleExports[]) =>
  async (): Promise<NormalizedProjectAnnotations<ReactRenderer>> =>
    composeConfigs<ReactRenderer>([...getBuiltInProjectAnnotations(() => view), ...annotations]);

export function start({
  annotations,
  storyEntries,
  options,
  storySorts,
}: {
  storyEntries: StoryEntry[];
  annotations: ModuleExports[];
  options?: ReactNativeOptions;
  /** The `storySorts` from main, written into the requires file by the generator. */
  storySorts?: Addon_StorySortParameterV7[];
}) {
  const { index, importMap } = prepareStories({
    storyEntries,
    options,
    storySorts,
  });

  // const channel = createBrowserChannel({ page: 'preview' });
  const channel = new Channel({});

  managerAddons.setChannel(channel);
  previewAddons.setChannel(channel);

  if (globalThis.FEATURES?.ondeviceBackgrounds) {
    const { registerBackgroundsAddon } = require('./backgrounds/register');
    registerBackgroundsAddon();
  }

  if (globalThis.FEATURES?.ondeviceInteractions) {
    const { registerInteractionsAddon } = require('./interactions/register');
    const { patchElementsForInstrumenter } = require('./interactions/patchElements');
    registerInteractionsAddon();
    patchElementsForInstrumenter();
  }

  const previewView = {
    prepareForStory: () => {
      return createPreviewRoot();
    },
    prepareForDocs: () => {
      return createPreviewRoot();
    },
    showErrorDisplay: (e: { message?: string; stack?: string }) => {
      console.log(e);
    },
    showDocs: () => {},
    showMain: () => {},
    showNoPreview: () => {},
    showPreparingDocs: () => {},
    showPreparingStory: () => {},
    showStory: () => {},
    showStoryDuringRender: () => {},
  } satisfies PreviewView<ReactRenderer['canvasElement']>;

  const selectionStore = {
    selection: null as unknown as SelectionStore['selection'],
    selectionSpecifier: null,
    setQueryParams: () => {},
    setSelection: (selection: NonNullable<SelectionStore['selection']>) => {
      preview.selectionStore.selection = selection;
    },
  } satisfies SelectionStore;

  let view: View;

  const getProjectAnnotationsInitial = async (): Promise<
    NormalizedProjectAnnotations<ReactRenderer>
  > => composeConfigs<ReactRenderer>([...getBuiltInProjectAnnotations(() => view), ...annotations]);

  const preview: PreviewWithSelection<ReactRenderer> = new ReactNativePreview(
    async (importPath: string) => importMap[importPath],
    getProjectAnnotationsInitial,
    selectionStore,
    previewView
  );

  view = new View(preview, channel, options);

  if (global) {
    const storybookGlobal = global as typeof globalThis & {
      __STORYBOOK_ADDONS_CHANNEL__?: Channel;
      __STORYBOOK_PREVIEW__?: PreviewWithSelection<ReactRenderer>;
    };

    storybookGlobal.__STORYBOOK_ADDONS_CHANNEL__ = channel;
    storybookGlobal.__STORYBOOK_PREVIEW__ = preview;
  }

  view._storyIndex = index;

  preview.getStoryIndexFromServer = async () => view._storyIndex;

  return view;
}

export function updateView(
  viewInstance: View,
  annotations: ModuleExports[],
  normalizedStories: StoryEntry[],
  options?: ReactNativeOptions,
  storySorts?: Addon_StorySortParameterV7[]
) {
  const { importMap, index } = prepareStories({
    storyEntries: normalizedStories,
    options,
    storySorts,
  });

  // Like Storybook's web builders on HMR, stop any running play function so the story can re-render
  viewInstance._preview.onStoryHotUpdated();

  viewInstance._preview.onStoriesChanged({
    importFn: async (importPath: string) => importMap[importPath],
  });

  viewInstance._preview.onGetProjectAnnotationsChanged({
    getProjectAnnotations: getProjectAnnotations(viewInstance, annotations),
  });

  viewInstance._storyIndex = index;
  viewInstance._preview.onStoryIndexChanged().then(() => {
    viewInstance.createPreparedStoryMapping().then(() => viewInstance._forceRerender());
  });
}
