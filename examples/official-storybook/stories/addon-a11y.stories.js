import React from 'react';
import Faker from 'faker';
import { storiesOf } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';

import { checkA11y } from '@storybook/addon-a11y';
import BaseButton from '../components/BaseButton';
import DelayedRender from '../components/DelayedRender';
import Button from '../components/addon-a11y/Button';
import Image from '../components/addon-a11y/Image';
import * as Form from '../components/addon-a11y/Form';
import * as Typography from '../components/addon-a11y/Typography';

const text = 'Testing the a11y addon';

storiesOf('Addons|a11y', module)
  .addDecorator(checkA11y)
  .addDecorator(fn => {
    setOptions({ selectedAddonPanel: '@storybook/addon-a11y/panel' });
    return fn();
  })
  .add('Default', () => <BaseButton label="" />)
  .add('Label', () => <BaseButton label={text} />)
  .add('Disabled', () => <BaseButton disabled label={text} />)
  .add('Invalid contrast', () => (
    // FIXME has no effect on score
    <BaseButton style={{ color: 'black', backgroundColor: 'black' }} label={text} />
  ))
  .add('delayed render', () => (
    <DelayedRender>
      <BaseButton label="This button has a delayed render of 1s" />
    </DelayedRender>
  ));

storiesOf('Addons|a11y/Button', module)
  .addDecorator(checkA11y)
  .add('Default', () => <Button />)
  .add('Content', () => <Button content={text} />)
  .add('Label', () => <Button label={text} />)
  .add('Disabled', () => <Button disabled content={text} />)
  .add('Invalid contrast', () => <Button contrast="wrong" content={Faker.lorem.words()} />);

const label = Faker.lorem.word();
const placeholder = Faker.lorem.word();

storiesOf('Addons|a11y/Form', module)
  .addDecorator(checkA11y)
  .add('Without Label', () => <Form.Row input={<Form.Input />} />)
  .add('With label', () => (
    <Form.Row label={<Form.Label content={label} id="1" />} input={<Form.Input id="1" />} />
  ))
  .add('With placeholder', () => (
    <Form.Row input={<Form.Input id="1" placeholder={placeholder} />} />
  ));

const image = Faker.image.animals();
const alt = Faker.lorem.words();

storiesOf('Addons|a11y/Image', module)
  .addDecorator(checkA11y)
  .add('Without alt', () => <Image src={image} />)
  .add('With alt', () => <Image src={image} alt={alt} />)
  .add('Presentation', () => <Image presentation src={image} />);

// eslint-disable-next-line no-script-url
const href = 'javascript:void 0';

storiesOf('Addons|a11y/Typography', module)
  .addDecorator(checkA11y)
  .add('Correct', () => (
    <div>
      <Typography.Heading level={1}>{Faker.lorem.sentence()}</Typography.Heading>

      <Typography.Text>{Faker.lorem.paragraph()}</Typography.Text>

      <Typography.Link content={`${Faker.lorem.words(4)}...`} href={href} />
    </div>
  ))
  .add('Empty Heading', () => <Typography.Heading level={2} />)
  .add('Empty Paragraph', () => <Typography.Text />)
  .add('Empty Link', () => <Typography.Link href={href} />)
  .add('Link without href', () => <Typography.Link content={`${Faker.lorem.words(4)}...`} />);
