import {
  addStorybookAddonToFile,
  storybookAddonScope,
  getPackageName,
  getInstalledStorybookVersion,
  getPackageArg,
} from './add';

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

describe('getInstalledStorybookVersion should return the correct Storybook version', () => {
  test('when single official Storybook package is installed', () => {
    expect(
      getInstalledStorybookVersion({
        devDependencies: {
          '@storybook/react': '^4.0.0-alpha.22',
        },
      })
    ).toBe('^4.0.0-alpha.22');
  });

  test('when no official Storybook package is installed', () => {
    expect(
      getInstalledStorybookVersion({
        devDependencies: {
          'random package': '^4.0.0-alpha.22',
        },
      })
    ).toBeFalsy();
  });

  test('when an unofficial package with "storybook" in its name is installed', () => {
    expect(
      getInstalledStorybookVersion({
        devDependencies: {
          'not-storybook': '^4.0.0-alpha.22',
        },
      })
    ).toBeFalsy();
  });
});

describe('getPackageArg returns the correct package argument to install', () => {
  const officialAddonName = 'knob';
  const randomAddonName = 'random';
  const officialAddonNameWithTag = `${officialAddonName}@alpha`;
  const randomAddonNameWithTag = `${randomAddonName}@latest`;

  test('when it is an official Storybook addon without any Storybook package installed', () => {
    expect(
      getPackageArg(officialAddonName, true, {
        devDependencies: {},
      })
    ).toBe(officialAddonName);
  });

  test('when it is a random addon without any Storybook package installed', () => {
    expect(
      getPackageArg(randomAddonName, true, {
        devDependencies: {},
      })
    ).toBe(randomAddonName);
  });

  test('when it is a random addon with tag without any Storybook package installed', () => {
    expect(
      getPackageArg(randomAddonNameWithTag, true, {
        devDependencies: {},
      })
    ).toBe(randomAddonNameWithTag);
  });

  test('when it is an official addon with tag without any Storybook package installed', () => {
    expect(
      getPackageArg(officialAddonNameWithTag, true, {
        devDependencies: {},
      })
    ).toBe(officialAddonNameWithTag);
  });

  test('when it is an official addon with tag with a Storybook package installed', () => {
    expect(
      getPackageArg(officialAddonNameWithTag, true, {
        devDependencies: {
          '@storybook/html': '^4.0.0-alpha.21',
        },
      })
    ).toBe(`${officialAddonName}@^4.0.0-alpha.21`);
  });

  test('when it is an official addon with a Storybook package installed', () => {
    expect(
      getPackageArg(officialAddonName, true, {
        devDependencies: {
          '@storybook/html': '^4.0.0-alpha.21',
        },
      })
    ).toBe(`${officialAddonName}@^4.0.0-alpha.21`);
  });
});
