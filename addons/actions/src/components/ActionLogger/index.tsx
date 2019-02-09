import React from 'react';
import Inspector from 'react-inspector';

import { withTheme } from '@storybook/theming';
import { ActionBar } from '@storybook/components';

import { Actions, Action, Wrapper, InspectorContainer, Counter } from './style';
import { ActionDisplay } from '../../models';

interface ActionLoggerProps {
  actions: ActionDisplay[];
  onClear: () => void;
  theme: any;
}

export const ActionLogger = withTheme(({ actions, onClear, theme }: ActionLoggerProps) => (
  <Wrapper>
    <Actions>
      {actions.map((action: ActionDisplay) => (
        <Action key={action.id}>
          {action.count > 1 && <Counter>{action.count}</Counter>}
          <InspectorContainer>
            <Inspector
              theme={theme.addonActionsTheme || 'chromeLight'}
              sortObjectKeys
              showNonenumerable={false}
              name={action.data.name}
              data={action.data.args || action.data}
            />
          </InspectorContainer>
        </Action>
      ))}
    </Actions>

    <ActionBar actionItems={[{ title: 'Clear', onClick: onClear }]} />
  </Wrapper>
));
