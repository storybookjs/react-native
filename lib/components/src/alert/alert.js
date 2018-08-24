import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div(({ theme, type }) => ({
  display: 'flex',
  background: theme[`${type}Color`] || type,
  borderRadius: theme.mainBorderRadius,
}));
const Body = styled.div(({ theme }) => ({
  flex: 1,
  padding: theme.layoutMargin,
}));
const Icon = styled.div(({ theme }) => ({
  padding: theme.layoutMargin,
  paddingRight: 0,
  fontSize: 11,
}));

export default ({ children, icon, type }) => (
  <Container type={type} role="alert">
    {icon ? <Icon>{icon}</Icon> : null}
    <Body>{children}</Body>
  </Container>
);
