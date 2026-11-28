import { definePreview } from './definePreview';
import { definePreview as definePreviewBase } from 'storybook/internal/csf';
import { prepareStories } from './prepareStories';

const createStoryEntries = (fileExports: Record<string, unknown>) => {
  const req = () => fileExports;
  req.keys = () => ['./Button.stories.tsx'];

  return [
    {
      titlePrefix: '',
      directory: './src',
      files: '**/*.stories.?(ts|tsx|js|jsx)',
      importPathMatcher:
        /^\.(?:(?:^|\/|(?:(?:(?!(?:^|\/)\.).)*?)\/)(?!\.)(?=.)[^/]*?\.stories\.(?:ts|tsx|js|jsx)?)$/,
      req,
    },
  ];
};

describe('prepareStories', () => {
  test('prepares a standard CSF story file', () => {
    const req = () => {
      return require('../../../examples/expo-example/components/InputExample/TextInput.stories');
    };
    req.keys = () => ['./TextInput.stories.tsx'];

    const result = prepareStories({
      storyEntries: [
        {
          titlePrefix: '',
          directory: './src',
          files: '**/*.stories.?(ts|tsx|js|jsx)',
          importPathMatcher:
            /^\.(?:(?:^|\/|(?:(?:(?!(?:^|\/)\.).)*?)\/)(?!\.)(?=.)[^/]*?\.stories\.(?:ts|tsx|js|jsx)?)$/,
          req,
        },
      ],
    });
    expect(result).toEqual<ReturnType<typeof prepareStories>>({
      importMap: {
        './src/TextInput.stories.tsx': {
          Basic: {
            args: {
              placeholder: 'Type something',
            },
          },
          default: {
            component: expect.any(Function),
            parameters: {
              notes: 'Use this example to test the software keyboard related issues.',
            },
          },
        },
      },
      index: {
        v: 5,
        entries: {
          'textinput--basic': {
            id: 'textinput--basic',
            importPath: './src/TextInput.stories.tsx',
            name: 'Basic',
            tags: ['dev', 'test', 'manifest'],
            title: 'TextInput',
            type: 'story',
            subtype: 'story',
          },
        },
      },
    });
  });

  test('ignores stories matching excludeStories pattern', () => {
    const req = () => {
      const stories = {
        ...require('../../../examples/expo-example/components/InputExample/TextInput.stories'),
      };
      stories.Ignored = stories.Basic;
      stories.default.excludeStories = /Ignored/;
      return stories;
    };
    req.keys = () => ['./TextInput.stories.tsx'];

    const result = prepareStories({
      storyEntries: [
        {
          titlePrefix: '',
          directory: './src',
          files: '**/*.stories.?(ts|tsx|js|jsx)',
          importPathMatcher:
            /^\.(?:(?:^|\/|(?:(?:(?!(?:^|\/)\.).)*?)\/)(?!\.)(?=.)[^/]*?\.stories\.(?:ts|tsx|js|jsx)?)$/,
          req,
        },
      ],
    });
    expect(result.importMap['./src/TextInput.stories.tsx'].Ignored).toBeUndefined();
    expect(result.index.entries['textinput--basic']).toBeDefined();
    expect(result.index.entries['textinput--ignored']).toBeUndefined();
  });

  test('ignores stories not matching includeStories pattern', () => {
    const req = () => {
      const stories = {
        ...require('../../../examples/expo-example/components/InputExample/TextInput.stories'),
      };
      stories.Ignored = stories.Basic;
      stories.default.includeStories = /Basic/;
      return stories;
    };
    req.keys = () => ['./TextInput.stories.tsx'];

    const result = prepareStories({
      storyEntries: [
        {
          titlePrefix: '',
          directory: './src',
          files: '**/*.stories.?(ts|tsx|js|jsx)',
          importPathMatcher:
            /^\.(?:(?:^|\/|(?:(?:(?!(?:^|\/)\.).)*?)\/)(?!\.)(?=.)[^/]*?\.stories\.(?:ts|tsx|js|jsx)?)$/,
          req,
        },
      ],
    });
    expect(result.importMap['./src/TextInput.stories.tsx'].Ignored).toBeUndefined();
    expect(result.index.entries['textinput--basic']).toBeDefined();
    expect(result.index.entries['textinput--ignored']).toBeUndefined();
  });

  test('strips play functions from stories', () => {
    const req = () => {
      const stories = {
        ...require('../../../examples/expo-example/components/InputExample/TextInput.stories'),
      };
      stories.Basic.play = () => {};
      return stories;
    };
    req.keys = () => ['./TextInput.stories.tsx'];

    const result = prepareStories({
      storyEntries: [
        {
          titlePrefix: '',
          directory: './src',
          files: '**/*.stories.?(ts|tsx|js|jsx)',
          importPathMatcher:
            /^\.(?:(?:^|\/|(?:(?:(?!(?:^|\/)\.).)*?)\/)(?!\.)(?=.)[^/]*?\.stories\.(?:ts|tsx|js|jsx)?)$/,
          req,
        },
      ],
    });
    expect(result.importMap['./src/TextInput.stories.tsx'].Basic.play).toBeUndefined();
  });

  test('combines the project, meta and story tags of each story', () => {
    const result = prepareStories({
      projectTags: ['project', '!test'],
      storyEntries: createStoryEntries({
        default: { title: 'Button', tags: ['beta', 'meta-only'] },
        Basic: { tags: ['new'] },
        Hidden: { tags: ['!dev', '!meta-only'] },
        Legacy: Object.assign(() => null, { tags: ['legacy'] }),
      }),
    });

    expect(result.index.entries['button--basic'].tags).toEqual([
      'dev',
      'manifest',
      'project',
      'beta',
      'meta-only',
      'new',
    ]);
    expect(result.index.entries['button--hidden'].tags).toEqual(['manifest', 'project', 'beta']);
    expect(result.index.entries['button--legacy'].tags).toEqual([
      'dev',
      'manifest',
      'project',
      'beta',
      'meta-only',
      'legacy',
    ]);
  });

  test('tags stories that have a play function with play-fn', () => {
    const result = prepareStories({
      storyEntries: createStoryEntries({
        default: { title: 'Button', tags: ['!play-fn'] },
        WithPlay: { play: () => {} },
        WithoutPlay: {},
      }),
    });

    expect(result.index.entries['button--with-play'].tags).toContain('play-fn');
    expect(result.index.entries['button--without-play'].tags).not.toContain('play-fn');
    // the play function is still stripped from the story itself
    expect(result.importMap['./src/Button.stories.tsx'].WithPlay.play).toBeUndefined();
  });

  test('reads the tags of CSF factories', () => {
    const preview = definePreview({ addons: [] });
    const meta = preview.meta({ title: 'Button', tags: ['beta'], component: () => null });
    const Basic = meta.story({ tags: ['new'] });
    const Hidden = Basic.extend({ tags: ['!dev'] });
    const WithPlay = meta.story({ play: async () => {} });

    const result = prepareStories({
      storyEntries: createStoryEntries({ default: meta, Basic, Hidden, WithPlay }),
    });

    expect(result.index.entries['button--basic'].tags).toEqual([
      'dev',
      'test',
      'manifest',
      'beta',
      'new',
    ]);
    expect(result.index.entries['button--hidden'].tags).toEqual([
      'test',
      'manifest',
      'beta',
      'new',
    ]);
    expect(result.index.entries['button--with-play'].tags).toEqual([
      'dev',
      'test',
      'manifest',
      'beta',
      'play-fn',
    ]);
  });
});

