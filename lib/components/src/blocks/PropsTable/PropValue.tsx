import React, { FC, useState } from 'react';
import { isNil } from 'lodash';
import { styled } from '@storybook/theming';
import memoize from 'memoizerific';
import { PropSummaryValue } from './PropDef';
import { WithTooltipPure } from '../../tooltip/WithTooltip';
import { Icons } from '../../icon/icon';
import { SyntaxHighlighter } from '../../syntaxhighlighter/syntaxhighlighter';
import { codeCommon } from '../../typography/shared';

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
  color: theme.color.secondary,
  margin: 0,
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
}));

const Detail = styled.div<{ width: string }>(({ theme, width }) => ({
  width,
  minWidth: 200,
  maxWidth: 800,
  padding: 15,
  // Dont remove the mono fontFamily here even if it seem useless, this is used by the browser to calculate the length of a "ch" unit.
  fontFamily: theme.typography.fonts.mono,
  fontSize: theme.typography.size.s2 - 1,
  // Most custom stylesheet will reset the box-sizing to "border-box" and will break the tooltip.
  boxSizing: 'content-box',

  '& code': {
    padding: '0 !important',
  },
}));

const ArrowIcon = styled(Icons)({
  height: 10,
  width: 10,
  minWidth: 10,
  marginLeft: 4,
});

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
  // summary is used for the default value
  // below check fixes not displaying default values for boolean typescript vars
  const summaryAsString =
    summary !== undefined && summary !== null && typeof summary.toString === 'function'
      ? summary.toString()
      : summary;
  if (isNil(detail)) {
    return <PropText text={summaryAsString} />;
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
        <Detail width={calculateDetailWidth(detail)}>
          <SyntaxHighlighter language="jsx" format={false}>
            {detail}
          </SyntaxHighlighter>
        </Detail>
      }
    >
      <Expandable className="sbdocs-expandable">
        <span>{summaryAsString}</span>
        <ArrowIcon icon={isOpen ? 'arrowup' : 'arrowdown'} />
      </Expandable>
    </WithTooltipPure>
  );
};

export const PropValue: FC<PropValueProps> = ({ value }) => {
  return isNil(value) ? <EmptyProp /> : <PropSummary value={value} />;
};
