import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';

import { Image, View } from 'react-native';

import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  args: {},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const Stack = ({ children }: { children: ReactNode }) => (
  <View style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</View>
);

const Row = ({ children }: { children: ReactNode }) => (
  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
    {children}
  </View>
);

export const Base: Story = {};
const Icon = () => <Image source={require('./assets/react-native-logo.png')} />;
export const Variants: Story = {
  render: (args) => (
    <Stack>
      <Row>
        <Button variant="solid" text="Solid" {...args} />
        <Button variant="outline" text="Outline" {...args} />
        <Button variant="ghost" text="Ghost" {...args} />
      </Row>
      <Row>
        <Button variant="solid" {...args} Icon={Icon} text="Solid" />
        <Button variant="outline" Icon={Icon} text="Outline" {...args} />
        <Button variant="ghost" Icon={Icon} text="Ghost" {...args} />
      </Row>
      <Row>
        <Button variant="solid" padding="small" Icon={Icon} {...args} />
        <Button variant="outline" padding="small" Icon={Icon} {...args} />
        <Button variant="ghost" padding="small" Icon={Icon} {...args} />
      </Row>
    </Stack>
  ),
};

export const Active: Story = {
  args: {
    active: true,
    text: 'Button',
    Icon,
  },
  render: (args) => (
    <Row>
      <Button variant="solid" {...args} />
      <Button variant="outline" {...args} />
      <Button variant="ghost" {...args} />
    </Row>
  ),
};

export const WithIcon: Story = {
  args: {
    Icon,
    text: 'Button',
  },
  render: (args) => (
    <Row>
      <Button variant="solid" {...args} />
      <Button variant="outline" {...args} />
      <Button variant="ghost" {...args} />
    </Row>
  ),
};

export const IconOnly: Story = {
  args: {
    padding: 'small',
    Icon,
  },
  render: (args) => (
    <Row>
      <Button variant="solid" {...args} />
      <Button variant="outline" {...args} />
      <Button variant="ghost" {...args} />
    </Row>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Row>
      <Button size="small" text="Small Button" />
      <Button size="medium" text="Medium Button" />
    </Row>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    text: 'Disabled Button',
  },
};

export const Animated: Story = {
  args: {
    variant: 'outline',
  },
  render: (args) => (
    <Stack>
      <Row>
        <Button animation="glow" text="Button" {...args} />
        <Button animation="jiggle" text="Button" {...args} />
        <Button animation="rotate360" text="Button" {...args} />
      </Row>
      <Row>
        <Button animation="glow" text="Button" Icon={Icon} {...args} />
        <Button animation="jiggle" text="Button" Icon={Icon} {...args} />
        <Button animation="rotate360" Icon={Icon} text="Button" {...args} />
      </Row>
      <Row>
        <Button animation="glow" padding="small" Icon={Icon} {...args} />
        <Button animation="jiggle" padding="small" Icon={Icon} {...args} />
        <Button animation="rotate360" padding="small" Icon={Icon} {...args} />
      </Row>
    </Stack>
  ),
};
