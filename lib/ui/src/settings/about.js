import React from 'react';
import { SyntaxHighlighter } from '@storybook/components';
import { Route } from '../router';
import {
  Container,
  Balloon,
  Wrapper,
  Title,
  TitleIcon,
  TitleText,
  Aside,
  Main,
  Heading,
  FullChangeLogLink,
  Upgrade,
  Footer,
  A,
} from './components';

export const currentM = {
  version: '3.4.0',
};
export const latestM = {
  version: '4.0.0',
};

const AboutPage = ({ latest = latestM, current = currentM }) => (
  <Route path="/settings">
    <Container>
      <Wrapper>
        <Title>
          <TitleIcon />
          <TitleText>Storybook {current.version}</TitleText>
          {latest.version === current.version ? (
            <Balloon success>You're' up to date</Balloon>
          ) : (
            <Balloon>Update available</Balloon>
          )}
        </Title>
      </Wrapper>
      <Wrapper>
        <Aside>
          <div>Latest version</div>
          <div>
            <strong>{latest.version}</strong>
          </div>
        </Aside>
        <Main>
          <Heading>
            Changelog
            <FullChangeLogLink href="https://github.com/storybooks/storybook/blob/master/CHANGELOG.md">
              Read full changelog
            </FullChangeLogLink>
          </Heading>
          <strong>Features</strong>
          <ul>
            <li>
              Feature nr 1 description (
              <A href="https://github.com/storybooks/storybook/pull/3746">#1234</A>)
            </li>
            <li>
              Feature nr 2 description (
              <A href="https://github.com/storybooks/storybook/pull/3746">#1235</A>)
            </li>
            <li>
              Feature nr 3 description (
              <A href="https://github.com/storybooks/storybook/pull/3746">#1236</A>)
            </li>
          </ul>
          <strong>Bugfixes</strong>
          <ul>
            <li>Bugfix nr 1 description</li>
          </ul>
        </Main>
      </Wrapper>
      <Wrapper>
        <Upgrade>
          <Heading>Upgrade all storybook packages to latest:</Heading>
          <SyntaxHighlighter language="bash" copyable padded bordered>
            npx npm-check-updates '/storybook/' -u && yarn
          </SyntaxHighlighter>
          <p>
            Alternatively if you're using a yarn you could run the following command, and check all
            storybook related packages:
          </p>
          <SyntaxHighlighter language="bash" copyable padded bordered>
            yarn upgrade-interactive --latest
          </SyntaxHighlighter>
        </Upgrade>
      </Wrapper>
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

export { AboutPage as default };
