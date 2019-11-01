import React from 'react';

import { storiesOf } from '@storybook/react';

import { Button } from '@storybook/react/demo';

for (let i = 0; i < 1; i += 1) {
  const randomDemoName = Math.random()
    .toString(36)
    .substring(7);
  const stories = storiesOf(`Perf.${randomDemoName}`);

  for (let j = 0; j < 10; j += 1) {
    stories
      .add(`with text ${j}`, () => <Button>Hello Button</Button>)
      .add(`with emoji ${j}`, () => (
        <Button>
          <span role="img" aria-label="so cool">
            😀 😎 👍 💯
          </span>
        </Button>
      ));
  }
}
