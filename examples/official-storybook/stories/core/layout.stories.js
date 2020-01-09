import React from 'react';

// eslint-disable-next-line react/prop-types
const Box = ({ children, display = 'block' }) => (
  <div style={{ display, border: '2px solid #FF4785', padding: 10 }}>{children}</div>
);

export default {
  title: 'Core/Layout',
};

export const Default = () => <Box>padded by default</Box>;

export const PaddedBlock = () => <Box>padded</Box>;
PaddedBlock.story = { parameters: { layout: 'padded' } };

export const PaddedInline = () => <Box display="inline-block">padded</Box>;
PaddedInline.story = { parameters: { layout: 'padded' } };

export const FullscreenBlock = () => <Box>fullscreen</Box>;
FullscreenBlock.story = { parameters: { layout: 'fullscreen' } };

export const FullscreenInline = () => <Box display="inline-block">fullscreen</Box>;
FullscreenInline.story = { parameters: { layout: 'fullscreen' } };

export const CenteredBlock = () => <Box>centered</Box>;
CenteredBlock.story = { parameters: { layout: 'centered' } };

export const CenteredInline = () => <Box display="inline-block">centered</Box>;
CenteredInline.story = { parameters: { layout: 'centered' } };

export const Invalid = () => <Box>invalid layout value</Box>;
CenteredInline.story = { parameters: { layout: '!invalid!' } };
