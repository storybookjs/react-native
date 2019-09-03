import React from 'react';
import { styled } from '@storybook/theming';
import { darken } from 'polished';
import { logger } from '@storybook/client-logger';

import { getBlockBackgroundStyle } from './BlockBackgroundStyles';
import { Source, SourceProps } from './Source';
import { ActionBar, ActionItem } from '../ActionBar/ActionBar';
import { Toolbar } from './Toolbar';
import { ZoomContext } from './ZoomContext';

export interface PreviewProps {
  isColumn?: boolean;
  columns?: number;
  withSource?: SourceProps;
  isExpanded?: boolean;
  withToolbar?: boolean;
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
  borderBottomLeftRadius: theme.appBorderRadius,
  borderBottomRightRadius: theme.appBorderRadius,
  border: 'none',

  background:
    theme.base === 'light' ? 'rgba(0, 0, 0, 0.85)' : darken(0.05, theme.background.content),
  color: theme.color.lightest,
  button: {
    background:
      theme.base === 'light' ? 'rgba(0, 0, 0, 0.85)' : darken(0.05, theme.background.content),
  },
}));

const PreviewWrapper = styled.div<PreviewProps>(
  ({ theme, withSource, isExpanded }) => ({
    ...getBlockBackgroundStyle(theme),
    padding: '30px 20px',
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: withSource && isExpanded && 0,
    borderBottomRightRadius: withSource && isExpanded && 0,
    borderBottomWidth: isExpanded && 0,
  }),
  ({ withToolbar }) => withToolbar && { paddingTop: 64 }
);

const PreviewContainer = styled.div({
  margin: '25px 0 40px',
});

interface SourceItem {
  source?: React.ReactElement;
  actionItem: ActionItem;
}

const getSource = (
  withSource: SourceProps,
  expanded: boolean,
  setExpanded: Function
): SourceItem => {
  switch (true) {
    case !!(withSource && withSource.error): {
      return {
        source: null,
        actionItem: {
          title: 'No code available',
          disabled: true,
          onClick: () => setExpanded(false),
        },
      };
    }
    case expanded: {
      return {
        source: <StyledSource {...withSource} dark />,
        actionItem: { title: 'Hide code', onClick: () => setExpanded(false) },
      };
    }
    default: {
      return {
        source: null,
        actionItem: { title: 'Show code', onClick: () => setExpanded(true) },
      };
    }
  }
};
function getStoryId(children: React.ReactNode) {
  if (React.Children.count(children) === 1) {
    const elt = children as React.ReactElement;
    if (elt.props) {
      return elt.props.id;
    }
  }
  return null;
}

/**
 * A preview component for showing one or more component `Story`
 * items. The preview also shows the source for the component
 * as a drop-down.
 */
const Preview: React.FunctionComponent<PreviewProps> = ({
  isColumn,
  columns,
  children,
  withSource,
  withToolbar = false,
  isExpanded = false,
  ...props
}) => {
  const [expanded, setExpanded] = React.useState(isExpanded);
  const { source, actionItem } = getSource(withSource, expanded, setExpanded);
  const [scale, setScale] = React.useState(1);

  if (withToolbar && Array.isArray(children)) {
    logger.warn('Cannot use toolbar with multiple preview children, disabling');
  }
  const showToolbar = withToolbar && !Array.isArray(children);
  return (
    <PreviewContainer {...props}>
      <PreviewWrapper {...{ withSource, withToolbar: showToolbar }}>
        {showToolbar && (
          <Toolbar
            border
            zoom={z => setScale(scale * z)}
            resetZoom={() => setScale(1)}
            storyId={getStoryId(children)}
            baseUrl="./iframe.html"
          />
        )}
        <ZoomContext.Provider value={{ scale }}>
          <ChildrenContainer isColumn={isColumn} columns={columns}>
            {Array.isArray(children) ? (
              children.map((child, i) => <div key={i.toString()}>{child}</div>)
            ) : (
              <div>{children}</div>
            )}
          </ChildrenContainer>
        </ZoomContext.Provider>
        {withSource && <ActionBar actionItems={[actionItem]} />}
      </PreviewWrapper>
      {withSource && source}
    </PreviewContainer>
  );
};

export { Preview };
