import React from 'react';
import { storiesOf } from '@storybook/react';

import { checkA11y } from './../../../src';

import * as Typography from './components';

import Faker from 'faker';

const href = "javascript:void 0";

storiesOf('<Typography />', module)
  .addDecorator(checkA11y)
  .add('Correct', () => (
    <div>
      <Typography.Heading level={1}>
        {Faker.lorem.sentence()}
      </Typography.Heading>

      <Typography.Text>
        {Faker.lorem.paragraph()}
      </Typography.Text>

      <Typography.Link
        content={`${Faker.lorem.words(4)}...`}
        href={href}
      />
    </div>
  ))
  .add('Empty Heading', () => (
    <Typography.Heading level={2} />
  ))
  .add('Empty Paragraph', () => (
    <Typography.Text />
  ))
  .add('Empty Link', () => (
    <Typography.Link href={href} />
  ))
  .add('Link without href', () => (
    <Typography.Link content={`${Faker.lorem.words(4)}...`} />
  ));
