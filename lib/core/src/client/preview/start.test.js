/* eslint-disable no-underscore-dangle */
import { history, document, window } from 'global';

import Events from '@storybook/core-events';
import start, { isExportStory } from './start';

jest.mock('@storybook/client-logger');
jest.mock('global', () => ({
  history: { replaceState: jest.fn() },
  navigator: { userAgent: 'browser', platform: '' },
  window: {
    __STORYBOOK_CLIENT_API__: undefined,
    addEventListener: jest.fn(),
    location: { search: '' },
    history: { replaceState: jest.fn() },
  },
  document: {
    addEventListener: jest.fn(),
    getElementById: jest.fn().mockReturnValue({}),
    body: { classList: { add: jest.fn(), remove: jest.fn() } },
    documentElement: {},
    location: { search: '?id=kind--story' },
  },
}));

afterEach(() => {
  window.__STORYBOOK_CLIENT_API__ = undefined;
});

it('returns apis', () => {
  const render = jest.fn();

  const result = start(render);

  expect(result).toEqual(
    expect.objectContaining({
      context: expect.any(Object),
      clientApi: expect.any(Object),
      configApi: expect.any(Object),
      forceReRender: expect.any(Function),
    })
  );
});

it('reuses the current client api when the lib is reloaded', () => {
  jest.useFakeTimers();
  const render = jest.fn();

  const { clientApi } = start(render);

  const valueOfClientApi = window.__STORYBOOK_CLIENT_API__;

  const { clientApi: newClientApi } = start(render);
  jest.runAllTimers();

  expect(clientApi).toEqual(newClientApi);
  expect(clientApi).toEqual(valueOfClientApi);
});

it('calls render when you add a story', () => {
  jest.useFakeTimers();
  const render = jest.fn();

  const { clientApi, configApi } = start(render);

  configApi.configure(() => {
    clientApi.storiesOf('kind', {}).add('story', () => {});
  }, {});
  jest.runAllTimers();

  expect(render).toHaveBeenCalledWith(
    expect.objectContaining({ selectedKind: 'kind', selectedStory: 'story' })
  );
});

it('emits an exception and shows error when your story throws', () => {
  jest.useFakeTimers();
  const render = jest.fn();

  const { clientApi, configApi } = start(render);

  configApi.configure(() => {
    clientApi.storiesOf('kind', {}).add('story1', () => {});
  }, {});
  jest.runAllTimers();

  expect(render).not.toHaveBeenCalled();
  expect(document.body.classList.add).toHaveBeenCalledWith('sb-show-nopreview');
});

it('emits an error and shows error when your framework calls showError', () => {
  jest.useFakeTimers();
  const error = {
    title: 'Some error',
    description: 'description',
  };
  const render = jest.fn().mockImplementation(({ showError }) => {
    showError(error);
  });

  const { clientApi, configApi } = start(render);

  configApi.configure(() => {
    clientApi.storiesOf('kind', {}).add('story', () => {});
  }, {});
  jest.runAllTimers();

  expect(render).toHaveBeenCalled();
  expect(document.body.classList.add).toHaveBeenCalledWith('sb-show-errordisplay');
});

describe('STORY_INIT', () => {
  it('supports path params', () => {
    document.location = {
      pathname: 'pathname',
      search: '?path=/story/kind--story&bar=baz',
    };

    const render = jest.fn();
    const { clientApi } = start(render);
    const store = clientApi._storyStore;
    store.setSelection = jest.fn();
    store.emit(Events.STORY_INIT);

    store.emit();
    expect(store.setSelection).toHaveBeenCalledWith({ storyId: 'kind--story' });
  });

  it('supports story kind/name params', () => {
    document.location = {
      pathname: 'pathname',
      search: '?selectedKind=kind&selectedStory=story&bar=baz',
    };

    const render = jest.fn();
    const { clientApi } = start(render);
    const store = clientApi._storyStore;
    store.setSelection = jest.fn();

    store.emit(Events.STORY_INIT);
    expect(history.replaceState).toHaveBeenCalledWith({}, '', 'pathname?bar=baz&id=kind--story');
    expect(store.setSelection).toHaveBeenCalledWith({ storyId: 'kind--story' });
  });
});

describe('story filters for module exports', () => {
  it('should include all stories when there are no filters', () => {
    expect(isExportStory('a', {})).toBeTruthy();
  });

  it('should filter stories by arrays', () => {
    expect(isExportStory('a', { includeStories: ['a'] })).toBeTruthy();
    expect(isExportStory('a', { includeStories: [] })).toBeFalsy();
    expect(isExportStory('a', { includeStories: ['b'] })).toBeFalsy();

    expect(isExportStory('a', { excludeStories: ['a'] })).toBeFalsy();
    expect(isExportStory('a', { excludeStories: [] })).toBeTruthy();
    expect(isExportStory('a', { excludeStories: ['b'] })).toBeTruthy();

    expect(isExportStory('a', { includeStories: ['a'], excludeStories: ['a'] })).toBeFalsy();
    expect(isExportStory('a', { includeStories: [], excludeStories: [] })).toBeFalsy();
    expect(isExportStory('a', { includeStories: ['a'], excludeStories: ['b'] })).toBeTruthy();
  });

  it('should filter stories by regex', () => {
    expect(isExportStory('a', { includeStories: /a/ })).toBeTruthy();
    expect(isExportStory('a', { includeStories: /.*/ })).toBeTruthy();
    expect(isExportStory('a', { includeStories: /b/ })).toBeFalsy();

    expect(isExportStory('a', { excludeStories: /a/ })).toBeFalsy();
    expect(isExportStory('a', { excludeStories: /.*/ })).toBeFalsy();
    expect(isExportStory('a', { excludeStories: /b/ })).toBeTruthy();

    expect(isExportStory('a', { includeStories: /a/, excludeStories: ['a'] })).toBeFalsy();
    expect(isExportStory('a', { includeStories: /.*/, excludeStories: /.*/ })).toBeFalsy();
    expect(isExportStory('a', { includeStories: /a/, excludeStories: /b/ })).toBeTruthy();
  });
});
