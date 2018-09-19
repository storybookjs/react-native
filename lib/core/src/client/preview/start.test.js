import addons from '@storybook/addons';
import Events from '@storybook/core-events';
import { document } from 'global';

import start from './start';

jest.mock('@storybook/client-logger');
jest.mock('@storybook/addons');
jest.mock('global', () => ({
  navigator: { userAgent: 'browser' },
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
  },
}));

function mockEmit() {
  const emit = jest.fn();
  addons.getChannel.mockReturnValue({ emit });

  return emit;
}

it('renders nopreview when you have no stories', () => {
  const emit = mockEmit();

  const render = jest.fn();

  start(render);

  expect(render).not.toHaveBeenCalled();
  expect(document.body.classList.add).toHaveBeenCalledWith('sb-show-nopreview');
  expect(emit).toHaveBeenCalledWith(Events.STORY_RENDERED);
});

it('calls render when you add a story', () => {
  const emit = mockEmit();

  const render = jest.fn();

  const { clientApi, configApi } = start(render);

  emit.mockReset();
  configApi.configure(() => {
    clientApi.storiesOf('kind', {}).add('story', () => {});
  }, {});

  expect(render).toHaveBeenCalled();
  expect(emit).toHaveBeenCalledWith(Events.STORY_RENDERED);
});

it('emits an exception and shows error when your story throws', () => {
  const emit = mockEmit();

  const render = jest.fn().mockImplementation(() => {
    throw new Error('Some exception');
  });

  const { clientApi, configApi } = start(render);

  emit.mockReset();
  document.body.classList.add.mockReset();
  configApi.configure(() => {
    clientApi.storiesOf('kind', {}).add('story', () => {});
  }, {});

  expect(render).toHaveBeenCalled();
  expect(document.body.classList.add).toHaveBeenCalledWith('sb-show-errordisplay');
  expect(emit).toHaveBeenCalledWith(Events.STORY_THREW_EXCEPTION, expect.any(Error));
});

it('emits an error and shows error when your framework calls showError', () => {
  const emit = mockEmit();

  const error = {
    title: 'Some error',
    description: 'description',
  };
  const render = jest.fn().mockImplementation(({ showError }) => {
    showError(error);
  });

  const { clientApi, configApi } = start(render);

  emit.mockReset();
  document.body.classList.add.mockReset();
  configApi.configure(() => {
    clientApi.storiesOf('kind', {}).add('story', () => {});
  }, {});

  expect(render).toHaveBeenCalled();
  expect(document.body.classList.add).toHaveBeenCalledWith('sb-show-errordisplay');
  expect(emit).toHaveBeenCalledWith(Events.STORY_ERRORED, error);
});
