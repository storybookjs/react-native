import React from 'react';
import { styled } from '@storybook/theming';

const Wrapper = styled.div({
  fontSize: '14px',
  letterSpacing: '0.2px',
  margin: '10px 0',
});

const Main = styled.div({
  margin: 'auto',
  padding: '30px',
  borderRadius: '10px',
  background: 'rgba(0,0,0,0.03)',
});

const Heading = styled.h1({
  textAlign: 'center',
});

export const NoDocs = () => (
  <Wrapper className="sb-nodocs sb-wrapper">
    <Main>
      <Heading>No Docs</Heading>
      <p>
        Sorry, but there are no docs for the selected story. To add them, set the story's{' '}
        <code>docs</code> parameter. If you think this is an error:
      </p>
      <ul>
        <li>Please check the story definition.</li>
        <li>Please check the Storybook config.</li>
        <li>Try reloading the page.</li>
      </ul>
      <p>
        If the problem persists, check the browser console, or the terminal you've run Storybook
        from.
      </p>
    </Main>
  </Wrapper>
);
