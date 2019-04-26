import React, { FunctionComponent } from 'react';
import { styled } from '@storybook/theming';
import { Badge, Icons } from '@storybook/components';
import { CheckResult } from 'axe-core';
import { SizeMe } from 'react-sizeme';
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
  paddingBottom: '4px',
  paddingRight: '4px',
  paddingTop: '4px',
  fontWeight: '400',
} as any);

const Item = styled.div(({ elementWidth }: { elementWidth: number }) => {
  const maxWidthBeforeBreak = 407;
  return {
    flexDirection: elementWidth > maxWidthBeforeBreak ? 'row' : 'inherit',
    marginBottom: elementWidth > maxWidthBeforeBreak ? '6px' : '12px',
    display: elementWidth > maxWidthBeforeBreak ? 'flex' : 'block',
  };
});

const StyledBadge = styled(Badge)(({ status }: { status: string }) => ({
  padding: '2px 8px',
  marginBottom: '3px',
  minWidth: '65px',
  maxWidth: 'fit-content',
  width: '100%',
  textAlign: 'center',
}));

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

const formatSeverityText = (severity: string) => {
  return severity
    .charAt(0)
    .toUpperCase()
    .concat(severity.slice(1));
};

const Rule: FunctionComponent<RuleProps> = ({ rule }) => {
  let badgeType: any = null;
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
    <SizeMe refreshMode="debounce">
      {({ size }: { size: any }) => (
        <Item elementWidth={size.width}>
          <StyledBadge status={badgeType}>{formatSeverityText(rule.impact)}</StyledBadge>
          <Message>{rule.message}</Message>
        </Item>
      )}
    </SizeMe>
  );
};

interface RulesProps {
  rules: CheckResult[];
}

export const Rules: FunctionComponent<RulesProps> = ({ rules }) => {
  return (
    <List>
      {rules.map((rule, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Rule rule={rule} key={index} />
      ))}
    </List>
  );
};
