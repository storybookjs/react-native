import React from 'react';

export interface DocsContextProps {
  id?: string;
  selectedKind?: string;
  selectedStory?: string;

  /**
   * mdxKind is a statically-generated "kind" that corresponds to the
   * component that's being documented in the MDX file, It's combined
   * with the MDX story name `<Story name='story name'>...</Story>` to
   * generate a storyId. In the case that the user is viewing a non-MDX
   * story, the value of `mdxKind` will be the currently-selected kind.
   * (I can't remember the corner case in which using the currentl-selected
   * kind breaks down in MDX-defined stories, but there is one!)
   */
  mdxKind?: string;
  parameters?: any;
  storyStore?: any;
  forceRender?: () => void;
}

export const DocsContext: React.Context<DocsContextProps> = React.createContext({});
