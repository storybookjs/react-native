import React from 'react';

import * as Form from './components';

import { storiesOf } from '@storybook/react';
import { checkA11y } from './../../../src';

import Faker from 'faker';

const label = Faker.lorem.word();
const placeholder = Faker.lorem.word();

storiesOf('<Form />', module)
  .addDecorator(checkA11y)
  .add('Without Label', () => (
    <Form.Row
      input={<Form.Input />}
    />
  ))
  .add ('With label', () => (
    <Form.Row
      label={<Form.Label
        content={label}
        id="1"
      />}
      input={<Form.Input id="1" />}
    />
  ))
  .add ('With placeholder', () => (
    <Form.Row
      input={<Form.Input
        id="1"
        placeholder={placeholder}
      />}
    />
  ))
