import { PropsTableProps } from '@storybook/components';

export interface StoryData {
  id?: string;
  kind?: string;
  name?: string;
  parameters?: any;
}

export type DocsStoryProps = StoryData & {
  expanded?: boolean;
  withToolbar?: boolean;
};

export interface SlotContext {
  id?: string;
  selectedKind?: string;
  selectedStory?: string;
  parameters?: any;
  storyStore?: any;
}

export type StringSlot = (context: SlotContext) => string;
export type PropsSlot = (context: SlotContext) => PropsTableProps;
export type StorySlot = (stories: StoryData[], context: SlotContext) => DocsStoryProps;
export type StoriesSlot = (stories: StoryData[], context: SlotContext) => DocsStoryProps[];

export interface DocsPageProps {
  titleSlot: StringSlot;
  subtitleSlot: StringSlot;
  descriptionSlot: StringSlot;
  primarySlot: StorySlot;
  propsSlot: PropsSlot;
  storiesSlot: StoriesSlot;
}
