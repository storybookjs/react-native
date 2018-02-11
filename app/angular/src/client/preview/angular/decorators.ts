import { NgModuleMetadata } from './types';

export const moduleMetadata = (metadata: Partial<NgModuleMetadata>) => (context: () => any) => ({
  moduleMetadata: metadata,
  ...context(),
});
