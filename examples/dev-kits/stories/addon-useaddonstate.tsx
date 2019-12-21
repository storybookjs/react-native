import React from 'react';
import { Button } from '@storybook/react/demo';
import { useAddonState } from '@storybook/client-api';

export default {
  title: 'addons|useAddonState',
};

export const managerDefault = () => {
  const [state, setState] = useAddonState<number>('manager');

  return (
    <div style={{ color: 'white' }}>
      Manager counter: {state}
      <br />
      <Button onClick={() => setState(state - 1)}>decrement</Button>
      <Button onClick={() => setState(state + 1)}>increment</Button>
    </div>
  );
};

export const previewDefault = () => {
  const [state, setState] = useAddonState<number>('preview', 50);

  return (
    <div style={{ color: 'white' }}>
      Preview counter: {state}
      <br />
      <Button onClick={() => setState(state - 1)}>decrement</Button>
      <Button onClick={() => setState(state + 1)}>increment</Button>
    </div>
  );
};
