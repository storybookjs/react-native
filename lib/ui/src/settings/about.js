import React from 'react';
import { SyntaxHighlighter, Typography } from '@storybook/components';
import PropTypes from 'prop-types';
import {
  Container,
  Balloon,
  Wrapper,
  Title,
  TitleIcon,
  TitleText,
  Aside,
  Main,
  FullChangeLogLink,
  Upgrade,
  Footer,
} from './components';

const AboutScreen = ({ latest, current }) => (
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
        <Typography.Heading>
          Changelog
          <FullChangeLogLink href="https://github.com/storybooks/storybook/blob/master/CHANGELOG.md">
            Read full changelog
          </FullChangeLogLink>
        </Typography.Heading>
        <strong>Features</strong>
        <ul>
          <li>
            Feature nr 1 description (
            <Typography.Link href="https://github.com/storybooks/storybook/pull/3746">
              #1234
            </Typography.Link>
            )
          </li>
          <li>
            Feature nr 2 description (
            <Typography.Link href="https://github.com/storybooks/storybook/pull/3746">
              #1235
            </Typography.Link>
            )
          </li>
          <li>
            Feature nr 3 description (
            <Typography.Link href="https://github.com/storybooks/storybook/pull/3746">
              #1236
            </Typography.Link>
            )
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
        <Typography.Heading>Upgrade all storybook packages to latest:</Typography.Heading>
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
        <Typography.Link href="https://storybook.js.org">Storybook docs</Typography.Link>
        <Typography.Link href="https://github.com/storybooks/storybook">GitHub</Typography.Link>
        <Typography.Link href="https://storybook.js.org/support">Support</Typography.Link>
      </Footer>
    </Wrapper>
  </Container>
);

AboutScreen.propTypes = {
  current: PropTypes.shape({
    version: PropTypes.string.isRequired,
  }).isRequired,
  latest: PropTypes.shape({
    version: PropTypes.string.isRequired,
  }).isRequired,
};
export { AboutScreen as default };
