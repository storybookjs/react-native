import { IStory } from '@storybook/angular';

declare module '@storybook/addon-centered/angular' {
  export function centered(story: IStory): IStory;
}
