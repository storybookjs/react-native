import React, { FunctionComponent } from 'react';
import { styled } from '@storybook/theming';
import { Badge, Icons } from '@storybook/components';
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

const Item = styled.div(() => {
  return `
    display: flex;
    flex-direction: row;
    margin-bottom: 6px;

    @media (max-width: 665px) {
      display: block;
    }
  `;
});

const BadgeWrapper = styled.div({
  marginBottom: '5px',
  marginLeft: '5px',
  display: 'flex',
});

const Message = styled.div({
  paddingLeft: '6px',
});

const Status = styled.div(({ passes, impact }: { passes: boolean; impact: string }) => ({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: passes ? impactColors.success : (impactColors as any)[impact],
  '& > svg': {
    height: '16px',
    width: '16px',
  },
}));

interface RuleProps {
  rule: CheckResult;
  passes: boolean;
}

const Rule: FunctionComponent<RuleProps> = ({ rule, passes }) => (
  <Item>
    <BadgeWrapper>
      <Badge status={passes ? "positive" : "negative"}>{rule.impact}</Badge>
    </BadgeWrapper>
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
