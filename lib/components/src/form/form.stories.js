import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';

import { Button, Select, Textarea } from './input';

storiesOf('Components|Form/Select', module)
  .addDecorator(withKnobs)
  .add('sizes', () => (
    <Fragment>
      {['auto', 'flex', '100%'].map(size => (
        <Select key={size} value="val2" onChange={action('onChange')} size={size}>
          <option value="val1">Value 1</option>
          <option value="val2">Value 2</option>
          <option value="val3">Value 3</option>
        </Select>
      ))}
    </Fragment>
  ))
  .add('validations', () => (
    <Fragment>
      {['error', 'warn', 'valid', null].map(valid => (
        <Select key={valid} value="val2" onChange={action('onChange')} size="100%" valid={valid}>
          <option value="val1">Value 1</option>
          <option value="val2">Value 2</option>
          <option value="val3">Value 3</option>
        </Select>
      ))}
    </Fragment>
  ));
storiesOf('Components|Form/Button', module)
  .addDecorator(withKnobs)
  .add('with knobs', () => (
    <Button onClick={action('send loveletter')}>
      {`💌  love letter to `}
      {text('Name', 'storybook team')}
    </Button>
  ))
  .add('sizes', () => (
    <Fragment>
      {['auto', 'flex', '100%'].map(size => (
        <Button key={size} size={size}>
          click this button
        </Button>
      ))}
    </Fragment>
  ))
  .add('validations', () => (
    <Fragment>
      {['error', 'warn', 'valid', null].map(valid => (
        <Button key={valid} size="100%" valid={valid}>
          click this button
        </Button>
      ))}
    </Fragment>
  ))
  .add('alignment', () => (
    <Fragment>
      {['end', 'center', 'start'].map(align => (
        <Button key={align} size="100%" align={align}>
          click this button
        </Button>
      ))}
    </Fragment>
  ));

storiesOf('Components|Form/Textarea', module)
  .addDecorator(withKnobs)
  .add('with knobs (controlled)', () => (
    <Textarea value={text('Name', `OMG, multiple lines!\n\nThat is amazing`)} size="100%" />
  ))
  .add('sizes', () => (
    <Fragment>
      {['auto', 'flex', '100%'].map(size => (
        <Textarea key={size} defaultValue="text" size={size} />
      ))}
    </Fragment>
  ))
  .add('validations', () => (
    <Fragment>
      {['error', 'warn', 'valid', null].map(valid => (
        <Textarea key={valid} defaultValue="text" size="100%" valid={valid} />
      ))}
    </Fragment>
  ))
  .add('alignment', () => (
    <Fragment>
      {['end', 'center', 'start'].map(align => (
        <Textarea key={align} defaultValue="text" size="100%" align={align} />
      ))}
    </Fragment>
  ));
