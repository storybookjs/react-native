---
sidebar_position: 5
description: Learn how to test React Native components with Storybook using portable stories, Jest integration, and visual regression testing with Maestro.
keywords:
  [
    react native,
    storybook,
    testing,
    jest,
    maestro,
    portable stories,
    visual testing,
    component testing,
  ]
---

# Testing with Storybook

Storybook provides testing capabilities for React Native components through portable stories and integration with testing frameworks like Jest and custom setups with Maestro.

## Portable Stories

Portable stories allow you to reuse your Storybook stories in external testing environments like Jest. This enables better shareability and maintenance between writing tests and writing stories.

### Setup

Install the required testing dependencies:

```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest
```

#### Jest Configuration

Configure Jest for React Native in your `jest.config.js`:

```javascript
/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo', // or 'react-native'
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@storybook/.*)',
  ],
};

module.exports = config;
```

#### Setup File

Create a `setup-jest.ts` file for test configuration:

```typescript
// setup-jest.ts
import 'react-native-gesture-handler/jestSetup';
```

### Using composeStories

The `composeStories` utility processes all stories from a CSF file and returns them as testable components:

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as stories from './Button.stories';

// Every story is returned as a composed component
const { Primary, Secondary, Disabled } = composeStories(stories);

test('renders primary button with default args', () => {
  render(<Primary />);
  const buttonElement = screen.getByText('Click me');
  expect(buttonElement).toBeTruthy();
});

test('renders primary button with overridden props', () => {
  // Props override story args
  render(<Primary title="Custom Title" />);
  const buttonElement = screen.getByText('Custom Title');
  expect(buttonElement).toBeTruthy();
});

test('renders disabled button correctly', () => {
  render(<Disabled />);
  const buttonElement = screen.getByRole('button');
  expect(buttonElement).toBeDisabled();
});
```

### Using composeStory

For testing individual stories, use `composeStory`:

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import { composeStory } from '@storybook/react';
import meta, { Primary } from './Button.stories';

test('button click handler is called', () => {
  const PrimaryStory = composeStory(Primary, meta);
  const onPressSpy = jest.fn();

  render(<PrimaryStory onPress={onPressSpy} />);

  const button = screen.getByText('Click me');
  fireEvent.press(button);

  expect(onPressSpy).toHaveBeenCalled();
});
```

### Project Annotations Setup

For stories that use global decorators or parameters, set up project annotations:

```typescript
// setup-portable-stories.ts
import { setProjectAnnotations } from '@storybook/react';
import * as previewAnnotations from '../.rnstorybook/preview';

setProjectAnnotations(previewAnnotations);
```

Add this to your Jest setup:

```javascript
// jest.config.js
const config = {
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts', '<rootDir>/setup-portable-stories.ts'],
};
```

### Real-World Examples

#### Testing Controls

```typescript
// TextInput.test.tsx
import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';
import * as TextInputStories from './TextInput.stories';

const { Basic } = composeStories(TextInputStories);

test('text input renders with default placeholder', () => {
  render(<Basic />);

  const input = screen.getByPlaceholderText('Enter text...');
  expect(input).toBeTruthy();
});

test('text input can be customized via args', () => {
  render(<Basic placeholder="Custom placeholder" value="Test value" />);

  const input = screen.getByDisplayValue('Test value');
  expect(input).toBeTruthy();
});
```

### Test Organization

```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.stories.tsx
│   ├── Button.test.tsx          # Unit tests with portable stories
├── TextInput/
│   ├── TextInput.tsx
│   ├── TextInput.stories.tsx
│   └── TextInput.test.tsx
└── shared/
    ├── setup-jest.ts
    └── setup-portable-stories.ts
```

## End to End Testing Call for contribution

If you have experience with end-to-end testing in React Native using Storybook, please consider contributing to this section! We would love to include examples of using tools like Detox, Appium, or other frameworks for comprehensive E2E testing setups.

Also note that these docs are a work in progress, and we welcome contributions to improve the coverage of end-to-end testing scenarios.

## Visual Testing with Maestro

Right now there isn't a built-in way to do visual testing in Storybook for React Native, but you can use Maestro, Detox or other testing tools to automate testing of your Storybook stories.

