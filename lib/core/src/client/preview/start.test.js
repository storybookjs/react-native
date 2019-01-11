import { document } from 'global';

import start from './start';

jest.mock('@storybook/client-logger');
jest.mock('global', () => ({
  navigator: { userAgent: 'browser', platform: '' },
  window: {
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
