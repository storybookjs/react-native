import React from 'react';
import Markdown from 'markdown-to-jsx';
import { ResetWrapper } from '../typography/DocumentFormatting';

export interface DescriptionProps {
  markdown: string;
}

/**
 * A markdown description for a component, typically used to show the
 * components docgen docs.
 */
export const Description: React.FunctionComponent<DescriptionProps> = ({ markdown }) => (
  <ResetWrapper>
    <Markdown options={{ forceBlock: true }}>{markdown}</Markdown>
  </ResetWrapper>
);
