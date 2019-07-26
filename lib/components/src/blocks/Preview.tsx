import React from 'react';
import { styled } from '@storybook/theming';
import { darken } from 'polished';

import { getBlockBackgroundStyle } from './BlockBackgroundStyles';
import { Source, SourceProps } from './Source';
import { ActionBar } from '../ActionBar/ActionBar';

export interface PreviewProps {
  isColumn?: boolean;
  columns?: number;
  withSource?: SourceProps;
  isExpanded?: boolean;
}

const ChildrenContainer = styled.div<PreviewProps>(({ isColumn, columns }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: isColumn ? 'column' : 'row',
  marginTop: -20,

  '> *': {
    flex: columns ? `1 1 calc(100%/${columns} - 20px)` : `1 1 0%`,
    marginRight: 20,
    marginTop: 20,
  },
}));

const StyledSource = styled(Source)<{}>(({ theme }) => ({
  margin: 0,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  border: 'none',

  background:
    theme.base === 'light' ? 'rgba(0, 0, 0, 0.85)' : darken(0.05, theme.background.content),
  color: theme.color.lightest,
  button: {
    background:
      theme.base === 'light' ? 'rgba(0, 0, 0, 0.85)' : darken(0.05, theme.background.content),
  },
}));

const PreviewWrapper = styled.div<PreviewProps>(({ theme, withSource }) => ({
  ...getBlockBackgroundStyle(theme),
  padding: '30px 20px',
  position: 'relative',
  borderBottomLeftRadius: withSource && 0,
  borderBottomRightRadius: withSource && 0,
}));

const PreviewContainer = styled.div({
  margin: '25px 0 40px',
});

/**
 * A preview component for showing one or more component `Story`
 * items. The preview also shows the source for the componnent
 * as a drop-down.
 */
const Preview: React.FunctionComponent<PreviewProps> = ({
  isColumn,
  columns,
  children,
  withSource,
  isExpanded = false,
  ...props
}) => {
  const [expanded, setExpanded] = React.useState(isExpanded);
  const { source, actionItem } = expanded
    ? {
        source: <StyledSource {...withSource} dark />,
        actionItem: { title: 'Hide code', onClick: () => setExpanded(false) },
      }
    : {
        source: null,
        actionItem: { title: 'Show code', onClick: () => setExpanded(true) },
      };
  return (
    <PreviewContainer {...props}>
      <PreviewWrapper withSource={withSource}>
        <ChildrenContainer isColumn={isColumn} columns={columns}>
          {Array.isArray(children) ? (
            children.map((child, i) => <div key={i.toString()}>{child}</div>)
          ) : (
            <div>{children}</div>
          )}
        </ChildrenContainer>
        {withSource && <ActionBar actionItems={[actionItem]} />}
      </PreviewWrapper>
      {withSource && source}
    </PreviewContainer>
  );
};

export { Preview };
