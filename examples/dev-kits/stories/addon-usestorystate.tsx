import React from 'react';
import { Button } from '@storybook/react/demo';
import { useStoryState } from '@storybook/client-api';

export default {
  title: 'addons|useAddonState',
};

export const storyState1 = () => {
  const [state, setState] = useStoryState<number>(10);

  return (
    <div style={{ color: 'white' }}>
      Story counter: {state}
      <br />
      <Button onClick={() => setState(state - 1)}>decrement</Button>
      <Button onClick={() => setState(state + 1)}>increment</Button>
    </div>
  );
};

export const storyState2 = () => {
  const [state, setState] = useStoryState<number>(10);

  return (
    <div style={{ color: 'white' }}>
      Story counter: {state}
      <br />
      <Button onClick={() => setState(state - 1)}>decrement</Button>
      <Button onClick={() => setState(state + 1)}>increment</Button>
    </div>
  );
};
