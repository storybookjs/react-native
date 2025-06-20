# @storybook/react-native-test

Test utilities for React Native Storybook, including automated screenshot testing with Maestro.

## Installation

```bash
npm install --save-dev @storybook/react-native-test
# or
yarn add --dev @storybook/react-native-test
```

## Commands

### `gen-maestro`

Generate Maestro test files for all your Storybook stories.

```bash
npx @storybook/react-native-test gen-maestro [options]
```

Options:

- `-c, --config-dir <path>` - Path to Storybook config directory (default: ./.rnstorybook)
- `-o, --output-dir <path>` - Output directory for maestro files (default: ./.maestro)
- `-a, --app-id <id>` - App ID for maestro tests (default: host.exp.Exponent)
- `-u, --base-uri <uri>` - Base URI for deep links (default: exp://127.0.0.1:8081/--/)
- `-n, --test-name <name>` - Name for the maestro test file (default: storybook-screenshots)

### `screenshot-stories`

Take screenshots of all Storybook stories and compare them against baselines.

```bash
npx @storybook/react-native-test screenshot-stories [options]
```

Options:

- All options from `gen-maestro` plus:
- `-b, --baseline-dir <path>` - Directory containing baseline screenshots (default: ./.maestro/baseline)
- `-s, --screenshots-dir <path>` - Directory for new screenshots (default: ./.maestro/screenshots)
- `-d, --diffs-dir <path>` - Directory for diff images (default: ./.maestro/diffs)
- `-t, --tolerance <number>` - Tolerance for image comparison (default: 2.5)
- `--strict` - Use strict image comparison
- `--skip-generate` - Skip generating maestro test file
- `--skip-test` - Skip running maestro tests
- `--skip-compare` - Skip comparing screenshots
- `--update-baseline` - Copy current screenshots to baseline directory

### `compare-screenshots`

Compare screenshots against baseline images.

```bash
npx @storybook/react-native-test compare-screenshots [options]
```

Options:

- `-s, --screenshots-dir <path>` - Directory containing new screenshots (default: ./.maestro/screenshots)
- `-b, --baseline-dir <path>` - Directory containing baseline screenshots (default: ./.maestro/baseline)
- `-d, --diffs-dir <path>` - Directory for diff images (default: ./.maestro/diffs)
- `-t, --tolerance <number>` - Tolerance for image comparison (default: 2.5)
- `--strict` - Use strict image comparison
- `--update-baseline` - Copy current screenshots to baseline directory

## Example Workflow

1. Take screenshots of all stories and set them as baseline:

```bash
npx @storybook/react-native-test screenshot-stories --update-baseline
```

2. After making changes, take new screenshots and compare against baseline:

```bash
npx @storybook/react-native-test screenshot-stories
```

3. If changes are intentional, update the baseline:

```bash
npx @storybook/react-native-test screenshot-stories --update-baseline
```

4. For CI, you might want to skip generation if test files already exist:

```bash
npx @storybook/react-native-test screenshot-stories --skip-generate
```

Alternative workflow using separate commands:

```bash
# Take screenshots
npx @storybook/react-native-test screenshot-stories --skip-compare

# Update baseline separately
npx @storybook/react-native-test compare-screenshots --update-baseline
```
