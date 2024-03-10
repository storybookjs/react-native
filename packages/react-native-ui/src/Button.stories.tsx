import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';

import { View } from 'react-native';
import { Path, Svg, SvgProps } from 'react-native-svg';
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

const FaceHappyIcon = ({ color, width = 14, height = 14, ...props }: SvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 14" fill="none" {...props}>
      <Path
        d="M3.968 8.75a.5.5 0 00-.866.5A4.498 4.498 0 007 11.5c1.666 0 3.12-.906 3.898-2.25a.5.5 0 10-.866-.5A3.498 3.498 0 017 10.5a3.498 3.498 0 01-3.032-1.75zM5.5 5a1 1 0 11-2 0 1 1 0 012 0zM9.5 6a1 1 0 100-2 1 1 0 000 2z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 7A7 7 0 110 7a7 7 0 0114 0zm-1 0A6 6 0 111 7a6 6 0 0112 0z"
        fill={color}
      />
    </Svg>
  );
};

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
