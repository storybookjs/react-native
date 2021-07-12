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
# Markdown

* Promises are working
* This is notes and also a very long string to test the word wrapping. Test test test test.
* Does it overlap?
      `,
    }
  )
  .add('nothing', () => <Button text="test4" onPress={() => null} />);
