export interface Background {
  name: string;
  value: string;
}

/**
 * @deprecated No longer needed. Backgrounds are now built into StoryView.
 * You can safely remove this decorator from your preview config.
 */
export const withBackgrounds = (storyFn: any) => storyFn();
