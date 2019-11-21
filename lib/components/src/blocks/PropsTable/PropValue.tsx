import React, { FC, useState } from 'react';
import { isNil } from 'lodash';
import { styled } from '@storybook/theming';
import memoize from 'memoizerific';
import { PropSummaryValue } from './PropDef';
import { WithTooltipPure } from '../../tooltip/WithTooltip';
import { Icons } from '../../icon/icon';
import { SyntaxHighlighter } from '../../syntaxhighlighter/syntaxhighlighter';
import { codeCommon } from '../../typography/shared';

const DIRTY_PADDING_TOP_IN_PX = 3;

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

const Expandable = styled.div<{}>(codeCommon, ({ theme }) => ({
  fontFamily: theme.typography.fonts.mono,
  lineHeight: '18px',
  color: theme.color.secondary,
  margin: 0,
  paddingTop: `${DIRTY_PADDING_TOP_IN_PX}px`,
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
}));

const ArrowIcon = styled(Icons)({
  height: 10,
  width: 10,
  minWidth: 10,
  marginLeft: '4px',
  marginTop: `-${DIRTY_PADDING_TOP_IN_PX}px`,
});

const StyledSyntaxHighlighter = styled(SyntaxHighlighter)(({ theme, width }) => ({
  width,
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

const calculateDetailWidth = memoize(1000)((detail: string): string => {
  const lines = detail.split(/\r?\n/);

  return `${Math.max(...lines.map(x => x.length))}ch`;
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
        <StyledSyntaxHighlighter width={calculateDetailWidth(detail)} language="jsx" format={false}>
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
