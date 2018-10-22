import React, { Component } from 'react';
import { Icons } from '@storybook/components';
import { Route } from '../router';
import {
  controlOrMetaKey,
  keyToSymbol,
  parseKey,
  optionOrAlt,
} from '../../../components/src/treeview/utils';

import {
  A,
  Container,
  Description,
  EditButton,
  Footer,
  KeyWrapper,
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
      fullScreen: new Set(),
      togglePanel: new Set(),
      panelPosition: new Set(),
      navigation: new Set(),
      search: new Set(),
      prevComponent: new Set(),
      nextComponent: new Set(),
      prevStory: new Set(),
      nextStory: new Set(),
      shortcutsPage: new Set(),
    };
  }

  componentWillUpdate() {
    console.log('comp updating');
  }

  captureKeyPress = stateValue => e => {
    const parsedKey = parseKey(e);
    const newSet = this.state[stateValue].add(parsedKey);
    this.setState({ [stateValue]: newSet });
  };

  renderIndividualKeys = stateValue => {
    if (stateValue && this.state[stateValue].size > 0) {
      const setArray = Array.from(this.state[stateValue]);
      return setArray.map(k => (
        <KeyLabel key={k}>
          <Key>{keyToSymbol(k)}</Key>
        </KeyLabel>
      ));
    }
  };

  renderKeyBlob = () => (
    <GridWrapper>
      <Row>
        <KeyLabel>
          <Key>F</Key>
        </KeyLabel>
        <Description>Go Fullscreen</Description>

        <div>{this.renderIndividualKeys('fullScreen')}</div>
        <TextInput onKeyDown={this.captureKeyPress('fullScreen')} />
        <EditButton>
          <Icons icon="edit" />
        </EditButton>
      </Row>

      <Row>
        <KeyLabel>
          <Key>D</Key>
        </KeyLabel>
        <Description>Toggle Panel</Description>
        <div>{this.renderIndividualKeys('togglePanel')}</div>
        <TextInput onKeyDown={this.captureKeyPress('togglePanel')} />
        <EditButton>
          <Icons icon="edit" />
        </EditButton>
      </Row>

      <Row>
        <KeyLabel>
          <Key>G</Key>
        </KeyLabel>
        <Description>Toggle Panel Position</Description>
        <div>{this.renderIndividualKeys('panelPosition')}</div>
        <TextInput onKeyDown={this.captureKeyPress('panelPosition')} />
        <EditButton>
          <Icons icon="edit" />
        </EditButton>
      </Row>

      <Row>
        <KeyLabel>
          <Key>S</Key>
        </KeyLabel>
        <Description>Toggle Navigation</Description>
        <div>{this.renderIndividualKeys('navigation')}</div>
        <TextInput onKeyDown={this.captureKeyPress('navigation')} />
        <EditButton>
          <Icons icon="edit" />
        </EditButton>
      </Row>

      <Row>
        <KeyLabel>
          <Key>/</Key>
        </KeyLabel>
        <Description>Search</Description>

        <div>{this.renderIndividualKeys('search')}</div>
        <TextInput onKeyDown={this.captureKeyPress('search')} />
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
        <div>{this.renderIndividualKeys('prevComponent')}</div>
        <TextInput onKeyDown={this.captureKeyPress('prevComponent')} />
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
        <div>{this.renderIndividualKeys('nextComponent')}</div>
        <TextInput onKeyDown={this.captureKeyPress('nextComponent')} />
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
        <div>{this.renderIndividualKeys('prevStory')}</div>
        <TextInput onKeyDown={this.captureKeyPress('prevStory')} />
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
        <div>{this.renderIndividualKeys('nextStory')}</div>
        <TextInput onKeyDown={this.captureKeyPress('nextStory')} />
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
        <div>{this.renderIndividualKeys('shortcutsPage')}</div>
        <TextInput onKeyDown={this.captureKeyPress('shortcutsPage')} />
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
          <KeyWrapper>
            <Main>
              <Heading>Configure Shortcuts Below</Heading>
              {layout}
            </Main>
          </KeyWrapper>
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

export default ShortcutsPage;
