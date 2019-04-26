/* eslint-disable no-param-reassign */
import { NgModuleMetadata } from './types';

export const moduleMetadata = (metadata: Partial<NgModuleMetadata>) => (storyFn: () => any) => {
  const story = storyFn();
  const storyMetadata = story.moduleMetadata || {};
  metadata = metadata || {};

  return {
    ...story,
    moduleMetadata: {
      declarations: [...(metadata.declarations || []), ...(storyMetadata.declarations || [])],
      entryComponents: [
        ...(metadata.entryComponents || []),
        ...(storyMetadata.entryComponents || []),
      ],
      imports: [...(metadata.imports || []), ...(storyMetadata.imports || [])],
      schemas: [...(metadata.schemas || []), ...(storyMetadata.schemas || [])],
      providers: [...(metadata.providers || []), ...(storyMetadata.providers || [])],
    },
  };
};
