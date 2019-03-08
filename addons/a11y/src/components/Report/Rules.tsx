import React, { FunctionComponent } from 'react';
import { styled } from '@storybook/theming';

import { Icons } from '@storybook/components';
import { CheckResult } from 'axe-core';

const impactColors = {
  minor: '#f1c40f',
  moderate: '#e67e22',
  serious: '#e74c3c',
  critical: '#c0392b',
  success: '#2ecc71',
};

const List = styled.div({
  display: 'flex',
  flexDirection: 'column',
  padding: '4px',
  fontWeight: '400',
} as any);

const Item = styled.div({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: '6px',
});

const Message = styled.div({
  paddingLeft: '6px',
});

const Status = styled.div(({ passes, impact }: { passes: boolean; impact: string }) => ({
  height: '16px',
  width: '16px',
  borderRadius: '8px',
  fontSize: '10px',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  flex: '0 0 16px',
  color: passes ? impactColors.success : (impactColors as any)[impact],
}));

interface RuleProps {
  rule: CheckResult;
  passes: boolean;
}

const Rule: FunctionComponent<RuleProps> = ({ rule, passes }) => (
  <Item>
    <Status passes={passes || undefined} impact={rule.impact}>
      {passes ? <Icons icon="check" /> : <Icons icon="cross" />}
    </Status>
    <Message>{rule.message}</Message>
  </Item>
);

interface RulesProps {
  rules: CheckResult[];
  passes: boolean;
}

export const Rules: FunctionComponent<RulesProps> = ({ rules, passes }) => {
  return (
    <List>
      {rules.map((rule, index) => (
        <Rule passes={passes} rule={rule} key={index} />
      ))}
    </List>
  );
};
