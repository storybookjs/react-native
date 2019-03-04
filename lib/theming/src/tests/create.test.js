import { create, convert } from '../create';
import darkThemeVars from '../themes/dark';
import lightThemeVars from '../themes/light';

describe('create base', () => {
  it('should create a theme with minimal viable theme', () => {
    const result = create({ base: 'light' });

    expect(result).toBeDefined();
  });
  it('should pick `light` when `base` is missing', () => {
    const result = create({ base: undefined });

    expect(result.base).toBe('light');
  });
  it('should pick `light` when nothing is given', () => {
    const result = create();

    expect(result.base).toBe('light');
  });
  it('should pick `dark` when base is dark', () => {
    const result = create({ base: 'dark' });

    expect(result.base).toBe('dark');
  });
  it('should pick `light` when base is a unknown value', () => {
    const result = create({ base: 'foobar' });

    expect(result.base).toBe('light');
  });
});

describe('create merge', () => {
  it('should merge colorPrimary', () => {
    const result = create({ base: 'light', colorPrimary: 'orange' });

    expect(result).toHaveProperty('colorPrimary', 'orange');
  });
  it('should merge colorSecondary', () => {
    const result = create({ base: 'light', colorSecondary: 'orange' });

    expect(result).toHaveProperty('colorSecondary', 'orange');
  });
  it('should merge appBg', () => {
    const result = create({ base: 'light', appBg: 'orange' });

    expect(result).toHaveProperty('appBg', 'orange');
  });
});

describe('create brand', () => {
  it('should have default', () => {
    const result = create({ base: 'light' });

    expect(result.brandImage).not.toBeDefined();
    expect(result.brandTitle).not.toBeDefined();
    expect(result.brandUrl).not.toBeDefined();
  });
  it('should accept null', () => {
    const result = create({ base: 'light', brandTitle: null, brandUrl: null, brandImage: null });

    expect(result).toMatchObject({
      brandImage: null,
      brandTitle: null,
      brandUrl: null,
    });
  });
  it('should accept values', () => {
    const result = create({
      base: 'light',
      brandImage: 'https://placehold.it/350x150',
      brandTitle: 'my custom storybook',
      brandUrl: 'https://example.com',
    });

    expect(result).toMatchObject({
      brandImage: 'https://placehold.it/350x150',
      brandTitle: 'my custom storybook',
      brandUrl: 'https://example.com',
    });
  });
});

describe('create extend', () => {
  it('should allow custom props', () => {
    const result = create(
      {
        base: 'light',
      },
      {
        myCustomProperty: 42,
      }
    );

    expect(result.myCustomProperty).toEqual(42);
  });
  it('should not allow overriding known properties with custom props', () => {
    const result = create(
      {
        base: 'light',
      },
      {
        base: 42,
      }
    );

    expect(result.base).toEqual('light');
  });
});

describe('convert', () => {
  it('should return the default theme when no params', () => {
    const result = convert();

    expect(result.base).toEqual('light');
  });
  it('should return a valid dark theme', () => {
    const result = convert(darkThemeVars);

    expect(result.base).toEqual('dark');
    expect(result).toMatchObject({
      color: expect.objectContaining({
        primary: '#FF4785',
        secondary: '#1EA7FD',
      }),
      background: expect.objectContaining({
        app: '#2f2f2f',
      }),
    });
  });
  it('should return a valid light theme', () => {
    const result = convert(lightThemeVars);

    expect(result.base).toEqual('light');
    expect(result).toMatchObject({
      color: expect.objectContaining({
        primary: '#FF4785',
        secondary: '#1EA7FD',
      }),
      background: expect.objectContaining({
        app: '#F6F9FC',
      }),
    });
  });
});
