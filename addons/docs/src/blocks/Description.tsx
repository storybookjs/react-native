import React, { FunctionComponent } from 'react';
import { Description, DescriptionProps as PureDescriptionProps } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';
import { Component, CURRENT_SELECTION } from './shared';
import { str } from '../lib/docgenUtils';

export enum DescriptionType {
  INFO = 'info',
  NOTES = 'notes',
  DOCGEN = 'docgen',
  LEGACY_5_2 = 'legacy-5.2',
  AUTO = 'auto',
}

type Notes = string | any;
type Info = string | any;

interface DescriptionProps {
  of?: '.' | Component;
  type?: DescriptionType;
  markdown?: string;
}

export const getNotes = (notes?: Notes) =>
  notes && (typeof notes === 'string' ? notes : str(notes.markdown) || str(notes.text));

export const getInfo = (info?: Info) => info && (typeof info === 'string' ? info : str(info.text));

const noDescription = (component?: Component): string | null => null;

export const getDescriptionProps = (
  { of, type, markdown }: DescriptionProps,
  { parameters }: DocsContextProps
): PureDescriptionProps => {
  if (markdown) {
    return { markdown };
  }
  const { component, notes, info, docs } = parameters;
  const { extractComponentDescription = noDescription } = docs || {};
  const target = of === CURRENT_SELECTION ? component : of;
  switch (type) {
    case DescriptionType.INFO:
      return { markdown: getInfo(info) };
    case DescriptionType.NOTES:
      return { markdown: getNotes(notes) };
    // FIXME: remove in 6.0
    case DescriptionType.LEGACY_5_2:
      return {
        markdown: `
${getNotes(notes) || getInfo(info) || ''}

${extractComponentDescription(target) || ''}
`.trim(),
      };
    case DescriptionType.DOCGEN:
    case DescriptionType.AUTO:
    default:
      return { markdown: extractComponentDescription(target) };
  }
};

const DescriptionContainer: FunctionComponent<DescriptionProps> = props => (
  <DocsContext.Consumer>
    {context => {
      const { markdown } = getDescriptionProps(props, context);
      return markdown && <Description markdown={markdown} />;
    }}
  </DocsContext.Consumer>
);

export { DescriptionContainer as Description };
