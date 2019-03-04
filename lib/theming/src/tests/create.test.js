import { create } from '../create';

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

    expect(result.color).toHaveProperty('primary', 'orange');
  });
  it('should merge colorSecondary', () => {
    const result = create({ base: 'light', colorSecondary: 'orange' });

    expect(result.color).toHaveProperty('secondary', 'orange');
  });
  it('should merge appBg', () => {
    const result = create({ base: 'light', appBg: 'orange' });

    expect(result.background).toHaveProperty('app', 'orange');
  });
});

describe('create brand', () => {
  it('should have default', () => {
    const result = create({ base: 'light' });

    expect(result.brand).toEqual({
      image: undefined,
      title: undefined,
      url: undefined,
    });
  });
  it('should accept null', () => {
    const result = create({ base: 'light', brandTitle: null, brandUrl: null, brandImage: null });

    expect(result.brand).toEqual({
      image: null,
      title: null,
      url: null,
    });
  });
  it('should accept values', () => {
    const result = create({
      base: 'light',
      brandImage: 'https://placehold.it/350x150',
      brandTitle: 'my custom storybook',
      brandUrl: 'https://example.com',
    });

    expect(result.brand).toEqual({
      image: 'https://placehold.it/350x150',
      title: 'my custom storybook',
      url: 'https://example.com',
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
