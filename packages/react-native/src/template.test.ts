import * as fs from 'fs';
import * as path from 'path';

describe('React Native CLI template', () => {
  test('uses React Native Storybook types in the Page story', () => {
    const pageStory = fs.readFileSync(
      path.resolve(__dirname, '../template/cli/stories/Page.stories.tsx'),
      'utf8'
    );

    expect(pageStory).toContain("import type { Meta, StoryObj } from '@storybook/react-native';");
    expect(pageStory).not.toContain("from '@storybook/react';");
    expect(pageStory).toContain('} satisfies Meta<typeof Page>;');
    expect(pageStory).toContain('type Story = StoryObj<typeof meta>;');
    expect(pageStory).toContain('export const Default: Story = {};');
  });
});
