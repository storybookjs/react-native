import React from 'react';

import { styled } from '@storybook/theming';

import Message from './Message';
import Indicator from './Indicator';
import colors from '../colors';

const FlexContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const Head = styled.header({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
});

const Title = styled.h3({
  padding: '10px 10px 0 10px',
  margin: 0,
});

export const FailedResult = styled(({ fullName, title, status, failureMessages, className }) => (
  <div className={className}>
    <Head>
      <FlexContainer>
        <Indicator
          color={colors.error}
          size={10}
          overrides={{ borderRadius: '5px 0', position: 'absolute', top: -1, left: -1 }}
        />
        <Title>{fullName || title}</Title>
      </FlexContainer>
      <Indicator
        color={colors.error}
        size={16}
        overrides={{ borderRadius: '0 5px', position: 'absolute', top: -1, right: -1 }}
      >
        {status}
      </Indicator>
    </Head>
    {failureMessages.map((msg: string, i: number) => (
      <Message msg={msg} key={i} />
    ))}
  </div>
))({
  display: 'block',
  borderRadius: 5,
  margin: 0,
  padding: 0,
  position: 'relative',
  border: '1px solid silver',
  boxSizing: 'border-box',
});

interface ResultProps {
  fullName?: string;
  title?: string;
  status: string;
}
const Result = ({ fullName, title, status }: ResultProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <FlexContainer>
      <Indicator color={colors.success} size={10} overrides={{ marginRight: 10 }} />
      <div>{fullName || title}</div>
    </FlexContainer>
    <FlexContainer>
      <Indicator color={colors.success} size={14} right>
        {status}
      </Indicator>
    </FlexContainer>
  </div>
);

Result.defaultProps = {
  fullName: '',
  title: '',
};

export default Result;
