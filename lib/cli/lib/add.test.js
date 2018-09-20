import { addStorybookAddonToFile, storybookAddonScope } from './add';

describe('addStorybookAddonToFile should correctly register an Storybook addon', () => {
  test('to an empty array', () => {
    expect(addStorybookAddonToFile('addon-name', [])).toEqual([
      `import '${storybookAddonScope}addon-name/register';`,
    ]);
  });

  test('to an empty file', () => {
    expect(addStorybookAddonToFile('addon-name', [''])).toEqual([
      `import '${storybookAddonScope}addon-name/register';`,
      '',
    ]);
  });

  test('to an addons file with existing addons registered', () => {
    expect(
      addStorybookAddonToFile('addon-name', [
        "import '@storybook/addon-actions/register';",
        "import '@storybook/addon-links/register';",
        '',
      ])
    ).toEqual([
      "import '@storybook/addon-actions/register';",
      "import '@storybook/addon-links/register';",
      `import '${storybookAddonScope}addon-name/register';`,
      '',
    ]);
  });

  test('to an addons file with more than only imports', () => {
    expect(
      addStorybookAddonToFile('addon-name', [
        "import '@storybook/addon-links/register';",
        "import '@storybook/addon-actions/register';",
        '',
        '//some other stuff',
        '',
        'and more stuff',
        '',
      ])
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
      addStorybookAddonToFile('addon-name', [
        "import '@storybook/addon-actions/register';",
        "import '@storybook/addon-links/register';",
        `import '${storybookAddonScope}addon-name/register';`,
        '',
      ])
    ).toEqual([
      "import '@storybook/addon-actions/register';",
      "import '@storybook/addon-links/register';",
      `import '${storybookAddonScope}addon-name/register';`,
      '',
    ]);
  });
});
