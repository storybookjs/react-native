import React from 'react';
import styled from 'react-emotion';
import { Route } from '../router';

const Container = styled('div')({
  position: 'absolute',
  left: 0,
  top: 0,
  height: '100%',
  width: '100%',
  overflow: 'auto',
});

const Title = styled('header')({
  display: 'block',
  fontSize: 30,
  flex: 1,
});

const Wrapper = styled('div')({
  display: 'flex',
  maxWidth: 600,
  margin: '20px auto',
});

const Aside = styled('aside')({
  width: 200,
});
const Main = styled('main')({
  flex: 1,
});

const Icon = styled('div')({
  display: 'inline-block',
  width: 30,
  height: 30,
  background: 'pink',
});

const Balloon = styled('span')({
  float: 'right',
  height: 40,
  boxSizing: 'border-box',
  padding: 10,
  minWidth: 180,
  background: 'pink',
  fontSize: 16,
});

const Heading = styled('h1')({
  fontSize: 16,
});

const currentM = {
  version: '3.4.0',
};
const latestM = {
  version: '4.0.0',
};

const AboutPage = ({ latest = latestM, current = currentM }) => (
  <Route path="/settings/about">
    <Container>
      <Wrapper>
        <Title>
          <Icon />
          <span>Storybook {current.version}</span>
          <Balloon>You are up to date</Balloon>
        </Title>
      </Wrapper>
      <Wrapper>
        <Aside>
          <div>Latest version</div>
          <div>{latest.version}</div>
        </Aside>
        <Main>
          <Heading>Changelog</Heading>
          <strong>Features</strong>
          <ul>
            <li>Feature nr 1 description</li>
          </ul>
          <strong>Bugfixes</strong>
          <ul>
            <li>Bugfix nr 1 description</li>
          </ul>
          <strong>Upgrade</strong>
          <pre>some command here</pre>
        </Main>
      </Wrapper>
    </Container>
  </Route>
);

export { AboutPage as default };
