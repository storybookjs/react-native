/* eslint-disable */
import React from 'react';
import Button from './Button';

// If we have multiple storiesOf calls, export multiple defaults. It's not valid
// JS but will still save the user time in converting.

export default {
  title: 'Button1',
};
export const story1 = () => <Button label="Button1" />;

export default {
  title: 'Button2',
}
export const story1 = () => <Button label="Button2" />;
