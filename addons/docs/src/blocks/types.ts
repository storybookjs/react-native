import { PropsTableProps } from '@storybook/components';

export interface StoryData {
  id: string;
  kind: string;
  name: string;
  parameters?: any;
}

export interface DocsStoryProps {
  id: string;
  name: string;
  expanded?: boolean;
  withToolbar?: boolean;
  parameters?: any;
}

export interface SlotContext {
  id?: string;
  selectedKind?: string;
  selectedStory?: string;
  parameters?: any;
  storyStore?: any;
}

export type StringSlot = (context: SlotContext) => string;
export type PropsSlot = (context: SlotContext) => PropsTableProps | void;
export type StorySlot = (stories: StoryData[], context: SlotContext) => DocsStoryProps | void;
export type StoriesSlot = (stories: StoryData[], context: SlotContext) => DocsStoryProps[] | void;

export interface DocsPageProps {
  titleSlot: StringSlot;
  subtitleSlot: StringSlot;
  descriptionSlot: StringSlot;
  primarySlot: StorySlot;
  propsSlot: PropsSlot;
  storiesSlot: StoriesSlot;
}
