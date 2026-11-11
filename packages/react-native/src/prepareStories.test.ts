import { definePreview } from './definePreview';
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
