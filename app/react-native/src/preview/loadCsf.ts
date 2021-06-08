import { ClientApi, ConfigApi, StoryStore } from '@storybook/client-api';
import { logger } from '@storybook/client-logger';
import { isExportStory, storyNameFromExport, toId } from '@storybook/csf';
import './global';

export interface RequireContext {
  keys: () => string[];
  (id: string): any;
  resolve(id: string): string;
}

export type LoadableFunction = () => void | any[];
export type Loadable = RequireContext | RequireContext[] | LoadableFunction;

const deprecatedStoryAnnotationWarning = () =>
  logger.log(`
    CSF .story annotations deprecated; annotate story functions directly:
    - StoryFn.story.name => StoryFn.storyName
    - StoryFn.story.(parameters|decorators) => StoryFn.(parameters|decorators)
    See https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#hoisted-csf-annotations for details and codemod.
`);

const duplicateKindWarning = (kindName: string) => {
  logger.warn(`Duplicate title: '${kindName}'
    Duplicate title used in multiple files; use unique titles or a primary file for a component with re-exported stories.

    https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#deprecated-support-for-duplicate-kinds
  `);
};

global.previousExports = new Map<any, string>();

const loadStories = (
  loadable: Loadable,
  framework: string,
  { clientApi, storyStore }: { clientApi: ClientApi; storyStore: StoryStore }
) => () => {
  // Make sure we don't try to define a kind more than once within the same load
  const loadedKinds = new Set();

  let reqs = null;
  // todo discuss / improve type check
  if (Array.isArray(loadable)) {
    reqs = loadable;
  } else if ((loadable as RequireContext).keys) {
    reqs = [loadable as RequireContext];
  }

  let currentExports = new Map<any, string>();

  // reqs is not null when require context is used,
  // this comes from storybook core client and will never be true in RN
  // keeping this here only to get an idea how the core version could be re-used
  if (reqs) {
    reqs.forEach((req) => {
      req.keys().forEach((filename: string) => {
        try {
          const fileExports = req(filename);
          currentExports.set(
            fileExports,
            // todo discuss: types infer that this is RequireContext; no checks needed?
            // NOTE: turns out `babel-plugin-require-context-hook` doesn't implement this (yet)
            typeof req.resolve === 'function' ? req.resolve(filename) : filename
          );
        } catch (error) {
          logger.warn(`Unexpected error while loading ${filename}: ${error}`);
        }
      });
    });
  } else {
    const exported = (loadable as LoadableFunction)();
    if (Array.isArray(exported)) {
      const csfExports = exported.filter((obj) => obj.default != null);
      currentExports = new Map(csfExports.map((fileExports) => [fileExports, null]));
    } else {
      logger.warn(
        `Loader function passed to 'configure' should return void or an array of module exports that all contain a 'default' export. Received: ${JSON.stringify(
          exported
        )}`
      );
    }
  }
  const removed = Array.from(global.previousExports.keys()).filter(
    (exp) => !currentExports.has(exp)
  );
  removed.forEach((exp: any) => {
    if (exp.default) {
      storyStore.removeStoryKind(exp.default.title);
    }
  });

  const added = Array.from(currentExports.keys()).filter((exp) => !global.previousExports.has(exp));

  added.forEach((fileExports) => {
    // An old-style story file
    if (!fileExports.default) {
      return;
    }

    if (!fileExports.default.title) {
      throw new Error(
        `Unexpected default export without title: ${JSON.stringify(fileExports.default)}`
      );
    }

    const { default: meta, __namedExportsOrder, ...namedExports } = fileExports;
    let exports = namedExports;

    // prefer a user/loader provided `__namedExportsOrder` array if supplied
    // we do this as es module exports are always ordered alphabetically
    // see https://github.com/storybookjs/storybook/issues/9136
    if (Array.isArray(__namedExportsOrder)) {
      exports = {};
      __namedExportsOrder.forEach((name) => {
        if (namedExports[name]) {
          exports[name] = namedExports[name];
        }
      });
    }

    const {
      title: kindName,
      id: componentId,
      parameters: kindParameters,
      decorators: kindDecorators,
      loaders: kindLoaders = [],
      component,
      subcomponents,
      args: kindArgs,
      argTypes: kindArgTypes,
    } = meta;

    if (loadedKinds.has(kindName)) {
      duplicateKindWarning(kindName);
    }
    loadedKinds.add(kindName);

    // We pass true here to avoid the warning about HMR. It's cool clientApi, we got this
    // todo discuss: TS now wants a NodeModule; should we fix this differently?
    const kind = clientApi.storiesOf(kindName, true as any);

    // we should always have a framework, rest optional
    kind.addParameters({
      framework,
      component,
      subcomponents,
      fileName: currentExports.get(fileExports),
      ...kindParameters,
      args: kindArgs,
      argTypes: kindArgTypes,
    });

    // todo add type
    (kindDecorators || []).forEach((decorator: any) => {
      kind.addDecorator(decorator);
    });

    kindLoaders.forEach((loader: any) => {
      kind.addLoader(loader);
    });

    const storyExports = Object.keys(exports);
    if (storyExports.length === 0) {
      logger.warn(
        `
          Found a story file for "${kindName}" but no exported stories.
          Check the docs for reference: https://storybook.js.org/docs/formats/component-story-format/
        `
      );
      return;
    }

    storyExports.forEach((key) => {
      if (isExportStory(key, meta)) {
        const storyFn = exports[key];
        const { story } = storyFn;
        const name = story?.name;
        const { storyName = name } = storyFn;

        // storyFn.x and storyFn.story.x get merged with
        // storyFn.x taking precedence in the merge
        const parameters = { ...story?.parameters, ...storyFn.parameters };
        const decorators = [...(storyFn.decorators || []), ...(story?.decorators || [])];
        const loaders = [...(storyFn.loaders || []), ...(story?.loaders || [])];
        const args = { ...story?.args, ...storyFn.args };
        const argTypes = { ...story?.argTypes, ...storyFn.argTypes };

        if (story) {
          logger.debug('deprecated story', story);
          deprecatedStoryAnnotationWarning();
        }

        const exportName = storyNameFromExport(key);
        const storyParams = {
          ...parameters,
          __id: toId(componentId || kindName, exportName),
          decorators,
          loaders,
          args,
          argTypes,
        };
        kind.add(storyName || exportName, storyFn, storyParams);
      }
    });
  });

  global.previousExports = currentExports;
};

