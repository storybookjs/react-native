import React from 'react';

export const ZoomContext: React.Context<{ scale: number }> = React.createContext({
  scale: 1,
});
