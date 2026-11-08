import { Platform, TurboModuleRegistry, UIManager } from 'react-native';

export type DateTimePickerModule = typeof import('@react-native-community/datetimepicker');
export type SliderModule = typeof import('@react-native-community/slider');

/** What a loader returns: the module, or the error its `require` threw. */
export type LoadResult<T> = { module: T } | { error: unknown };

const isModuleNotFound = (error: unknown) => {
  const { code, message } = (error ?? {}) as { code?: string; message?: string };
  return (
    code === 'MODULE_NOT_FOUND' ||
    (typeof message === 'string' && /cannot find module|unable to resolve module/i.test(message))
  );
};

/**
 * Loads an optional peer that has a native side, and returns it only when that native side is
 * linked into the app. `load` must call `require` with a string literal directly inside its own
 * try block: Metro only treats a require as optional when it's lexically inside a try block (and
 * webpack/Re.Pack the same), so the require can't live in a callback passed to a try elsewhere.
 *
 * - not installed: returns null, silently.
 * - installed but the native side isn't linked (Expo Go without the module, no rebuild yet, an
 *   unsupported platform): returns null and warns once in development.
 * - installed and linked: returns the module.
 */
export function resolveOptionalNativeModule<T>({
  packageName,
  load,
  isNativeAvailable,
}: {
  packageName: string;
  load: () => LoadResult<T>;
  isNativeAvailable: () => boolean;
}): T | null {
  const result = load();
  const mod = 'module' in result && result.module != null ? result.module : null;
  // Some packages throw while being required when their native module is missing (for example the
  // datetimepicker's TurboModuleRegistry.getEnforcing calls on Android), so only a "module not
  // found" error means the package isn't installed.
  const installed = 'module' in result ? mod !== null : !isModuleNotFound(result.error);

  let available = false;
  if (mod !== null) {
    try {
      available = isNativeAvailable();
    } catch {
      available = false;
    }
  }

  if (__DEV__ && installed && !available) {
    console.warn(
      `[storybook/controls] ${packageName} is installed but its native module is not available, ` +
        'falling back to the JavaScript control. Rebuild your app after installing it ' +
        '(npx expo prebuild / pod install).'
    );
  }

  return available ? mod : null;
}

export function hasViewManager(name: string): boolean {
  try {
    return UIManager.hasViewManagerConfig?.(name) === true;
  } catch {
    return false;
  }
}

export function hasNativeModule(name: string): boolean {
  try {
    // `get` (not `getEnforcing`) returns null instead of throwing. On the old architecture it falls
    // back to NativeModules.
    return TurboModuleRegistry.get(name) != null;
  } catch {
    return false;
  }
}

/** The platforms the native date picker supports. tvOS, macOS and others use the JS fallback. */
const supportsNativeDatePicker = () =>
  (Platform.OS === 'ios' || Platform.OS === 'android') && !Platform.isTV;

/**
 * `@react-native-community/datetimepicker` (v8+) is a view (`RNDateTimePicker`) on iOS, and a pair
 * of dialog modules (`RNCDatePicker`, `RNCTimePicker`) on Android.
 */
export function isDateTimePickerNativeAvailable(): boolean {
  if (!supportsNativeDatePicker()) {
    return false;
  }

  if (Platform.OS === 'android') {
    return hasNativeModule('RNCDatePicker') && hasNativeModule('RNCTimePicker');
  }

  return hasViewManager('RNDateTimePicker');
}

const supportedSliderPlatforms = ['android', 'ios', 'windows', 'web'];

/** `@react-native-community/slider` renders the `RNCSlider` view, and its own JS slider on web. */
export function isSliderNativeAvailable(): boolean {
  if (!supportedSliderPlatforms.includes(Platform.OS)) {
    return false;
  }

  if (Platform.OS === 'web') {
    return true;
  }

  return hasViewManager('RNCSlider');
}

function loadDateTimePicker(): LoadResult<DateTimePickerModule> {
  try {
    return { module: require('@react-native-community/datetimepicker') };
  } catch (error) {
    return { error };
  }
}

function loadSlider(): LoadResult<SliderModule> {
  try {
    return { module: require('@react-native-community/slider') };
  } catch (error) {
    return { error };
  }
}

let dateTimePicker: { value: DateTimePickerModule | null } | undefined;

export function getDateTimePicker(): DateTimePickerModule | null {
  if (!dateTimePicker) {
    dateTimePicker = {
      value: supportsNativeDatePicker()
        ? resolveOptionalNativeModule<DateTimePickerModule>({
            packageName: '@react-native-community/datetimepicker',
            load: loadDateTimePicker,
            isNativeAvailable: isDateTimePickerNativeAvailable,
          })
        : null,
    };
  }

  return dateTimePicker.value;
}

let slider: { value: SliderModule['default'] | null } | undefined;

export function getNativeSlider(): SliderModule['default'] | null {
  if (!slider) {
    const mod = supportedSliderPlatforms.includes(Platform.OS)
      ? resolveOptionalNativeModule<SliderModule>({
          packageName: '@react-native-community/slider',
          load: loadSlider,
          isNativeAvailable: isSliderNativeAvailable,
        })
      : null;
    slider = { value: mod?.default ?? null };
  }

  return slider.value;
}

/** Test helper: forget the cached modules. */
export function resetOptionalNativeModules() {
  dateTimePicker = undefined;
  slider = undefined;
}
