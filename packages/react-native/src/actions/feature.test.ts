import { start } from '../Start';

jest.mock('storybook/manager-api', () => ({
  addons: {
    loadAddons: jest.fn(),
    setChannel: jest.fn(),
  },
}));

const mockRegisterActionsAddon = jest.fn();
jest.mock('./register', () => ({ registerActionsAddon: mockRegisterActionsAddon }));

const startEmpty = () =>
  start({
    annotations: [{ default: { parameters: {} } }],
    storyEntries: [],
  });

describe('ondeviceActions feature flag', () => {
  const originalFeatures = globalThis.FEATURES;

  beforeEach(() => {
    mockRegisterActionsAddon.mockClear();
    delete (globalThis as { view?: unknown }).view;
  });

  afterEach(() => {
    globalThis.FEATURES = originalFeatures;
  });

  it('registers the built-in Actions addon by default', () => {
    globalThis.FEATURES = undefined;
    startEmpty();
    expect(mockRegisterActionsAddon).toHaveBeenCalledTimes(1);
  });

  it('registers it when other features are set but ondeviceActions is not', () => {
    globalThis.FEATURES = { ondeviceBackgrounds: false };
    startEmpty();
    expect(mockRegisterActionsAddon).toHaveBeenCalledTimes(1);
  });

  it('does not register it when ondeviceActions is false', () => {
    globalThis.FEATURES = { ondeviceActions: false };
    startEmpty();
    expect(mockRegisterActionsAddon).not.toHaveBeenCalled();
  });
});
