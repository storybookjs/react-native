import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';

import { View } from 'react-native';

import { Button } from './Button';
import { FaceHappyIcon } from './icon/FaceHappyIcon';

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

export const Variants: Story = {
  render: (args) => (
    <Stack>
      <Row>
        <Button variant="solid" text="Solid" {...args} />
        <Button variant="outline" text="Outline" {...args} />
        <Button variant="ghost" text="Ghost" {...args} />
      </Row>
      <Row>
        <Button variant="solid" {...args} Icon={FaceHappyIcon} text="Solid" />
        <Button variant="outline" Icon={FaceHappyIcon} text="Outline" {...args} />
        <Button variant="ghost" Icon={FaceHappyIcon} text="Ghost" {...args} />
      </Row>
      <Row>
        <Button variant="solid" padding="small" Icon={FaceHappyIcon} {...args} />
        <Button variant="outline" padding="small" Icon={FaceHappyIcon} {...args} />
        <Button variant="ghost" padding="small" Icon={FaceHappyIcon} {...args} />
      </Row>
    </Stack>
  ),
};

export const Active: Story = {
  args: {
    active: true,
    text: 'Button',
    Icon: FaceHappyIcon,
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
    Icon: FaceHappyIcon,
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
    Icon: FaceHappyIcon,
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
        <Button animation="glow" text="Button" Icon={FaceHappyIcon} {...args} />
        <Button animation="jiggle" text="Button" Icon={FaceHappyIcon} {...args} />
        <Button animation="rotate360" Icon={FaceHappyIcon} text="Button" {...args} />
      </Row>
      <Row>
        <Button animation="glow" padding="small" Icon={FaceHappyIcon} {...args} />
        <Button animation="jiggle" padding="small" Icon={FaceHappyIcon} {...args} />
        <Button animation="rotate360" padding="small" Icon={FaceHappyIcon} {...args} />
      </Row>
    </Stack>
  ),
};
