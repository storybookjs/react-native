import React from 'react';

export interface DocsContextProps {
  id?: string;
  selectedKind?: string;
  selectedStory?: string;

  /**
   * mdxStoryNameToId is an MDX-compiler-generated mapping of an MDX story's
   * display name to its storyId. It's used internally by the `<Story>`
   * doc block.
   */
  mdxStoryNameToId?: Record<string, string>;
  parameters?: any;
  storyStore?: any;
  forceRender?: () => void;
}

export const DocsContext: React.Context<DocsContextProps> = React.createContext({});
