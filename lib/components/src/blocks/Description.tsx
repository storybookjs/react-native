import React from 'react';
import Markdown from 'markdown-to-jsx';

export interface DescriptionProps {
  markdown: string;
}

export const Description: React.FunctionComponent<DescriptionProps> = ({ markdown }) => (
  <Markdown options={{ forceBlock: true }}>{markdown}</Markdown>
);
