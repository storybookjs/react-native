import React from 'react';
import { Button } from '@storybook/react/demo';

export default {
  title: 'Addons/Docs/csf-with-mdx-docs',
  component: Button,
  includeStories: [], // or don't load this file at all
};

// eslint-disable-next-line react/prop-types
export const basic = ({ parameters }) => <Button>Basic</Button>;
