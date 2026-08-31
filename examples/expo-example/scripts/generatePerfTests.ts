import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const template = (num: number) => `import type { Meta, StoryObj } from '@storybook/react-native';
import { Pressable, Text, View } from 'react-native';
import { fn } from 'storybook/test';

type Test${num}Props = {
  label: string;
  count: number;
  enabled: boolean;
  tone: 'red' | 'green' | 'blue';
  accentColor: string;
  tags: string[];
  metadata: {
    suite: string;
    index: number;
  };
  onPress: (value: number) => void;
};

const toneMap = {
  red: '#d95d39',
  green: '#2a9d8f',
  blue: '#457b9d',
} as const;

const Test${num} = ({
  label,
  count,
  enabled,
  tone,
  accentColor,
  tags,
  metadata,
  onPress,
}: Test${num}Props) => {
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f5f1e8',
      }}
    >
      <Pressable
        onPress={() => onPress(count)}
        style={{
          borderRadius: 16,
          padding: 18,
          backgroundColor: enabled ? toneMap[tone] : '#b8b8b8',
          borderWidth: 3,
          borderColor: accentColor,
          opacity: enabled ? 1 : 0.65,
        }}
      >
        <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
          {label}
        </Text>
        <Text style={{ color: '#ffffff', marginBottom: 4 }}>Count: {count}</Text>
        <Text style={{ color: '#ffffff', marginBottom: 4 }}>Tags: {tags.join(', ')}</Text>
        <Text style={{ color: '#ffffff' }}>
          {metadata.suite} #{metadata.index}
        </Text>
      </Pressable>
    </View>
  );
};

const meta = {
  title: 'PerfTesting/Test${num}',
  component: Test${num},
  args: {
    label: 'Perf story ${num}',
    count: ${num},
    enabled: true,
    tone: '${num % 3 === 0 ? 'blue' : num % 2 === 0 ? 'green' : 'red'}',
    accentColor: '${num % 3 === 0 ? '#6d597a' : num % 2 === 0 ? '#264653' : '#e76f51'}',
    tags: ['perf', 'generated', 'test-${num}'],
    metadata: {
      suite: 'PerfTesting',
      index: ${num},
    },
    onPress: fn(),
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      description: 'Primary label shown in the perf test card',
    },
    count: {
      control: { type: 'number' },
      description: 'Numeric value displayed and sent to the action callback',
    },
    enabled: {
      control: { type: 'boolean' },
      description: 'Toggles the active visual state',
    },
    tone: {
      options: ['red', 'green', 'blue'],
      control: { type: 'select' },
      description: 'Selects the base card tone',
    },
    accentColor: {
      control: { type: 'color' },
      description: 'Border color for the card',
    },
    tags: {
      // @ts-expect-error - array control type is not typed
      control: { type: 'array' },
      description: 'Tag list rendered inside the card',
    },
    metadata: {
      control: { type: 'object' },
      description: 'Extra structured data shown in the card',
    },
    onPress: {
      action: 'pressed',
      description: 'Fires when the card is pressed',
    },
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
} satisfies Meta<typeof Test${num}>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
export const one: StoryObj<typeof meta> = { args: { count: ${num} + 1 } };
export const two: StoryObj<typeof meta> = { args: { enabled: false } };
export const three: StoryObj<typeof meta> = { args: { tone: 'green' } };
export const four: StoryObj<typeof meta> = { args: { tone: 'blue' } };
export const five: StoryObj<typeof meta> = { args: { accentColor: '#1d3557' } };
export const six: StoryObj<typeof meta> = { args: { label: 'Generated variant ${num}-6' } };
export const seven: StoryObj<typeof meta> = { args: { tags: ['perf', 'variant', 'seven'] } };
export const eight: StoryObj<typeof meta> = { args: { metadata: { suite: 'PerfTesting', index: ${num} * 10 } } };
export const nine: StoryObj<typeof meta> = { args: { count: ${num} * 2, enabled: false } };
export const ten: StoryObj<typeof meta> = { args: { label: 'Ten', tone: 'red' } };
export const eleven: StoryObj<typeof meta> = { args: { accentColor: '#ffb703', tags: ['warm', 'perf', 'eleven'] } };
export const twelve: StoryObj<typeof meta> = { args: { label: 'Twelve', count: ${num} + 12 } };
export const thirteen: StoryObj<typeof meta> = { args: { metadata: { suite: 'Generated', index: 13 } } };
export const fourteen: StoryObj<typeof meta> = { args: { tone: 'green', accentColor: '#2b9348' } };
export const fifteen: StoryObj<typeof meta> = { args: { label: 'Fifteen', enabled: false, tone: 'blue' } };
export const sixteen: StoryObj<typeof meta> = { args: { tags: ['sixteen', 'controls', 'actions'] } };
export const seventeen: StoryObj<typeof meta> = { args: { count: ${num} + 17, accentColor: '#8338ec' } };
export const eighteen: StoryObj<typeof meta> = { args: { label: 'Eighteen', metadata: { suite: 'PerfTesting', index: ${num} + 18 } } };
export const nineteen: StoryObj<typeof meta> = { args: { tone: 'blue', tags: ['nineteen', 'perf', 'final'] } };`;
// ESM doesn't provide __dirname natively, so use import.meta.url workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateFiles = () => {
  const baseDir = path.join(__dirname, '../components/PerfTesting');

  // Create directory if it doesn't exist
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  // Generate files from Test11 to Test50 (since Test1-10 already exist)
  for (let i = 1; i <= 200; i++) {
    const fileName = `Test${i}.stories.tsx`;
    const filePath = path.join(baseDir, fileName);

    fs.writeFileSync(filePath, template(i));
    console.log(`Generated ${fileName}`);
  }
};

generateFiles();
