import React from 'react';
import { ColorItem, ColorPalette } from './ColorPalette';

export default {
  title: 'Docs|ColorPalette',
  component: ColorPalette,
};

export const defaultStyle = () => (
  <ColorPalette>
    <ColorItem
      title="theme.color.greyscale"
      subtitle="Some of the greys"
      colors={['#FFFFFF', '#F8F8F8', '#F3F3F3']}
    />
    <ColorItem title="theme.color.primary" subtitle="Coral" colors={['#FF4785']} />
    <ColorItem title="theme.color.secondary" subtitle="Ocean" colors={['#1EA7FD']} />
    <ColorItem
      title="theme.color.positive"
      subtitle="Green"
      colors={[
        'rgba(102,191,60,1)',
        'rgba(102,191,60,.8)',
        'rgba(102,191,60,.6)',
        'rgba(102,191,60,.3)',
      ]}
    />
  </ColorPalette>
);