const configureDeprecationWarning = () =>
  logger.log(
    `\`configure()\` is deprecated and will be removed in Storybook 7.0. 
Please use the \`stories\` field of \`main.js\` to load stories.
Read more at https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#deprecated-configure`
  );

export const loadCsf = ({
  clientApi,
  storyStore,
  configApi,
}: {
  clientApi: ClientApi;
  storyStore: StoryStore;
  configApi: ConfigApi;
}) =>
  /**
   * Load a collection of stories. If it has a default export, assume that it is a module-style
   * file and process its named exports as stories. If not, assume it's an old-style
   * storiesof file and require it.
   *
   * @param {*} framework - name of framework in use, e.g. "react"
   * @param {*} loadable a require.context `req`, an array of `req`s, or a loader function that returns void or an array of exports
   * @param {*} m - ES module object for hot-module-reloading (HMR)
   * @param {boolean} showDeprecationWarning - show the deprecation warning (default true)
   */
  (framework: string, loadable: Loadable, m: NodeModule, showDeprecationWarning = true) => {
    if (showDeprecationWarning) {
      configureDeprecationWarning();
    }

    if (typeof m === 'string') {
      throw new Error(
        `Invalid module '${m}'. Did you forget to pass \`module\` as the second argument to \`configure\`"?`
      );
    }

    configApi.configure(loadStories(loadable, framework, { clientApi, storyStore }), m);
  };
