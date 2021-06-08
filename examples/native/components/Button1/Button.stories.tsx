import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import { Button } from './Button';

storiesOf('button promise', module)
  .add(
    'finally',
    () => {
      const [text, setText] = useState('Do a promise');
      const testing = () => {
        const timeout = new Promise<string>((resolve) => {
          setTimeout(() => {
            resolve('Promise resolved');
          }, 1000);
        });
        timeout
          .then((res: string) => {
            setText(res);
          })
          .finally(() => {
            setText('Done!');
          });
      };
      return <Button text={text} onPress={testing} />;
    },
    {
      notes: `
# Markdown!\n
* Promises are working finally!
* [storybook!](https://storybook.js.org)
`,
    }
  )
  .add('nothing', () => <Button text="test4" onPress={() => null} />);
