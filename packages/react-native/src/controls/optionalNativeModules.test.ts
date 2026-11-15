import { Platform, TurboModuleRegistry, UIManager } from 'react-native';

import {
  getDateTimePicker,
  getNativeSlider,
  isDateTimePickerNativeAvailable,
  isSliderNativeAvailable,
  resetOptionalNativeModules,
  resolveOptionalNativeModule,
} from './optionalNativeModules';

const notFound = () =>
  Object.assign(new Error("Cannot find module 'x'"), { code: 'MODULE_NOT_FOUND' });

let warn: jest.SpyInstance;
let hasViewManagerConfig: jest.SpyInstance;
let getTurboModule: jest.SpyInstance;
let isTV: jest.SpyInstance;
let platformOS: jest.ReplaceProperty<typeof Platform.OS>;

const setPlatform = (os: typeof Platform.OS, tv = false) => {
  platformOS.replaceValue(os);
  isTV.mockReturnValue(tv);
};

beforeEach(() => {
  resetOptionalNativeModules();
  warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  hasViewManagerConfig = jest.spyOn(UIManager, 'hasViewManagerConfig').mockReturnValue(false);
  getTurboModule = jest.spyOn(TurboModuleRegistry, 'get').mockReturnValue(null);
  isTV = jest.spyOn(Platform, 'isTV', 'get').mockReturnValue(false);
  platformOS = jest.replaceProperty(Platform, 'OS', 'ios');
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.dontMock('@react-native-community/datetimepicker');
  jest.dontMock('@react-native-community/slider');
  // Forget the mocked packages so the next test's `jest.doMock` factory runs.
  jest.resetModules();
});

describe('resolveOptionalNativeModule', () => {
  const mod = { default: 'Module' };

  it('returns the module when it is installed and linked', () => {
    expect(
      resolveOptionalNativeModule({
        packageName: 'pkg',
        load: () => ({ module: mod }),
        isNativeAvailable: () => true,
      })
    ).toBe(mod);
    expect(warn).not.toHaveBeenCalled();
  });

  it('returns null and warns when it is installed but not linked', () => {
    expect(
      resolveOptionalNativeModule({
        packageName: 'pkg',
        load: () => ({ module: mod }),
        isNativeAvailable: () => false,
      })
    ).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain(
      'pkg is installed but its native module is not available'
    );
  });

  it('returns null and warns when requiring it throws because the native module is missing', () => {
    const isNativeAvailable = jest.fn(() => true);
    expect(
      resolveOptionalNativeModule({
        packageName: 'pkg',
        load: () => ({
          error: new Error(
            "TurboModuleRegistry.getEnforcing(...): 'RNCDatePicker' could not be found"
          ),
        }),
        isNativeAvailable,
      })
    ).toBeNull();
    expect(isNativeAvailable).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('returns null without a warning when it is not installed', () => {
    expect(
      resolveOptionalNativeModule({
        packageName: 'pkg',
        load: () => ({ error: notFound() }),
        isNativeAvailable: () => true,
      })
    ).toBeNull();
    expect(warn).not.toHaveBeenCalled();
  });

  it('treats a throwing native check as not linked', () => {
    expect(
      resolveOptionalNativeModule({
        packageName: 'pkg',
        load: () => ({ module: mod }),
        isNativeAvailable: () => {
          throw new Error('boom');
        },
      })
    ).toBeNull();
  });
});

describe('isDateTimePickerNativeAvailable', () => {
  it('checks the RNDateTimePicker view on iOS', () => {
    hasViewManagerConfig.mockImplementation((name) => name === 'RNDateTimePicker');
    expect(isDateTimePickerNativeAvailable()).toBe(true);

    hasViewManagerConfig.mockReturnValue(false);
    expect(isDateTimePickerNativeAvailable()).toBe(false);
  });

  it('checks the date and time picker modules on Android', () => {
    setPlatform('android');
    hasViewManagerConfig.mockReturnValue(true);

    getTurboModule.mockImplementation((name) => (name === 'RNCDatePicker' ? {} : null));
    expect(isDateTimePickerNativeAvailable()).toBe(false);

    getTurboModule.mockImplementation((name) =>
      name === 'RNCDatePicker' || name === 'RNCTimePicker' ? {} : null
    );
    expect(isDateTimePickerNativeAvailable()).toBe(true);
  });

  it('is unavailable on tvOS and other platforms', () => {
    hasViewManagerConfig.mockReturnValue(true);
    getTurboModule.mockReturnValue({});

    setPlatform('ios', true);
    expect(isDateTimePickerNativeAvailable()).toBe(false);

    setPlatform('macos');
    expect(isDateTimePickerNativeAvailable()).toBe(false);
  });
});

describe('isSliderNativeAvailable', () => {
  it('checks the RNCSlider view on native platforms', () => {
    hasViewManagerConfig.mockImplementation((name) => name === 'RNCSlider');
    expect(isSliderNativeAvailable()).toBe(true);

    setPlatform('android');
    expect(isSliderNativeAvailable()).toBe(true);

    hasViewManagerConfig.mockReturnValue(false);
    expect(isSliderNativeAvailable()).toBe(false);
  });

  it('is available on web and unavailable on unsupported platforms', () => {
    setPlatform('web');
    expect(isSliderNativeAvailable()).toBe(true);

    hasViewManagerConfig.mockReturnValue(true);
    setPlatform('macos');
    expect(isSliderNativeAvailable()).toBe(false);
  });
});

describe('getDateTimePicker', () => {
  const picker = { default: 'DateTimePicker', DateTimePickerAndroid: {} };

  it('returns the package when it is installed and linked', () => {
    jest.doMock('@react-native-community/datetimepicker', () => picker);
    hasViewManagerConfig.mockImplementation((name) => name === 'RNDateTimePicker');

    expect(getDateTimePicker()).toBe(picker);
    expect(warn).not.toHaveBeenCalled();
  });

  it('falls back and warns once when it is installed but not linked', () => {
    jest.doMock('@react-native-community/datetimepicker', () => picker);

    expect(getDateTimePicker()).toBeNull();
    expect(getDateTimePicker()).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('falls back silently when it is not installed', () => {
    jest.doMock('@react-native-community/datetimepicker', () => {
      throw notFound();
    });
    hasViewManagerConfig.mockReturnValue(true);

    expect(getDateTimePicker()).toBeNull();
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('getNativeSlider', () => {
  const slider = { default: 'Slider' };

  it('returns the slider when it is installed and linked', () => {
    jest.doMock('@react-native-community/slider', () => slider);
    hasViewManagerConfig.mockImplementation((name) => name === 'RNCSlider');

    expect(getNativeSlider()).toBe('Slider');
  });

  it('falls back and warns when it is installed but not linked', () => {
    jest.doMock('@react-native-community/slider', () => slider);

    expect(getNativeSlider()).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('falls back silently when it is not installed', () => {
    jest.doMock('@react-native-community/slider', () => {
      throw notFound();
    });

    expect(getNativeSlider()).toBeNull();
    expect(warn).not.toHaveBeenCalled();
  });
});
