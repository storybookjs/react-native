import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';

import { Button, Select, Textarea } from './input';
import { Spaced } from '../grid/grid';

storiesOf('Components|Form/Select', module)
  .addDecorator(withKnobs)
  .add('sizes', () => (
    <Spaced>
      {['auto', 'flex', '100%'].map(size => (
        <div style={{ display: 'flex' }}>
          <Select key={size} value="val2" onChange={action('onChange')} size={size}>
            <option value="val1">Value 1</option>
            <option value="val2">Value 2</option>
            <option value="val3">Value 3</option>
          </Select>
        </div>
      ))}
    </Spaced>
  ))
  .add('validations', () => (
    <Spaced>
      {['error', 'warn', 'valid', null].map(valid => (
        <Select key={valid} value="val2" onChange={action('onChange')} size="100%" valid={valid}>
          <option value="val1">Value 1</option>
          <option value="val2">Value 2</option>
          <option value="val3">Value 3</option>
        </Select>
      ))}
    </Spaced>
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
    <Spaced>
      {['auto', 'flex', '100%'].map(size => (
        <div style={{ display: 'flex' }}>
          <Button key={size} size={size}>
            click this button
          </Button>
        </div>
      ))}
    </Spaced>
  ))
  .add('validations', () => (
    <Spaced>
      {['error', 'warn', 'valid', null].map(valid => (
        <div style={{ display: 'flex' }}>
          <Button key={valid} size="100%" valid={valid}>
            click this button
          </Button>
        </div>
      ))}
    </Spaced>
  ))
  .add('alignment', () => (
    <Spaced>
      {['end', 'center', 'start'].map(align => (
        <div style={{ display: 'flex' }}>
          <Button key={align} size="100%" align={align}>
            click this button
          </Button>
        </div>
      ))}
    </Spaced>
  ));

storiesOf('Components|Form/Textarea', module)
  .addDecorator(withKnobs)
  .add('with knobs (controlled)', () => (
    <Textarea value={text('Name', `OMG, multiple lines!\n\nThat is amazing`)} size="100%" />
  ))
  .add('sizes', () => (
    <Spaced>
      {['auto', 'flex', '100%'].map(size => (
        <div style={{ display: 'flex' }}>
          <Textarea key={size} defaultValue="text" size={size} />
        </div>
      ))}
    </Spaced>
  ))
  .add('validations', () => (
    <Spaced>
      {['error', 'warn', 'valid', null].map(valid => (
        <div style={{ display: 'flex' }}>
          <Textarea key={valid} defaultValue="text" size="100%" valid={valid} />
        </div>
      ))}
    </Spaced>
  ))
  .add('alignment', () => (
    <Spaced>
      {['end', 'center', 'start'].map(align => (
        <div style={{ display: 'flex' }}>
          <Textarea key={align} defaultValue="text" size="100%" align={align} />
        </div>
      ))}
    </Spaced>
  ));
