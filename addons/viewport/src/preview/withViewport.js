import React from 'react';

import Viewport from './components/Viewport';

export default function withViewport(nameOrOptions) {
  const options = typeof nameOrOptions === 'string' ? { name: nameOrOptions } : nameOrOptions;

  const decorator = getStory => context => (
    <Viewport context={context} {...options}>
      {getStory()}
    </Viewport>
  );

  return (getStory, context) => {
    if (typeof context === 'undefined') {
      return decorator(getStory);
    }
    return decorator(getStory)(context);
  };
}
