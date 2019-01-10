import React from 'react';
import { SyntaxHighlighter, Typography } from '@storybook/components';
import PropTypes from 'prop-types';
import Markdown from 'markdown-to-jsx';

import {
  Container,
  Balloon,
  Wrapper,
  Title,
  TitleIcon,
  TitleText,
  Aside,
  FullChangeLogLink,
  Upgrade,
  Footer,
} from './components';

const AboutScreen = ({ latest, current }) => {
  let updateBallon;

  const canUpdate = latest && latest.version !== current.version;
  if (latest) {
    updateBallon = canUpdate ? (
      <Balloon>Update available</Balloon>
    ) : (
      <Balloon success>You're up to date</Balloon>
    );
  }

  return (
    <Container>
      <Wrapper>
        <Title>
          <TitleIcon />
          <TitleText>Storybook {current.version}</TitleText>
          {updateBallon}
        </Title>
      </Wrapper>
      {latest ? (
        <Wrapper>
          <Aside>
            <div>Latest version</div>
            <div>
              <strong>{latest.version}</strong>
            </div>
          </Aside>
          <Markdown>{latest.info.plain}</Markdown>
          <FullChangeLogLink href="https://github.com/storybooks/storybook/blob/master/CHANGELOG.md">
            Read full changelog
          </FullChangeLogLink>
        </Wrapper>
      ) : (
        <Wrapper>
          Cannot currently fetch the latest version from Storybook. Try{' '}
          <a href="https://github.com/storybooks/storybook/blob/master/CHANGELOG.md">
            reading the full changelog
          </a>
        </Wrapper>
      )}
      {canUpdate && (
        <Wrapper>
          <Upgrade>
            <Typography.Heading>Upgrade all storybook packages to latest:</Typography.Heading>
            <SyntaxHighlighter language="bash" copyable padded bordered>
              npx npm-check-updates '/storybook/' -u && yarn
            </SyntaxHighlighter>
            <p>
              Alternatively if you're using a yarn you could run the following command, and check
              all storybook related packages:
            </p>
            <SyntaxHighlighter language="bash" copyable padded bordered>
              yarn upgrade-interactive --latest
            </SyntaxHighlighter>
          </Upgrade>
        </Wrapper>
      )}
      <Wrapper>
        <Footer>
          <Typography.Link href="https://storybook.js.org">Storybook docs</Typography.Link>
          <Typography.Link href="https://github.com/storybooks/storybook">GitHub</Typography.Link>
          <Typography.Link href="https://storybook.js.org/support">Support</Typography.Link>
        </Footer>
      </Wrapper>
    </Container>
  );
};

AboutScreen.propTypes = {
  current: PropTypes.shape({
    version: PropTypes.string.isRequired,
  }).isRequired,
  latest: PropTypes.shape({
    version: PropTypes.string.isRequired,
    info: PropTypes.shape({
      plain: PropTypes.string.isRequired,
    }).isRequired,
  }),
};

AboutScreen.defaultProps = {
  latest: null,
};

export { AboutScreen as default };
