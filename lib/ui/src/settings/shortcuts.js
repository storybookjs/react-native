import React from 'react';
import { Route } from '../router';
import {
  Container,
  Wrapper,
  Title,
  TitleIcon,
  TitleText,
  Main,
  Heading,
  Footer,
  A,
} from './components';

const ShortcutsPage = () => (
  <Route path="shortcuts">
    <Container>
      <Wrapper>
        <Title>
          <TitleIcon />
          <TitleText>Storybook Shortcuts</TitleText>
        </Title>
      </Wrapper>
      <Wrapper>
        <Main>
          <Heading>Configure Shortcuts Belo</Heading>
          <ul>
            <li />
          </ul>
        </Main>
      </Wrapper>
      <Wrapper />
      <Wrapper>
        <Footer>
          <A href="https://storybook.js.org">Storybook docs</A>
          <A href="https://github.com/storybooks/storybook">GitHub</A>
          <A href="https://storybook.js.org/support">Support</A>
        </Footer>
      </Wrapper>
    </Container>
  </Route>
);

export { ShortcutsPage as default };
