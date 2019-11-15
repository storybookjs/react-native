/* eslint-disable import/no-extraneous-dependencies */
import React, { FC } from 'react';
import { Icons, SyntaxHighlighter, WithTooltip } from '@storybook/components';
import { isNil } from 'lodash';
import { styled } from '@storybook/theming';
import { PropSummaryValue } from './PropDef';

interface PropValueProps {
  value?: PropSummaryValue;
}

interface PropSummaryProps {
  value: PropSummaryValue;
}

const EmptyProp = () => {
  return <span>-</span>;
};

export const Summary = styled.div<{ expandable: boolean }>(({ theme, expandable }) => ({
  fontSize: theme.typography.size.s1,
  lineHeight: '20px',
  display: 'inline-block',
  textAlign: 'left',
  color: expandable ? theme.color.secondary : theme.color.dark,
  backgroundColor: expandable ? theme.color.lighter : 'transparent',
  padding: expandable ? '4px' : '0',
  borderRadius: expandable ? '4px' : '0',
  cursor: expandable ? 'pointer' : 'auto',
  fontFamily: theme.typography.fonts.mono,
}));

const StyledSyntaxHighlighter = styled(SyntaxHighlighter)(() => ({
  minWidth: '460px',
  padding: '8px',
}));

const Icon = styled<any, any>(Icons)(({ theme }) => ({
  height: 10,
  width: 10,
  minWidth: 10,
  color: theme.color.secondary,
  marginLeft: '8px',
  transition: 'transform 0.1s ease-in-out',
  alignSelf: 'center',
  display: 'inline-flex',
}));

const PropSummary: FC<PropSummaryProps> = ({ value }) => {
  const { summary, detail } = value;
  const title = !isNil(detail) ? detail : null;

  return (
    <>
      {title !== null ? (
        <WithTooltip
          closeOnClick
          trigger="click"
          placement="bottom"
          tooltip={
            <StyledSyntaxHighlighter language="jsx" copyable padded>
              {title}
            </StyledSyntaxHighlighter>
          }
        >
          <Summary
            expandable={title !== null}
            className={title !== null ? 'sbdocs-expandable' : ''}
          >
            <span>{summary}</span>
            <Icon icon="chevrondown" size={10} />
          </Summary>
        </WithTooltip>
      ) : (
        <span>{summary}</span>
      )}
    </>
  );
};

export const PropValue: FC<PropValueProps> = ({ value }) => {
  return isNil(value) ? <EmptyProp /> : <PropSummary value={value} />;
};
