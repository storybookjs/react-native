import React, { ReactNodeArray } from 'react';
import { Preview as PurePreview, PreviewProps as PurePreviewProps } from '@storybook/components';
import { getSourceProps } from './Source';
import { DocsContext, DocsContextProps } from './DocsContext';

export enum SourceState {
  OPEN = 'open',
  CLOSED = 'closed',
  NONE = 'none',
}

type PreviewProps = PurePreviewProps & {
  withSource?: SourceState;
};

const getPreviewProps = (
  {
    withSource = SourceState.CLOSED,
    children,
    ...props
  }: PreviewProps & { children?: React.ReactNode },
  { mdxStoryNameToId, storyStore }: DocsContextProps
): PurePreviewProps => {
  if (withSource === SourceState.NONE && !children) {
    return props;
  }
  const childArray: ReactNodeArray = Array.isArray(children) ? children : [children];
  const stories = childArray.filter(
    (c: React.ReactElement) => c.props && (c.props.id || c.props.name)
  ) as React.ReactElement[];
  const targetIds = stories.map(s => s.props.id || mdxStoryNameToId[s.props.name]);
  const sourceProps = getSourceProps({ ids: targetIds }, { storyStore });
  return {
    ...props, // pass through columns etc.
    withSource: sourceProps,
    isExpanded: withSource === SourceState.OPEN,
  };
};

export const Preview: React.FunctionComponent<PreviewProps> = props => (
  <DocsContext.Consumer>
    {context => {
      const previewProps = getPreviewProps(props, context);
      return <PurePreview {...previewProps}>{props.children}</PurePreview>;
    }}
  </DocsContext.Consumer>
);
