import React from 'react';
import styled from '@emotion/styled';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Input, Button, Select, Textarea } from './input/input';
import Field from './field/field';
import { Spaced } from '../grid/grid';

const Flexed = styled.div({ display: 'flex' });

storiesOf('Components|Form/Field', module).add('field', () => (
  <Field key="key" label="label">
    <Select value="val2" onChange={action('onChange')} size={1}>
      <option value="val1">Value 1</option>
      <option value="val2">Value 2</option>
      <option value="val3">Value 3</option>
    </Select>
  </Field>
));

storiesOf('Components|Form/Select', module)
  .add('sizes', () => (
    <Spaced>
      {['auto', 'flex', '100%'].map(size => (
        <Flexed key={size}>
          <Select value="val2" onChange={action('onChange')} size={size}>
            <option value="val1">Value 1</option>
            <option value="val2">Value 2</option>
            <option value="val3">Value 3</option>
          </Select>
        </Flexed>
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
  ))
  .add('alignment', () => (
    <Spaced>
      {['end', 'center', 'start'].map(align => (
        <Select key={align} value="val2" onChange={action('onChange')} size="100%" align={align}>
          <option value="val1">Value 1</option>
          <option value="val2">Value 2</option>
          <option value="val3">Value 3</option>
        </Select>
      ))}
    </Spaced>
  ));

storiesOf('Components|Form/Button', module)
  .add('sizes', () => (
    <Spaced>
      {['auto', 'flex', '100%'].map(size => (
        <Flexed key={size}>
          <Button size={size}>click this button</Button>
        </Flexed>
      ))}
    </Spaced>
  ))
  .add('validations', () => (
    <Spaced>
      {['error', 'warn', 'valid', null].map(valid => (
        <Flexed key={valid}>
          <Button size="100%" valid={valid}>
            click this button
          </Button>
        </Flexed>
      ))}
    </Spaced>
  ))
  .add('alignment', () => (
    <Spaced>
      {['end', 'center', 'start'].map(align => (
        <Flexed key={align}>
          <Button size="100%" align={align}>
            click this button
          </Button>
        </Flexed>
      ))}
    </Spaced>
  ));

storiesOf('Components|Form/Textarea', module)
  .add('sizes', () => (
    <Spaced>
      {['auto', 'flex', '100%'].map(size => (
        <Flexed key={size}>
          <Textarea defaultValue="text" size={size} />
        </Flexed>
      ))}
    </Spaced>
  ))
  .add('validations', () => (
    <Spaced>
      {['error', 'warn', 'valid', null].map(valid => (
        <Flexed key={valid}>
          <Textarea defaultValue="text" size="100%" valid={valid} />
        </Flexed>
      ))}
    </Spaced>
  ))
  .add('alignment', () => (
    <Spaced>
      {['end', 'center', 'start'].map(align => (
        <Flexed key={align}>
          <Textarea defaultValue="text" size="100%" align={align} />
        </Flexed>
      ))}
    </Spaced>
  ));

storiesOf('Components|Form/Input', module)
  .add('sizes', () => (
    <Spaced>
      {['auto', 'flex', '100%'].map(size => (
        <Flexed key={size}>
          <Input defaultValue="text" size={size} />
        </Flexed>
      ))}
    </Spaced>
  ))
  .add('validations', () => (
    <Spaced>
      {['error', 'warn', 'valid', null].map(valid => (
        <Flexed key={valid}>
          <Input defaultValue="text" size="100%" valid={valid} />
        </Flexed>
      ))}
    </Spaced>
  ))
  .add('alignment', () => (
    <Spaced>
      {['end', 'center', 'start'].map(align => (
        <Flexed key={align}>
          <Input defaultValue="text" size="100%" align={align} />
        </Flexed>
      ))}
    </Spaced>
  ));
