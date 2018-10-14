import React, { Component } from 'react';
import { Icons } from '@storybook/components';
import keycode from 'keycode';
import { Route } from '../router';
import { controlOrMetaKey, optionOrAlt } from '../../../components/src/treeview/utils';

import {
  A,
  Container,
  Description,
  EditButton,
  Footer,
  GridWrapper,
  Heading,
  Joiner,
  Key,
  KeyLabel,
  Main,
  Row,
  Title,
  TitleIcon,
  TextInput,
  TitleText,
  Wrapper,
} from './components';

class ShortcutsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hotkeys: new Set(),
    };
  }

  // renderKeyRow;

  renderKeyBlob = () => (
    <GridWrapper>
      <Row>
        <KeyLabel>
          <Key>F</Key>
        </KeyLabel>
        <Description>Go Fullscreen</Description>
        <TextInput />
        <EditButton>
          <Icons icon="edit" />
        </EditButton>
      </Row>

      <Row>
        <KeyLabel>
          <Key>D</Key>
        </KeyLabel>
        <Description>Toggle Panel</Description>
        <TextInput />
        <EditButton>
          <Icons icon="edit" />
        </EditButton>
      </Row>

      <Row>
        <KeyLabel>
          <Key>G</Key>
        </KeyLabel>
        <Description>Toggle Panel Position</Description>
        <TextInput />
        <EditButton>
          <Icons icon="edit" />
        </EditButton>
      </Row>

      <Row>
        <KeyLabel>
          <Key>S</Key>
        </KeyLabel>
        <Description>Toggle Navigation</Description>
        <TextInput />
        <EditButton>
          <Icons icon="edit" />
        </EditButton>
      </Row>

      <Row>
        <KeyLabel>
          <Key>/</Key>
        </KeyLabel>
        <Description>Search</Description>

        <TextInput />
        <EditButton>
          <Icons icon="edit" />
        </EditButton>
      </Row>

      <Row>
        <KeyLabel>
          <Key>{optionOrAlt()}</Key>
          <Joiner>+</Joiner>
          <Key>▲</Key>
        </KeyLabel>
        <Description>Previous Component</Description>
        <TextInput />
        <EditButton>
          <Icons icon="edit" />
        </EditButton>
      </Row>

      <Row>
        <KeyLabel>
          <Key>{optionOrAlt()}</Key>
          <Joiner>+</Joiner>
          <Key>▼</Key>
        </KeyLabel>
        <Description>Next Component</Description>
        <TextInput />
        <EditButton>
          <Icons icon="edit" />
        </EditButton>
      </Row>

      <Row>
        <KeyLabel>
          <Key>{optionOrAlt()}</Key>
          <Joiner>+</Joiner>
          <Key>◀︎</Key>
        </KeyLabel>
        <Description>Previous Story</Description>
        <TextInput />
        <EditButton>
          <Icons icon="edit" />
        </EditButton>
      </Row>

      <Row>
        <KeyLabel>
          <Key>{optionOrAlt()}</Key>
          <Joiner>+</Joiner>
          <Key>▶︎</Key>
        </KeyLabel>
        <Description>Next Story</Description>
        <TextInput />
        <EditButton>
          <Icons icon="edit" />
        </EditButton>
      </Row>

      <Row>
        <KeyLabel>
          <Key>⇧</Key>
          <Joiner>+</Joiner>
          <Key>{controlOrMetaKey()}</Key>
          <Joiner>+</Joiner>
          <Key>,</Key>
        </KeyLabel>
        <Description>Customize Storybook Hotkeys</Description>
        <TextInput />
        <EditButton>
          <Icons icon="edit" />
        </EditButton>
      </Row>
    </GridWrapper>
  );

  render() {
    const layout = this.renderKeyBlob();
    return (
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
              {layout}
            </Main>
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
  }
}

export { ShortcutsPage as default };
