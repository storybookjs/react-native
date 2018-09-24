import { addStorybookAddonToFile, storybookAddonScope, getPackageName } from './add';

describe('addStorybookAddonToFile should correctly register an Storybook addon', () => {
  test('to an empty array', () => {
    expect(addStorybookAddonToFile('addon-name', [], true)).toEqual([
      `import '${storybookAddonScope}addon-name/register';`,
    ]);
  });

  test('to an empty file', () => {
    expect(addStorybookAddonToFile('addon-name', [''], true)).toEqual([
      `import '${storybookAddonScope}addon-name/register';`,
      '',
    ]);
  });

  test('to an addons file with existing addons registered', () => {
    expect(
      addStorybookAddonToFile(
        'addon-name',
        [
          "import '@storybook/addon-actions/register';",
          "import '@storybook/addon-links/register';",
          '',
        ],
        true
      )
    ).toEqual([
      "import '@storybook/addon-actions/register';",
      "import '@storybook/addon-links/register';",
      `import '${storybookAddonScope}addon-name/register';`,
      '',
    ]);
  });

  test('to an addons file with more than only imports', () => {
    expect(
      addStorybookAddonToFile(
        'addon-name',
        [
          "import '@storybook/addon-links/register';",
          "import '@storybook/addon-actions/register';",
          '',
          '//some other stuff',
          '',
          'and more stuff',
          '',
        ],
        true
      )
    ).toEqual([
      "import '@storybook/addon-links/register';",
      "import '@storybook/addon-actions/register';",
      `import '${storybookAddonScope}addon-name/register';`,
      '',
      '//some other stuff',
      '',
      'and more stuff',
      '',
    ]);
  });

  test('to an addon file with it already being installed by not duplicating it', () => {
    expect(
      addStorybookAddonToFile(
        'addon-name',
        [
          "import '@storybook/addon-actions/register';",
          "import '@storybook/addon-links/register';",
          `import '${storybookAddonScope}addon-name/register';`,
          '',
        ],
        true
      )
    ).toEqual([
      "import '@storybook/addon-actions/register';",
      "import '@storybook/addon-links/register';",
      `import '${storybookAddonScope}addon-name/register';`,
      '',
    ]);
  });

  test('to an addons file if it is not an official addon', () => {
    expect(
      addStorybookAddonToFile(
        'addon-name',
        [
          "import '@storybook/addon-actions/register';",
          "import '@storybook/addon-links/register';",
          '',
        ],
        false
      )
    ).toEqual([
      "import '@storybook/addon-actions/register';",
      "import '@storybook/addon-links/register';",
      `import 'addon-name/register';`,
      '',
    ]);
  });
});

describe('getPackageName should correctly return the full package name', () => {
  test('on a normal addon', () => {
    const name = 'normal-addon';
    expect(getPackageName(name, false)).toBe(name);
  });
  test('on an official addon', () => {
    const name = 'official-addon';
    expect(getPackageName(name, true)).toBe(storybookAddonScope + name);
  });
});
