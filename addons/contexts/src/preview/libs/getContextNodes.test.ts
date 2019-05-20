import { _getMergedSettings, getContextNodes } from './getContextNodes';

describe('Test on the merging result of a pair of settings', () => {
  it('should retain the basic structure even receiving empty objects', () => {
    const result = _getMergedSettings({}, {});

    expect(result).toEqual({
      components: [],
      icon: '',
      nodeId: '',
      options: { cancelable: false, deep: false, disable: false },
      params: [{ name: '', props: {} }],
      title: '',
    });
  });

  it('should correctly merge two settings', () => {
    // setup
    const someTopLevelSettings = {
      icon: 'box' as const,
      title: 'Some Context',
      components: ['div'],
      params: [{ name: 'T1', props: {} }, { name: 'T2', props: {} }],
      options: {
        cancelable: true,
        disable: true,
      },
    };
    const someStoryLevelSettings = {
      icon: 'box' as const,
      title: 'Some Context',
      components: ['span'],
      params: [{ name: 'S1', props: {} }, { name: 'S2', props: {} }],
      options: {
        deep: true,
        disable: false,
      },
    };

    // exercise
    const result = _getMergedSettings(someTopLevelSettings, someStoryLevelSettings);

    // assertion
    expect(result).toEqual({
      // topLevel over storyLevel
      nodeId: someTopLevelSettings.title,
      icon: someTopLevelSettings.icon,
      title: someTopLevelSettings.title,
      components: someTopLevelSettings.components,

      // storyLevel appends to topLevel
      params: [...someTopLevelSettings.params, ...someStoryLevelSettings.params],

      // storyLevel over topLevel
      options: {
        cancelable: someTopLevelSettings.options.cancelable,
        deep: someStoryLevelSettings.options.deep,
        disable: someStoryLevelSettings.options.disable,
      },
    });
  });
});

describe('Test on reconciliation of settings', () => {
  it('should have a stable array ordering after normalization', () => {
    const result = getContextNodes({
      // from the topLevel
      options: [
        {
          icon: 'box',
          title: 'Some Context',
          components: ['div'],
          params: [{ name: 'T1', props: {} }],
        },
        {
          icon: 'box',
          title: 'Another Context',
          components: ['div'],
          params: [{ name: 'T2', props: {} }],
        },
      ],
      // from the storyLevel
      parameters: [
        {
          icon: 'box',
          title: 'Other Contexts',
          components: ['span'],
          params: [{ name: 'S1', props: {} }],
        },
        {
          icon: 'box',
          title: 'Some Context',
          components: ['p'],
          params: [{ name: 'S2', props: {}, default: true }],
        },
      ],
    });

    expect(result).toEqual([
      {
        components: ['div'],
        icon: 'box',
        nodeId: 'Some Context',
        options: { cancelable: false, deep: false, disable: false },
        params: [{ name: 'T1', props: {} }, { name: 'S2', props: {}, default: true }],
        title: 'Some Context',
      },
      {
        components: ['div'],
        icon: 'box',
        nodeId: 'Another Context',
        options: { cancelable: false, deep: false, disable: false },
        params: [{ name: 'T2', props: {} }],
        title: 'Another Context',
      },
      {
        components: ['span'],
        icon: 'box',
        nodeId: 'Other Contexts',
        options: { cancelable: false, deep: false, disable: false },
        params: [{ name: 'S1', props: {} }],
        title: 'Other Contexts',
      },
    ]);
  });
});
