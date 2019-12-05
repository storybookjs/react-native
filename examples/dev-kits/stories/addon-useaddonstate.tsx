import React from 'react';
import { Button } from '@storybook/react/demo';
import { useAddonState } from '@storybook/client-api';

export default {
  title: 'addons|useAddonState',
};

export const variant1 = () => {
  const [state, setState] = useAddonState<string>('test', 'fooo');

  return (
    <div>
      Click to change from preview:
      <br />
      <br />
      <Button
        onClick={() => {
          setState(state === 'baz' ? 'fooo' : 'baz');
        }}
      >
        {state}
      </Button>
    </div>
  );
};
