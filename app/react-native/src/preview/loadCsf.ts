import { ClientApi } from '@storybook/client-api';
import { isExportStory, storyNameFromExport, toId } from '@storybook/csf';
import { logger } from '@storybook/client-logger';

export const loadCsf = (clientApi: ClientApi, loadStories: () => Array<any>) => {
  const loadedKinds = new Set();
  const modules = loadStories();

  modules.forEach((fileExports) => {
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
      logger.warn(`Duplicate title used in multiple files; use unique titles or a primary file for a component with re-exported stories.
        https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#deprecated-support-for-duplicate-kinds`);
    }
    loadedKinds.add(kindName);

    // We pass true here to avoid the warning about HMR. It's cool clientApi, we got this
    // todo discuss: TS now wants a NodeModule; should we fix this differently?
    const kind = clientApi.storiesOf(kindName, true as any);

    // we should always have a framework, rest optional
    kind.addParameters({
      framework: 'react-native',
      component,
      subcomponents,
      // fileName: currentExports.get(fileExports),
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
        const { storyName = story?.name } = storyFn;

        // storyFn.x and storyFn.story.x get merged with
        // storyFn.x taking precedence in the merge
        const parameters = { ...story?.parameters, ...storyFn.parameters };
        const decorators = [...(storyFn.decorators || []), ...(story?.decorators || [])];
        const loaders = [...(storyFn.loaders || []), ...(story?.loaders || [])];
        const args = { ...story?.args, ...storyFn.args };
        const argTypes = { ...story?.argTypes, ...storyFn.argTypes };

        if (story) {
          logger.warn(
            `
          CSF .story annotations deprecated; annotate story functions directly:
          - StoryFn.story.name => StoryFn.storyName
          - StoryFn.story.(parameters|decorators) => StoryFn.(parameters|decorators)
          See https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#hoisted-csf-annotations for details and codemod.
      `,
            story
          );
          // deprecatedStoryAnnotationWarning();
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
};