const createSpecifier = (files: Record<string, Record<string, unknown>>) => {
  const req = (filename: string) => files[filename];
  req.keys = () => Object.keys(files);

  return {
    titlePrefix: '',
    directory: './src',
    files: '**/*.stories.?(ts|tsx|js|jsx)',
    importPathMatcher:
      /^\.(?:(?:^|\/|(?:(?:(?!(?:^|\/)\.).)*?)\/)(?!\.)(?=.)[^/]*?\.stories\.(?:ts|tsx|js|jsx)?)$/,
    req,
  };
};

describe('prepareStories with CSF factories', () => {
  const component = () => null;

  test('indexes a CSF factories file without a default export', () => {
    const preview = definePreview({ addons: [] });
    const meta = preview.meta({ title: 'Button', tags: ['beta'], component });
    const Primary = meta.story({ args: { label: 'Primary' } });
    const Named = meta.story({ name: 'Custom name' });

    const result = prepareStories({
      storyEntries: createStoryEntries({ Primary, Named }),
    });

    expect(result.index.entries).toEqual({
      'button--primary': {
        type: 'story',
        subtype: 'story',
        id: 'button--primary',
        name: 'Primary',
        title: 'Button',
        importPath: './src/Button.stories.tsx',
        tags: ['dev', 'test', 'manifest', 'beta'],
      },
      'button--named': {
        type: 'story',
        subtype: 'story',
        id: 'button--named',
        name: 'Custom name',
        title: 'Button',
        importPath: './src/Button.stories.tsx',
        tags: ['dev', 'test', 'manifest', 'beta'],
      },
    });
    expect(result.importMap['./src/Button.stories.tsx']).toEqual({ Primary, Named });
  });

  test('indexes a CSF factories file that still has a default export', () => {
    const preview = definePreview({ addons: [] });
    const meta = preview.meta({ title: 'Button', component });
    const Primary = meta.story({});

    const result = prepareStories({
      storyEntries: createStoryEntries({ default: meta, Primary }),
    });

    expect(Object.keys(result.index.entries)).toEqual(['button--primary']);
    expect(result.index.entries['button--primary'].title).toBe('Button');
    expect(result.importMap['./src/Button.stories.tsx']).toEqual({ default: meta, Primary });
  });

  test('applies includeStories and excludeStories of a factory meta without a default export', () => {
    const preview = definePreview({ addons: [] });
    const included = preview.meta({ title: 'Included', component, includeStories: /^Basic/ });
    const excluded = preview.meta({ title: 'Excluded', component, excludeStories: ['Hidden'] });

    const result = prepareStories({
      storyEntries: [
        createSpecifier({
          './Included.stories.tsx': {
            Basic: included.story({}),
            BasicTwo: included.story({}),
            Other: included.story({}),
          },
          './Excluded.stories.tsx': {
            Shown: excluded.story({}),
            Hidden: excluded.story({}),
          },
        }),
      ],
    });

    expect(Object.keys(result.index.entries).sort()).toEqual([
      'excluded--shown',
      'included--basic',
      'included--basic-two',
    ]);
    expect(Object.keys(result.importMap['./src/Included.stories.tsx'])).toEqual([
      'Basic',
      'BasicTwo',
    ]);
    expect(Object.keys(result.importMap['./src/Excluded.stories.tsx'])).toEqual(['Shown']);
  });

  test('reads a factory meta from a preview that is not the React Native definePreview', () => {
    // e.g. stories shared with a web Storybook: title and include/excludeStories only live on `input`
    const preview = definePreviewBase({ addons: [] });
    const meta = preview.meta({ title: 'Web/Button', tags: ['beta'], excludeStories: ['Hidden'] });
    const Primary = meta.story({ tags: ['new'] });
    const Secondary = meta.story({});
    const Hidden = meta.story({});

    const result = prepareStories({
      storyEntries: createStoryEntries({ Primary, Secondary, Hidden }),
    });

    expect(result.index.entries).toEqual({
      'web-button--primary': expect.objectContaining({
        title: 'Web/Button',
        name: 'Primary',
        tags: ['dev', 'test', 'manifest', 'beta', 'new'],
      }),
      'web-button--secondary': expect.objectContaining({
        title: 'Web/Button',
        name: 'Secondary',
        tags: ['dev', 'test', 'manifest', 'beta'],
      }),
    });
  });

  test('uses the auto title for a factory meta without a title', () => {
    const preview = definePreviewBase({ addons: [] });
    const meta = preview.meta({});
    const First = meta.story({});
    const Second = meta.story({});

    const result = prepareStories({
      storyEntries: createStoryEntries({ First, Second }),
    });

    expect(Object.keys(result.index.entries)).toEqual(['button--first', 'button--second']);
    expect(result.index.entries['button--second'].title).toBe('Button');
  });

  test('ignores named exports that are not factory stories', () => {
    const preview = definePreview({ addons: [] });
    const meta = preview.meta({ title: 'Button', component });
    const Primary = meta.story({});

    const result = prepareStories({
      storyEntries: createStoryEntries({
        Primary,
        sampleData: { label: 'not a story' },
        helper: () => null,
      }),
    });

    expect(Object.keys(result.index.entries)).toEqual(['button--primary']);
  });

  test('skips a file with neither a default export nor factory stories', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = prepareStories({
      storyEntries: createStoryEntries({
        sampleData: { label: 'not a story' },
        helper: () => null,
      }),
    });

    expect(result.index.entries).toEqual({});
    expect(result.importMap).toEqual({});
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  test('indexes CSF 3 and CSF factories files in the same specifier', () => {
    const preview = definePreview({ addons: [] });
    const factoryMeta = preview.meta({ title: 'Factories', tags: ['factory'], component });
    const FactoryWithoutDefault = factoryMeta.story({ play: async () => {} });
    const legacyMeta = preview.meta({ title: 'FactoriesWithDefault', component });
    const FactoryWithDefault = legacyMeta.story({});
    const csf3Play = () => {};

    const result = prepareStories({
      storyEntries: [
        createSpecifier({
          './Factories.stories.tsx': { FactoryWithoutDefault },
          './Csf3.stories.tsx': {
            default: { title: 'Csf3', tags: ['csf3'], excludeStories: ['excluded'] },
            Basic: { args: { label: 'Basic' }, play: csf3Play },
            Named: { name: 'Named story' },
            Fn: Object.assign(() => null, { storyName: 'Function story' }),
            excluded: { label: 'data' },
          },
          './FactoriesWithDefault.stories.tsx': { default: legacyMeta, FactoryWithDefault },
          './AutoTitle.stories.tsx': { default: {}, Story: {} },
        }),
      ],
    });

    expect(result.index.entries).toEqual({
      'autotitle--story': {
        type: 'story',
        subtype: 'story',
        id: 'autotitle--story',
        name: 'Story',
        title: 'AutoTitle',
        importPath: './src/AutoTitle.stories.tsx',
        tags: ['dev', 'test', 'manifest'],
      },
      'csf3--basic': {
        type: 'story',
        subtype: 'story',
        id: 'csf3--basic',
        name: 'Basic',
        title: 'Csf3',
        importPath: './src/Csf3.stories.tsx',
        tags: ['dev', 'test', 'manifest', 'csf3', 'play-fn'],
      },
      'csf3--named': {
        type: 'story',
        subtype: 'story',
        id: 'csf3--named',
        name: 'Named story',
        title: 'Csf3',
        importPath: './src/Csf3.stories.tsx',
        tags: ['dev', 'test', 'manifest', 'csf3'],
      },
      'csf3--fn': {
        type: 'story',
        subtype: 'story',
        id: 'csf3--fn',
        name: 'Function story',
        title: 'Csf3',
        importPath: './src/Csf3.stories.tsx',
        tags: ['dev', 'test', 'manifest', 'csf3'],
      },
      'factories--factory-without-default': {
        type: 'story',
        subtype: 'story',
        id: 'factories--factory-without-default',
        name: 'Factory Without Default',
        title: 'Factories',
        importPath: './src/Factories.stories.tsx',
        tags: ['dev', 'test', 'manifest', 'factory', 'play-fn'],
      },
      'factorieswithdefault--factory-with-default': {
        type: 'story',
        subtype: 'story',
        id: 'factorieswithdefault--factory-with-default',
        name: 'Factory With Default',
        title: 'FactoriesWithDefault',
        importPath: './src/FactoriesWithDefault.stories.tsx',
        tags: ['dev', 'test', 'manifest'],
      },
    });
    // without a storySort, entries keep the file and export order
    expect(Object.keys(result.index.entries)).toEqual([
      'factories--factory-without-default',
      'csf3--basic',
      'csf3--named',
      'csf3--fn',
      'factorieswithdefault--factory-with-default',
      'autotitle--story',
    ]);
    // CSF 3 stories keep the default export and have their play function stripped
    expect(result.importMap['./src/Csf3.stories.tsx']).toEqual({
      default: { title: 'Csf3', tags: ['csf3'], excludeStories: ['excluded'] },
      Basic: { args: { label: 'Basic' }, play: undefined },
      Named: { name: 'Named story' },
      Fn: expect.any(Function),
    });
    expect(Object.keys(result.importMap['./src/Factories.stories.tsx'])).toEqual([
      'FactoryWithoutDefault',
    ]);
  });
});
