import React from 'react';
import { storiesOf } from '@storybook/react';

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
  .addParameters({ options: { selectedAddonPanel: '@storybook/addon-a11y/panel' } })
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
  .add('Invalid contrast', () => <Button contrast="wrong" content={text} />);

storiesOf('Addons|a11y/Form', module)
  .addDecorator(checkA11y)
  .add('Without Label', () => <Form.Row input={<Form.Input />} />)
  .add('With label', () => (
    <Form.Row label={<Form.Label content={text} id="1" />} input={<Form.Input id="1" />} />
  ))
  .add('With placeholder', () => <Form.Row input={<Form.Input id="1" placeholder={text} />} />);

const image = 'http://placehold.it/350x150';

storiesOf('Addons|a11y/Image', module)
  .addDecorator(checkA11y)
  .add('Without alt', () => <Image src={image} />)
  .add('With alt', () => <Image src={image} alt={text} />)
  .add('Presentation', () => <Image presentation src={image} />);

// eslint-disable-next-line no-script-url
const href = 'javascript:void 0';

storiesOf('Addons|a11y/Typography', module)
  .addDecorator(checkA11y)
  .add('Correct', () => (
    <div>
      <Typography.Heading level={1}>{text}</Typography.Heading>

      <Typography.Text>{text}</Typography.Text>

      <Typography.Link content={`${text}...`} href={href} />
    </div>
  ))
  .add('Empty Heading', () => <Typography.Heading level={2} />)
  .add('Empty Paragraph', () => <Typography.Text />)
  .add('Empty Link', () => <Typography.Link href={href} />)
  .add('Link without href', () => <Typography.Link content={`${text}...`} />);
