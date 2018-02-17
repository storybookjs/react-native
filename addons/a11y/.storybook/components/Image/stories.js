import React from 'react';
import { storiesOf } from '@storybook/react';

import { checkA11y } from './../../../src';

import Image from './component';

import Faker from 'faker';

const image = Faker.image.animals();
const alt = Faker.lorem.words();

storiesOf('<Image />', module)
  .addDecorator(checkA11y)
  .add('Without alt', () => (
    <Image src={image} />
  ))
  .add('With alt', () => (
    <Image
      src={image}
      alt={alt}
    />
  ))
  .add('Presentation', () => (
    <Image
      presentation
      src={image}
    />
  ));
