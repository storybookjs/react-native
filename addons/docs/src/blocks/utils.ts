import { DocsContextProps } from './DocsContext';
import { StoryData } from './types';

export const getDocsStories = (context: DocsContextProps): StoryData[] => {
  const { storyStore, selectedKind } = context;
  return storyStore
    .getStoriesForKind(selectedKind)
    .filter((s: any) => !(s.parameters && s.parameters.docs && s.parameters.docs.disable));
};
