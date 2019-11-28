import React, { FunctionComponent } from 'react';
import { Source, SourceProps as PureSourceProps, SourceError } from '@storybook/components';
import { DocsContext, DocsContextProps } from './DocsContext';
import { CURRENT_SELECTION } from './shared';

interface CommonProps {
  language?: string;
  dark?: boolean;
}

type SingleSourceProps = {
  id: string;
} & CommonProps;

type MultiSourceProps = {
  ids: string[];
} & CommonProps;

type CodeProps = {
  code: string;
} & CommonProps;

type NoneProps = CommonProps;

type SourceProps = SingleSourceProps | MultiSourceProps | CodeProps | NoneProps;

interface Location {
  line: number;
  col: number;
}

interface StorySource {
  source: string;
  locationsMap: { [id: string]: { startBody: Location; endBody: Location } };
}

const extract = (targetId: string, { source, locationsMap }: StorySource) => {
  const location = locationsMap[targetId];
  // FIXME: bad locationsMap generated for module export functions whose titles are overridden
  if (!location) return null;
  const { startBody: start, endBody: end } = location;
  const lines = source.split('\n');
  if (start.line === end.line) {
    return lines[start.line - 1].substring(start.col, end.col);
  }
  // NOTE: storysource locations are 1-based not 0-based!
  const startLine = lines[start.line - 1];
  const endLine = lines[end.line - 1];
  return [
    startLine.substring(start.col),
    ...lines.slice(start.line, end.line - 1),
    endLine.substring(0, end.col),
  ].join('\n');
};

export const getSourceProps = (
  props: SourceProps,
  { id: currentId, storyStore }: DocsContextProps
): PureSourceProps => {
  const codeProps = props as CodeProps;
  const singleProps = props as SingleSourceProps;
  const multiProps = props as MultiSourceProps;

  let source = codeProps.code; // prefer user-specified code
  if (!source) {
    const targetId = singleProps.id === CURRENT_SELECTION ? currentId : singleProps.id;
    const targetIds = multiProps.ids || [targetId];
    source = targetIds
      .map(sourceId => {
        const data = storyStore.fromId(sourceId);
        if (data && data.parameters) {
          const { mdxSource, storySource } = data.parameters;
          return mdxSource || (storySource && extract(sourceId, storySource));
        }
        return '';
      })
      .join('\n\n');
  }
  return source
    ? { code: source, language: props.language || 'jsx', dark: props.dark || false }
    : { error: SourceError.SOURCE_UNAVAILABLE };
};

/**
 * Story source doc block renders source code if provided,
 * or the source for a story if `storyId` is provided, or
 * the source for the current story if nothing is provided.
 */
const SourceContainer: FunctionComponent<SourceProps> = props => (
  <DocsContext.Consumer>
    {context => {
      const sourceProps = getSourceProps(props, context);
      return <Source {...sourceProps} />;
    }}
  </DocsContext.Consumer>
);

export { SourceContainer as Source };
