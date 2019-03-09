import React, { FunctionComponent } from 'react';

import { styled } from '@storybook/theming';
import { Result } from 'axe-core';

const Wrapper = styled.div(({ theme }) => ({
  backgroundColor: theme.background.bar,
  padding: '12px',
  marginBottom: '10px',
}));
const Help = styled.p({
  margin: '0 0 12px',
});
const Link = styled.a({
  marginTop: '12px',
  textDecoration: 'underline',
  color: 'inherit',
  display: 'block',
});

interface InfoProps {
  item: Result;
}

export const Info: FunctionComponent<InfoProps> = ({ item }) => {
  return (
    <Wrapper>
      <Help>{item.help}</Help>
      <Link href={item.helpUrl} target="_blank">
        More info...
      </Link>
    </Wrapper>
  );
};
