import { act, type ReactElement } from 'react';
import { Text, View } from 'react-native';
import { createRoot } from 'test-renderer';
import type { Meta, StoryObj } from '@storybook/react';

import { composeStories, composeStory, setProjectAnnotations } from './portable-stories';

// The portable stories utilities are exported from the main entry, which is bundled into the app,
// so they must not load the React (web) renderer: its entry imports react-dom, which a React
// Native app doesn't have.
jest.mock('@storybook/react', () => {
  throw new Error('@storybook/react should not be loaded at runtime');
});

const Label = ({ text, prefix = '' }: { text: string; prefix?: string }) => (
  <Text>{`${prefix}${text}`}</Text>
);

const meta = {
  title: 'Example/Label',
  component: Label,
  args: { text: 'from meta' },
} satisfies Meta<typeof Label>;

type Story = StoryObj<typeof meta>;

const Primary: Story = { args: { text: 'primary' } };

const WithPrefix: Story = { args: { prefix: '> ' } };

const WithRender: Story = {
  render: (args) => (
    <View>
      <Text>custom render</Text>
      <Label {...args} />
    </View>
  ),
};

const stories = { default: meta, Primary, WithPrefix, WithRender };

const renderToText = async (element: ReactElement) => {
  const root = createRoot();

  await act(async () => {
    root.render(element);
  });

  const texts = root.container
    .queryAll((instance) => instance.type === 'Text')
    .map((instance) => instance.children.join(''));

  await act(async () => {
    root.unmount();
  });

  return texts;
};

// setProjectAnnotations stores the annotations on globalThis, so reset them between tests.
afterEach(() => {
  const storybookGlobal = globalThis as {
    globalProjectAnnotations?: unknown;
    defaultProjectAnnotations?: unknown;
  };

  delete storybookGlobal.globalProjectAnnotations;
  delete storybookGlobal.defaultProjectAnnotations;
});

describe('composeStories', () => {
  it('composes every story in the file', () => {
    const composed = composeStories(stories);

    expect(Object.keys(composed)).toEqual(['Primary', 'WithPrefix', 'WithRender']);
    expect(composed.Primary.storyName).toBe('Primary');
    expect(composed.Primary.id).toBe('example-label--primary');
  });

  it('renders the meta component with the story args', async () => {
    const { Primary: ComposedPrimary, WithPrefix: ComposedWithPrefix } = composeStories(stories);

    expect(await renderToText(<ComposedPrimary />)).toEqual(['primary']);
    expect(await renderToText(<ComposedWithPrefix />)).toEqual(['> from meta']);
  });

  it('lets props override the story args', async () => {
    const { Primary: ComposedPrimary } = composeStories(stories);

    expect(await renderToText(<ComposedPrimary text="from props" />)).toEqual(['from props']);
  });

  it("uses the story's own render function", async () => {
    const { WithRender: ComposedWithRender } = composeStories(stories);

    expect(await renderToText(<ComposedWithRender />)).toEqual(['custom render', 'from meta']);
  });

  it('applies the React Native default annotations', () => {
    const { Primary: ComposedPrimary } = composeStories(stories);

    expect(ComposedPrimary.parameters.renderer).toBe('react-native');
  });

  it('applies the project annotations passed to it', async () => {
    const { Primary: ComposedPrimary } = composeStories(stories, {
      decorators: [
        (StoryFn) => (
          <View>
            <Text>decorated</Text>
            <StoryFn />
          </View>
        ),
      ],
    });

    expect(await renderToText(<ComposedPrimary />)).toEqual(['decorated', 'primary']);
  });
});

describe('composeStory', () => {
  it('composes a single story with its meta', async () => {
    const ComposedPrimary = composeStory(Primary, meta);

    expect(ComposedPrimary.args).toEqual({ text: 'primary' });
    expect(await renderToText(<ComposedPrimary />)).toEqual(['primary']);
  });

  it('uses the export name it is given', () => {
    const ComposedStory = composeStory({ args: { text: 'named' } }, meta, undefined, 'MyStory');

    expect(ComposedStory.storyName).toBe('MyStory');
  });

  it('throws a helpful error when the meta has no component', () => {
    const ComposedStory = composeStory({}, { title: 'Example/NoComponent' });

    expect(() => ComposedStory()).toThrow(
      'Unable to render story example-nocomponent--unnamed-story as the component annotation is missing from the default export'
    );
  });
});

describe('setProjectAnnotations', () => {
  it('applies the project annotations to stories composed afterwards', async () => {
    setProjectAnnotations({
      args: { prefix: '* ' },
      decorators: [
        (StoryFn) => (
          <View>
            <Text>global decorator</Text>
            <StoryFn />
          </View>
        ),
      ],
    });

    const { Primary: ComposedPrimary } = composeStories(stories);

    expect(await renderToText(<ComposedPrimary />)).toEqual(['global decorator', '* primary']);
  });

  it('keeps the React Native default annotations', async () => {
    setProjectAnnotations([{ parameters: { custom: true } }]);

    const ComposedPrimary = composeStory(Primary, meta);

    expect(ComposedPrimary.parameters).toMatchObject({ renderer: 'react-native', custom: true });
    expect(await renderToText(<ComposedPrimary />)).toEqual(['primary']);
  });

  it('returns the normalized project annotations', () => {
    const annotations = setProjectAnnotations({ parameters: { custom: true } });

    expect(annotations.parameters).toMatchObject({ renderer: 'react-native', custom: true });
    expect(typeof annotations.render).toBe('function');
  });
});
