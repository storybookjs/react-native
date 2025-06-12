import * as fs from 'fs';
import * as path from 'path';

const template = (num: number) => `import { Meta, StoryObj } from '@storybook/react-native'
import { View } from 'react-native'

const Test${num} = () => {
  return <View style={{ flex: 1, backgroundColor: 'red' }} />
}

const meta: Meta<typeof Test${num}> = {
  title: 'PerfTesting/Test${num}',
  component: Test${num},
}

export default meta

export const Default: StoryObj<typeof Test${num}> = {}
export const one: StoryObj<typeof Test${num}> = {}
export const two: StoryObj<typeof Test${num}> = {}
export const three: StoryObj<typeof Test${num}> = {}
export const four: StoryObj<typeof Test${num}> = {}
export const five: StoryObj<typeof Test${num}> = {}
export const six: StoryObj<typeof Test${num}> = {}
export const seven: StoryObj<typeof Test${num}> = {}
export const eight: StoryObj<typeof Test${num}> = {}
export const nine: StoryObj<typeof Test${num}> = {}
export const ten: StoryObj<typeof Test${num}> = {}
export const eleven: StoryObj<typeof Test${num}> = {}
export const twelve: StoryObj<typeof Test${num}> = {}
export const thirteen: StoryObj<typeof Test${num}> = {}
export const fourteen: StoryObj<typeof Test${num}> = {}
export const fifteen: StoryObj<typeof Test${num}> = {}
export const sixteen: StoryObj<typeof Test${num}> = {}
export const seventeen: StoryObj<typeof Test${num}> = {}
export const eighteen: StoryObj<typeof Test${num}> = {}
export const nineteen: StoryObj<typeof Test${num}> = {}`;

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
