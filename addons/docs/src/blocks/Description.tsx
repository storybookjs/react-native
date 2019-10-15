/* eslint-disable no-underscore-dangle */
import React, { FunctionComponent } from 'react';
import { Description, DescriptionProps as PureDescriptionProps } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';
import { Component, CURRENT_SELECTION } from './shared';

export enum DescriptionType {
  INFO = 'info',
  NOTES = 'notes',
  DOCGEN = 'docgen',
  AUTO = 'auto',
}

type Notes = string | any;
type Info = string | any;

interface DescriptionProps {
  of?: '.' | Component;
  type?: DescriptionType;
  markdown?: string;
}

const str = (o: any) => {
  if (!o) {
    return '';
  }
  if (typeof o === 'string') {
    return o as string;
  }
  throw new Error(`Description: expected string, got: ${JSON.stringify(o)}`);
};

export const getNotes = (notes?: Notes) =>
  notes && (typeof notes === 'string' ? notes : str(notes.markdown) || str(notes.text));

export const getInfo = (info?: Info) => info && (typeof info === 'string' ? info : str(info.text));

export const getDocgen = (component?: Component) =>
  component && component.__docgenInfo && str(component.__docgenInfo.description);

export const getDescriptionProps = (
  { of, type, markdown }: DescriptionProps,
  { parameters }: DocsContextProps
): PureDescriptionProps => {
  if (markdown) {
    return { markdown };
  }
  const { component, notes, info } = parameters;
  const target = of === CURRENT_SELECTION ? component : of;
  switch (type) {
    case DescriptionType.INFO:
      return { markdown: getInfo(info) };
    case DescriptionType.NOTES:
      return { markdown: getNotes(notes) };
    case DescriptionType.DOCGEN:
      return { markdown: getDocgen(target) };
    case DescriptionType.AUTO:
    default:
      return {
        markdown: `
${getNotes(notes) || getInfo(info) || ''}

${getDocgen(target) || ''}
`.trim(),
      };
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
