import { Context, createContext } from 'react';

export const ZoomContext: Context<{ scale: number }> = createContext({
  scale: 1,
});
