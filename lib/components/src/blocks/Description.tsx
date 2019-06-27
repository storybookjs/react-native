import React from 'react';
import Markdown from 'markdown-to-jsx';

export interface DescriptionProps {
  markdown: string;
}

/**
 * A markdown description for a component, typically used to show the
 * components docgen docs.
 */
export const Description: React.FunctionComponent<DescriptionProps> = ({ markdown }) => (
  <Markdown options={{ forceBlock: true }}>{markdown}</Markdown>
);
