import React from 'react';
import { Typeset } from './Typeset';

import { DocsPageWrapper } from './DocsPage';

export default {
  title: 'Docs|Typeset',
  Component: Typeset,
  decorators: [getStory => <DocsPageWrapper>{getStory()}</DocsPageWrapper>],
};

const fontSizes = [12, 14, 16, 20, 24, 32, 40, 48];
const fontWeight = 900;

export const withFontSizes = () => <Typeset fontSizes={fontSizes} />;
export const withFontWeight = () => <Typeset fontSizes={fontSizes} fontWeight={fontWeight} />;
export const withWeightText = () => (
  <Typeset fontSizes={fontSizes} fontWeight={fontWeight} sampleText="Heading" />
);
