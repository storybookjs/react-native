import React from 'react';
import { Button } from '@storybook/react/demo';
import { useAddonState } from '@storybook/client-api';

export default {
  title: 'addons|useAddonState',
};

export const variant1 = () => {
  const [state, setState] = useAddonState<number>('test');

  return (
    <div>
      Preview counter: {state}
      <br />
      <Button onClick={() => setState(state - 1)}>decrement</Button>
      <Button onClick={() => setState(state + 1)}>increment</Button>
    </div>
  );
};
