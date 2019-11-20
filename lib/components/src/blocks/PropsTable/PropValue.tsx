import React, { FC, useState } from 'react';
import { isNil } from 'lodash';
import { styled } from '@storybook/theming';
import memoize from 'memoizerific';
import { PropSummaryValue } from './PropDef';
import { WithTooltipPure } from '../../tooltip/WithTooltip';
import { Icons } from '../../icon/icon';
import { SyntaxHighlighter } from '../../syntaxhighlighter/syntaxhighlighter';

import { codeCommon } from '../../typography/DocumentFormatting';

interface PropValueProps {
  value?: PropSummaryValue;
}

interface PropTextProps {
  text: string;
}

interface PropSummaryProps {
  value: PropSummaryValue;
}

const Text = styled.span(({ theme }) => ({
  fontFamily: theme.typography.fonts.mono,
  fontSize: theme.typography.size.s2 - 1,
}));

const Expandable = styled.div(codeCommon, ({ theme }) => ({
  fontFamily: theme.typography.fonts.mono,
  lineHeight: '18px',
  display: 'inline-block',
  color: theme.color.secondary,
  margin: 0,
  whiteSpace: 'nowrap',
}));

const ArrowIcon = styled(Icons)(({ theme }) => ({
  height: 10,
  width: 10,
  minWidth: 10,
  marginLeft: '4px',
  alignSelf: 'center',
  display: 'inline-flex',
}));

const StyledSyntaxHighlighter = styled(SyntaxHighlighter)(({ theme, width }) => ({
  width: `${width}ch`,
  minWidth: '200px',
  maxWith: '800px',
  padding: '15px',
  // Dont remove the mono fontFamily here even if it seem useless, this is used by the browser to calculate the length of a "ch" unit.
  fontFamily: theme.typography.fonts.mono,
  fontSize: theme.typography.size.s2 - 1,
}));

const EmptyProp = () => {
  return <span>-</span>;
};

const PropText: FC<PropTextProps> = ({ text }) => {
  return <Text>{text}</Text>;
};

const inferDetailWidth = memoize(1000)(function(detail: string): number {
  const lines = detail.split(/\r?\n/);

  return Math.max(...lines.map(x => x.length));
});

const PropSummary: FC<PropSummaryProps> = ({ value }) => {
  const { summary, detail } = value;

  const [isOpen, setIsOpen] = useState(false);

  if (isNil(detail)) {
    return <PropText text={summary} />;
  }

  return (
    <WithTooltipPure
      closeOnClick
      trigger="click"
      placement="bottom"
      tooltipShown={isOpen}
      onVisibilityChange={isVisible => {
        setIsOpen(isVisible);
      }}
      tooltip={
        <StyledSyntaxHighlighter width={inferDetailWidth(detail)} language="jsx" format={false}>
          {detail}
        </StyledSyntaxHighlighter>
      }
    >
      <Expandable className="sbdocs-expandable">
        <span>{summary}</span>
        <ArrowIcon icon={isOpen ? 'arrowup' : 'arrowdown'} />
      </Expandable>
    </WithTooltipPure>
  );
};

export const PropValue: FC<PropValueProps> = ({ value }) => {
  return isNil(value) ? <EmptyProp /> : <PropSummary value={value} />;
};
