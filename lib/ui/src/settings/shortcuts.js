import React from 'react';
import { Icons } from '@storybook/components';
import { Route } from '../router';
import {
  Container,
  Wrapper,
  Title,
  TitleIcon,
  TitleText,
  Main,
  Heading,
  EditButton,
  Footer,
  Joiner,
  A,
  Key,
  Row,
  Description,
  KeyLabel,
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
          <Heading>Configure Shortcuts Below</Heading>
          <Row>
            <KeyLabel>
              <Key>F</Key>
            </KeyLabel>
            <Description>Go Fullscreen</Description>
            <EditButton>
              <Icons icon="edit" />
            </EditButton>{' '}
          </Row>

          <Row>
            <KeyLabel>
              <Key>D</Key>
            </KeyLabel>
            <Description>Toggle Panel</Description>
            <EditButton>
              <Icons icon="edit" />
            </EditButton>
          </Row>

          <Row>
            <KeyLabel>
              <Key>G</Key>
            </KeyLabel>
            <Description>Toggle Panel Position</Description>
            <EditButton>
              <Icons icon="edit" />
            </EditButton>
          </Row>

          <Row>
            <KeyLabel>
              <Key>S</Key>
            </KeyLabel>
            <Description>Toggle Navigation</Description>
            <EditButton>
              <Icons icon="edit" />
            </EditButton>
          </Row>

          <Row>
            <KeyLabel>
              <Key>/</Key>
            </KeyLabel>
            <Description>Search</Description>
            <EditButton>
              <Icons icon="edit" />
            </EditButton>
          </Row>

          <Row>
            <KeyLabel>
              <Key>alt</Key>
              <Joiner>+</Joiner>
              <Key>▶︎</Key>
            </KeyLabel>
            <Description>Next Story</Description>
            <EditButton>
              <Icons icon="edit" />
            </EditButton>
          </Row>

          <Row>
            <KeyLabel>
              <Key>⌥</Key>
              <Joiner>+</Joiner>
              <Key>◀︎</Key>
            </KeyLabel>
            <Description>Previous Story</Description>
            <EditButton>
              <Icons icon="edit" />
            </EditButton>
          </Row>

          <Row>
            <KeyLabel>
              <Key>⇧</Key>
              <Joiner>+</Joiner>
              <Key>⌘</Key>
              <Joiner>+</Joiner>
              <Key>,</Key>
            </KeyLabel>
            <Description>Customize Storybook Hotkeys</Description>
            <EditButton>
              <Icons icon="edit" />
            </EditButton>
          </Row>
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
