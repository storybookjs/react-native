import React from 'react';
import { Combo, Consumer } from '@storybook/api';
import { styled } from '@storybook/theming';
import { Link } from '@storybook/components';
import { H3 } from '@storybook/components/html';
import { EditStoriesProps } from '../types';

const StyledContainer = styled.div<{}>(({ theme }) => ({
  padding: '10px',
  background: theme.background.bar,
  borderBottom: `1px solid ${theme.color.border}`,
}));

interface PanelProps {
  filePath?: string;
  shortName?: string;
  config?: EditStoriesProps;
}

const EditInject = ({ filePath, shortName, config }: PanelProps) => (
  <React.Fragment>
    {filePath && (
      <StyledContainer>
        <H3>{shortName}</H3>
        <Link target="_blank" href={filePath}>
          {config.editPageLabel}
        </Link>
      </StyledContainer>
    )}
  </React.Fragment>
);

const mapper = ({ state }: Combo): { story: any } => {
  const story = state.storiesHash[state.storyId];
  return { story };
};

export const PreviewPanel = (props: EditStoriesProps) => {
  return (
    <React.Fragment>
      <Consumer filter={mapper}>
        {({ story }: ReturnType<typeof mapper>) => {
          if (
            story &&
            story.parameters &&
            story.parameters.edit &&
            story.parameters.edit.fileName
          ) {
            const rootSplit = story.kind.split(story.parameters.options.hierarchyRootSeparator);
            const path = rootSplit[rootSplit.length - 1];
            const pathSplit = path.split(story.parameters.options.hierarchySeparator);
            const shortName = pathSplit[pathSplit.length - 1];
            const filePath = props.fileNameResolve({
              id: story.id,
              kind: story.kind,
              name: story.name,
              displayName: story.parameters.displayName,
              fileName: story.parameters.edit.fileName,
              shortName,
            });
            if (filePath) {
              if (typeof props.render === 'function') {
                return props.render({
                  filePath,
                  shortName,
                  parameters: story.parameters,
                });
              }
              return <EditInject filePath={filePath} shortName={shortName} config={props} />;
            }
          }
          return null;
        }}
      </Consumer>
    </React.Fragment>
  );
};
