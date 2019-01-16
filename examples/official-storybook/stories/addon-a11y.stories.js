import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';

import { Typography, Form } from '@storybook/components';
import BaseButton from '../components/BaseButton';
import DelayedRender from '../components/DelayedRender';
import Button from '../components/addon-a11y/Button';

const text = 'Testing the a11y addon';
const image = 'http://placehold.it/350x150';
// eslint-disable-next-line no-script-url
const href = 'javascript:void 0';

storiesOf('Addons|A11y/BaseButton', module)
  .addParameters({ options: { selectedPanel: 'storybook/a11y/panel' } })
  .add('Default', () => <BaseButton label="" />)
  .add('Label', () => <BaseButton label={text} />)
  .add('Disabled', () => <BaseButton disabled label={text} />)
  .add('Invalid contrast', () => (
    // FIXME: has no effect on score
    <BaseButton style={{ color: 'black', backgroundColor: 'black' }} label={text} />
  ))
  .add('delayed render', () => (
    <DelayedRender>
      <BaseButton label="This button has a delayed render of 1s" />
    </DelayedRender>
  ));

storiesOf('Addons|A11y/Button', module)
  .addParameters({ options: { selectedPanel: 'storybook/a11y/panel' } })
  .add('Default', () => <Button />)
  .add('Content', () => <Button content={text} />)
  .add('Label', () => <Button label={text} />)
  .add('Disabled', () => <Button disabled content={text} />)
  .add('Invalid contrast', () => <Button contrast="wrong" content={text} />);

storiesOf('Addons|A11y/Form', module)
  .addParameters({ options: { selectedPanel: 'storybook/a11y/panel' } })
  .add('Without Label', () => (
    <Form.Field label="">
      <Form.Input />
    </Form.Field>
  ))
  .add('With label', () => (
    <Form.Field label={text}>
      <Form.Input id="1" />
    </Form.Field>
  ))
  .add('With placeholder', () => (
    <Form.Field label="">
      <Form.Input id="1" placeholder={text} />
    </Form.Field>
  ));

storiesOf('Addons|A11y/Image', module)
  .addParameters({ options: { selectedPanel: 'storybook/a11y/panel' } })
  .add('Without alt', () => <Typography.Image src={image} />)
  .add('With alt', () => <Typography.Image src={image} alt={text} />)
  .add('Presentation', () => <Typography.Image role="presentation" src={image} />);

storiesOf('Addons|A11y/Typography', module)
  .addParameters({ options: { selectedPanel: 'storybook/a11y/panel' } })
  .add('Correct', () => (
    <Fragment>
      <Typography.Heading el="h1">{text}</Typography.Heading>
      <Typography.Text>{text}</Typography.Text>
      <Typography.Link href={href}>{`${text}...`}</Typography.Link>
    </Fragment>
  ))
  .add('Empty Heading', () => <Typography.Heading level={2} />)
  .add('Empty Paragraph', () => <Typography.Text />)
  .add('Empty Link', () => <Typography.Link href={href} />)
  .add('Link without href', () => <Typography.Link>{`${text}...`}</Typography.Link>);
