import { normalizeBackgrounds, resolveStoryBackgroundColor } from './utils';

const options = {
  light: { name: 'Light', value: '#ffffff' },
  dark: { name: 'Dark', value: '#333333' },
};

const legacy = {
  default: 'Dark',
  values: [
    { name: 'Light', value: '#ffffff' },
    { name: 'Dark', value: '#333333' },
  ],
};

describe('normalizeBackgrounds', () => {
  it('returns no options when there are no backgrounds parameters', () => {
    expect(normalizeBackgrounds(undefined)).toEqual({ options: {}, disabled: false });
    expect(normalizeBackgrounds({})).toEqual({ options: {}, disabled: false });
  });

  it('passes the options shape through without a default', () => {
    expect(normalizeBackgrounds({ options })).toEqual({ options, disabled: false });
  });

  it('converts the legacy values array to options keyed by name', () => {
    expect(normalizeBackgrounds(legacy)).toEqual({
      options: {
        Light: { name: 'Light', value: '#ffffff' },
        Dark: { name: 'Dark', value: '#333333' },
      },
      defaultKey: 'Dark',
      disabled: false,
    });
  });

  it('uses the first legacy value when default is missing or unknown', () => {
    expect(normalizeBackgrounds({ values: legacy.values }).defaultKey).toBe('Light');
    expect(normalizeBackgrounds({ ...legacy, default: 'Nope' }).defaultKey).toBe('Light');
  });

  it('prefers options when both shapes are present', () => {
    expect(normalizeBackgrounds({ ...legacy, options })).toEqual({ options, disabled: false });
  });

  it('reports disable', () => {
    expect(normalizeBackgrounds({ options, disable: true }).disabled).toBe(true);
  });
});

describe('resolveStoryBackgroundColor', () => {
  it('applies no background to stories without backgrounds parameters or globals', () => {
    expect(resolveStoryBackgroundColor(undefined)).toBeUndefined();
    expect(resolveStoryBackgroundColor({ parameters: {}, globals: {} })).toBeUndefined();
  });

  describe('options shape', () => {
    it('applies no background until a global is selected', () => {
      expect(
        resolveStoryBackgroundColor({ parameters: { backgrounds: { options } }, globals: {} })
      ).toBeUndefined();
    });

    it('resolves the selected global', () => {
      expect(
        resolveStoryBackgroundColor({
          parameters: { backgrounds: { options } },
          globals: { backgrounds: { value: 'dark' } },
        })
      ).toBe('#333333');
    });

    it('accepts a color as the global value', () => {
      expect(
        resolveStoryBackgroundColor({
          parameters: {},
          globals: { backgrounds: { value: '#123456' } },
        })
      ).toBe('#123456');
    });

    it('ignores an unknown global', () => {
      expect(
        resolveStoryBackgroundColor({
          parameters: { backgrounds: { options } },
          globals: { backgrounds: { value: 'maroon' } },
        })
      ).toBeUndefined();
    });

    it('applies nothing when disabled', () => {
      expect(
        resolveStoryBackgroundColor({
          parameters: { backgrounds: { options, disable: true } },
          globals: { backgrounds: { value: 'dark' } },
        })
      ).toBeUndefined();
    });
  });

  describe('legacy values shape', () => {
    it('applies the default when no global is set', () => {
      expect(
        resolveStoryBackgroundColor({ parameters: { backgrounds: legacy }, globals: {} })
      ).toBe('#333333');
    });

    it('applies the first value when there is no default', () => {
      expect(
        resolveStoryBackgroundColor({ parameters: { backgrounds: { values: legacy.values } } })
      ).toBe('#ffffff');
    });

    it('lets the global, set by the panel, override the default', () => {
      expect(
        resolveStoryBackgroundColor({
          parameters: { backgrounds: legacy },
          globals: { backgrounds: { value: 'Light' } },
        })
      ).toBe('#ffffff');
    });

    it('falls back to the default for a global from another story', () => {
      expect(
        resolveStoryBackgroundColor({
          parameters: { backgrounds: legacy },
          globals: { backgrounds: { value: 'maroon' } },
        })
      ).toBe('#333333');
    });

    it('applies nothing when disabled', () => {
      expect(
        resolveStoryBackgroundColor({ parameters: { backgrounds: { ...legacy, disable: true } } })
      ).toBeUndefined();
    });
  });
});