[Maestro](https://maestro.mobile.dev/) is a mobile UI testing framework that can automate screenshot testing of your Storybook stories.

I also recommend setting onDeviceUI to false in your Storybook config to avoid issues with the Storybook UI interfering with screenshots.

### Setup

Install Maestro CLI:

```bash
# macOS
brew tap mobile-dev-inc/tap
brew install maestro

# Other platforms - see https://maestro.mobile.dev/getting-started/installing-maestro
```

### Maestro Configuration

Create a Maestro flow file for Storybook screenshot testing:

**`.maestro/storybook-screenshots.yaml`**

```yaml
appId: host.exp.Exponent # Replace with your app bundle ID
name: Take screenshots of all Storybook stories
---
- stopApp: host.exp.Exponent

# Story screenshots
# put your app uri scheme here, e.g. myapp://storybook/?STORYBOOK_STORY_ID=button--primary
- openLink: 'exp://127.0.0.1:8081/--/?STORYBOOK_STORY_ID=button--primary'
- waitForAnimationToEnd
- assertVisible:
    id: 'button--primary'
- takeScreenshot: '.maestro/screenshots/Button---Primary'

- openLink: 'exp://127.0.0.1:8081/--/?STORYBOOK_STORY_ID=button--secondary'
- waitForAnimationToEnd
- assertVisible:
    id: 'button--secondary'
- takeScreenshot: '.maestro/screenshots/Button---Secondary'
# Add more stories...
```

### Running Maestro Tests

Add scripts to your `package.json`:

Note I highly recommend using [Bun](https://bun.sh/) for running scripts, since you will experience less pain with esm/commonjs interop issues.

```json
{
  "scripts": {
    "generate-maestro-tests": "bun ./scripts/generate-maestro-tests.mts",
    "test:maestro": "maestro test .maestro/storybook-screenshots.yaml",
    "test:compare": "bun scripts/compare-screenshots.ts"
  }
}
```

Run the tests:

```bash
# Start your Expo/React Native app with Storybook
npm run start

# In another terminal, run Maestro tests
npm run test:maestro
```

### Automated Screenshot Generation

You can automatically generate Maestro test files from your stories:

```typescript
// scripts/generate-maestro-tests.ts
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

const run = async () => {
  const { buildIndex } = await import('storybook/internal/core-server');
  const index = await buildIndex({
    configDir: path.join(__dirname, '../.rnstorybook'),
  });

  // Ensure .maestro directory exists
  const maestroDir = path.join(__dirname, '../.maestro');
  mkdirSync(maestroDir, { recursive: true });

  // Generate Maestro test file content
  const stories = Object.values(index.entries)
    .filter((entry: any) => entry.type === 'story')
    .map((story: any) => ({
      id: story.id,
      name: story.title.replace(/\//g, '-') + ' - ' + story.name,
    }));

  const appId = 'host.exp.Exponent'; // Replace with your actual app ID if different

  const baseUri = 'exp://127.0.0.1:8081/--/'; // Replace with your actual base URI if different

  const maestroContent = `appId: ${appId}
name: Take screenshots of all Storybook stories
---
- stopApp: ${appId}

${stories
  .map(
    (story) => `# Story ${story.name}
- openLink: '${baseUri}?STORYBOOK_STORY_ID=${story.id}'
- waitForAnimationToEnd
- assertVisible:
    id: '${story.id}'
- takeScreenshot: '.maestro/screenshots/${story.name.replace(/ /g, '-')}'
`
  )
  .join('\n')}`;

  // Write the Maestro test file
  const maestroTestPath = path.join(maestroDir, 'storybook-screenshots.yaml');
  writeFileSync(maestroTestPath, maestroContent);

  console.log('Generated Maestro test file at:', maestroTestPath);
};

run()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
```

### Screenshot Comparison

Heres an example of how you can set up screenshot comparison to detect visual regressions:

```typescript
// scripts/compare-screenshots.ts
import * as fs from 'fs';
import * as path from 'path';
import looksSame from 'looks-same';
import { fileURLToPath } from 'url';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screenshotsDir = path.resolve(__dirname, '..', '.maestro', 'screenshots');
const baselineDir = path.resolve(__dirname, '..', '.maestro', 'baseline');
const diffsDir = path.resolve(__dirname, '..', '.maestro', 'diffs');

// Add debug logging
console.log('Paths:', {
  screenshotsDir,
  baselineDir,
  diffsDir,
});

async function compareScreenshots() {
  const screenshots = fs.readdirSync(screenshotsDir);
  console.log('screenshots', screenshots);
  for (const screenshot of screenshots) {
    const currentPath = path.join(screenshotsDir, screenshot);
    const baselinePath = path.join(baselineDir, screenshot);
    const diffPath = path.join(diffsDir, `diff_${screenshot}`);

    if (!fs.existsSync(baselinePath)) {
      console.log(`Baseline not found for ${screenshot}`);
      continue;
    }

    try {
      const result = await looksSame(baselinePath, currentPath, {
        strict: false,
        tolerance: 2.5,
        createDiffImage: true,
      });

      if (!result.equal) {
        await result.diffImage?.save(diffPath);
      }

      console.log(`${screenshot}: ${result.equal ? 'Match' : 'Differs'}`);
    } catch (error) {
      console.error(`Error comparing ${screenshot}:`, error);
    }
  }
}

compareScreenshots().catch(console.error);
```

## Best Practices

### Portable Stories

1. **Keep stories focused** - Each story should test a specific state or behavior
2. **Use meaningful story names** - Names become test descriptions
3. **Leverage args** - Use args for different test scenarios
4. **Test edge cases** - Create stories for error states, loading, etc.
5. **Mock dependencies** - Use decorators to mock external dependencies

### Visual Testing

1. **Stable screenshots** - Ensure animations complete before taking screenshots
2. **Consistent environment** - Use the same device/simulator for baseline images
3. **Organize screenshots** - Use clear naming conventions for screenshot files
4. **Version control baselines** - Commit baseline screenshots to track changes
5. **Review changes** - Always review visual differences before updating baselines

## Troubleshooting

### Common Issues

**Stories not found in tests:**

- Ensure story file paths are correct
- Check that stories are properly exported
- Verify `composeStories` import matches story file structure

**Missing decorators in tests:**

- Set up `setProjectAnnotations` with preview decorators
- Import addon decorators if stories depend on them

**Maestro test failures:**

- Check app ID matches your bundle identifier
- Ensure Storybook is running and accessible
- Verify story IDs match exactly (case-sensitive)
- Wait for animations to complete before assertions

**Performance issues:**

- Try using `jest --maxWorkers=1` jest tests if you encounter issues with parallel test execution
- Mock heavy dependencies in test setup
- Consider using `test.concurrent` for independent tests

## External tools

- [sherlo](https://sherlo.io/) - Visual Testing & Review Tool for React Native Storybook, similar to chromatic
- [loki](https://loki.js.org/) - Visual Regression Testing for Storybook
