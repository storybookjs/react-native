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
- `--html-report` - Generate HTML comparison report (when comparing)
- `--ignore-regions <regions>` - Ignore custom regions (format: "x,y,w,h;x2,y2,w2,h2")

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
- `--html-report` - Generate HTML comparison report
- `--ignore-regions <regions>` - Ignore custom regions (format: "x,y,w,h;x2,y2,w2,h2")

### `detect-ignore-regions`

Interactively select a diff image to extract ignore regions from.

```bash
npx @storybook/react-native-test detect-ignore-regions [options]
```

Options:

- `-d, --diffs-dir <path>` - Directory containing diff images (default: ./.maestro/diffs)

This command shows you a list of available diff images and lets you select one to analyze. It will then extract the diff regions (by analyzing colored diff pixels) and provide you with the exact coordinates to use in the `--ignore-regions` flag. Perfect for handling system UI differences that only affect certain screenshots.

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

## HTML Reports

Both `screenshot-stories` and `compare-screenshots` commands support generating detailed HTML comparison reports with the `--html-report` flag:

```bash
# Generate HTML report when comparing screenshots
npx @storybook/react-native-test screenshot-stories --html-report

# Or when running comparison separately
npx @storybook/react-native-test compare-screenshots --html-report
```

The HTML report shows:
- Summary statistics (total, matches, differences, missing baselines)
- Side-by-side comparison of baseline, current, and diff images
- Status badges for each screenshot (match, different, missing baseline)
- Mobile-responsive layout for easy viewing

The report is saved as `screenshot-comparison-report.html` in the output directory (usually `.maestro/`).

## Custom Ignore Regions

When running screenshot tests, you may encounter differences in system UI elements (like status bars, home indicators, or other dynamic content) that cause false positives. You can use the `--ignore-regions` flag to specify custom areas to ignore during comparison:

```bash
# Ignore specific regions when comparing (format: "x,y,width,height")
npx @storybook/react-native-test screenshot-stories --ignore-regions "0,800,390,44"

# Multiple regions separated by semicolons
npx @storybook/react-native-test screenshot-stories --ignore-regions "0,800,390,44;10,10,50,50"

# Or when running comparison separately
npx @storybook/react-native-test compare-screenshots --ignore-regions "0,800,390,44"
```

**Region Format:**
- Each region is specified as `x,y,width,height` (all in pixels)
- Multiple regions are separated by semicolons (`;`)
- Coordinates start from top-left (0,0)

**Common Use Cases:**
- **iOS Home Indicator**: `"0,800,390,44"` (adjust y-coordinate and width based on your device)
- **Status Bar**: `"0,0,390,47"` (top of screen)
- **Navigation Bar**: `"0,750,390,94"` (bottom area)

**Example Output:**
```bash
🎯 Parsed 2 custom ignore regions:
   Region 1: x=0, y=800, w=390, h=44
   Region 2: x=10, y=10, w=50, h=50
```

This approach gives you complete control over which areas to ignore, making it perfect for handling device-specific UI elements or any dynamic content that shouldn't affect your visual regression tests.

## Finding Ignore Regions

If you're seeing false positives from system UI differences, you can use the `detect-ignore-regions` command to extract exact coordinates from a diff image:

1. **First, run comparison without ignore regions to generate diff images:**
   ```bash
   npx @storybook/react-native-test screenshot-stories
   ```

2. **Interactively select and analyze a diff image:**
   ```bash
   npx @storybook/react-native-test detect-ignore-regions
   ```
   
   This will show you a list of available diff images. Choose one that shows the system UI differences you want to ignore (like a home indicator or status bar). The tool will analyze the colored diff pixels and extract rectangular regions.

3. **Use the suggested regions in future comparisons:**
   ```bash
   npx @storybook/react-native-test screenshot-stories --ignore-regions "0,800,390,44"
   ```

**Example interaction:**
```
📁 Found 5 diff images:

🎯 Which diff image would you like to analyze for ignore regions?
  1. Button--primary
  2. Text--heading
  3. Card--default
  4. Input--focused
  5. Header--with-back

Enter your choice (number): 5

✅ Selected: diff_Header--with-back.png

📊 Analyzing diff image: diff_Header--with-back.png
📐 Image dimensions: 390x844
🎯 Found 1847 diff pixels
📦 Found 2 potential ignore regions:
   Region 1: x=0, y=810, w=390, h=34 (area: 13260px)
   Region 2: x=15, y=60, w=30, h=20 (area: 600px)

📋 To use these ignore regions, run your comparison command with:

--ignore-regions "0,810,390,34;15,60,30,20"
```

This approach lets you pick the exact diff image that shows the problematic system UI and extract precise coordinates from it.
