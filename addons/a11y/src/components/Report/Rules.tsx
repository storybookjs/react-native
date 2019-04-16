import React, { FunctionComponent } from 'react';
import { styled } from '@storybook/theming';
import { Badge, Icons } from '@storybook/components';
import { CheckResult } from 'axe-core';
import { RuleType } from '../A11YPanel';

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
      margin-bottom: 12px;
    }
  `;
});

const BadgeWrapper = styled.div({
  marginBottom: '3px',
  marginLeft: '5px',
  display: 'flex',
});

const Message = styled.div({
  paddingLeft: '6px',
  paddingRight: '23px',
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

export enum ImpactValue {
  MINOR = 'minor',
  MODERATE = 'moderate',
  SERIOUS = 'serious',
  CRITICAL = 'critical',
}

interface RuleProps {
  rule: CheckResult;
}

const Rule: FunctionComponent<RuleProps> = ({ rule }) => {
  let badgeType = '';
  switch (rule.impact) {
    case ImpactValue.CRITICAL:
      badgeType = 'critical';
      break;
    case ImpactValue.SERIOUS:
      badgeType = 'negative';
      break;
    case ImpactValue.MODERATE:
      badgeType = 'warning';
      break;
    case ImpactValue.MINOR:
      badgeType = 'neutral';
      break;
    default:
      break;
  }
  return (
    <Item>
      <BadgeWrapper>
        <Badge status={badgeType}>{rule.impact}</Badge>
      </BadgeWrapper>
      <Message>{rule.message}</Message>
    </Item>
  );
};

interface RulesProps {
  rules: CheckResult[];
}

export const Rules: FunctionComponent<RulesProps> = ({ rules }) => {
  return (
    <List>
      {rules.map((rule, index) => (
        <Rule rule={rule} key={index} />
      ))}
    </List>
  );
};
