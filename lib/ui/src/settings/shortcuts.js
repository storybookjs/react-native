import React, { Component } from 'react';
import { Icons } from '@storybook/components';
import ReactModal from 'react-modal';
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
  ColWrapper,
  GridWrapper,
  Heading,
  HeaderItem,
  HeaderRow,
  Joiner,
  Key,
  KeyLabel,
  Main,
  ModalInnerWrapper,
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
      showModal: false,
      activeInputField: '',
      activeTitle: '',
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

  handleOpenModal = (inputName, title) => () => {
    this.setState({ showModal: true, activeInputField: inputName, activeTitle: title });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, activeInputField: '', activeTitle: '' });
  };

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
      <HeaderRow>
        <HeaderItem>Hot Keys</HeaderItem>
        <HeaderItem>Command</HeaderItem>
        <HeaderItem>Source</HeaderItem>
      </HeaderRow>
      <Row>
        <EditButton onClick={this.handleOpenModal('fullScreen')} className="editButton">
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>F</Key>
        </KeyLabel>
        <Description>Go Fullscreen</Description>
        <Description>Default</Description>

        {/* <div>{this.renderIndividualKeys('fullScreen')}</div> */}
        {/* <TextInput onKeyDown={this.captureKeyPress('fullScreen')} /> */}
      </Row>

      <Row>
        <EditButton
          onClick={this.handleOpenModal('togglePanel', 'toggle panel')}
          className="editButton"
        >
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>D</Key>
        </KeyLabel>
        <Description>Toggle Panel</Description>
        <Description>Default</Description>
        {/* <div>{this.renderIndividualKeys('togglePanel')}</div>
        <TextInput onKeyDown={this.captureKeyPress('togglePanel')} /> */}
      </Row>

      <Row>
        <EditButton
          onClick={this.handleOpenModal('panelPosition', 'panel position')}
          className="editButton"
        >
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>G</Key>
        </KeyLabel>
        <Description>Toggle Panel Position</Description>
        <Description>Default</Description>
        {/* <div>{this.renderIndividualKeys('panelPosition')}</div>
        <TextInput onKeyDown={this.captureKeyPress('panelPosition')} /> */}
      </Row>

      <Row>
        <EditButton
          onClick={this.handleOpenModal('navigation', 'navigation')}
          className="editButton"
        >
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>S</Key>
        </KeyLabel>
        <Description>Toggle Navigation</Description>
        <Description>Default</Description>
        {/* <div>{this.renderIndividualKeys('navigation')}</div>
        <TextInput onKeyDown={this.captureKeyPress('navigation')} /> */}
      </Row>

      <Row>
        <EditButton onClick={this.handleOpenModal('search', 'search')} className="editButton">
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>/</Key>
        </KeyLabel>
        <Description>Search</Description>
        <Description>Default</Description>
        {/* <div>{this.renderIndividualKeys('search')}</div>
         <TextInput onKeyDown={this.captureKeyPress('search')} /> */}
      </Row>

      <Row>
        <EditButton
          onClick={this.handleOpenModal('prevComponent', 'previous component')}
          className="editButton"
        >
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>{optionOrAlt()}</Key>
          <Joiner>+</Joiner>
          <Key>▲</Key>
        </KeyLabel>
        <Description>Previous Component</Description>
        <Description>Default</Description>
        {/* <div>{this.renderIndividualKeys('prevComponent')}</div>
        <TextInput onKeyDown={this.captureKeyPress('prevComponent')} /> */}
      </Row>

      <Row>
        <EditButton
          onClick={this.handleOpenModal('nextComponent', 'next component')}
          className="editButton"
        >
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>{optionOrAlt()}</Key>
          <Joiner>+</Joiner>
          <Key>▼</Key>
        </KeyLabel>
        <Description>Next Component</Description>
        <Description>Default</Description>
        {/* <div>{this.renderIndividualKeys('nextComponent')}</div>
        <TextInput onKeyDown={this.captureKeyPress('nextComponent')} /> */}
      </Row>

      <Row>
        <EditButton
          onClick={this.handleOpenModal('prevStory', 'previous story')}
          className="editButton"
        >
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>{optionOrAlt()}</Key>
          <Joiner>+</Joiner>
          <Key>◀︎</Key>
        </KeyLabel>
        <Description>Previous Story</Description>
        <Description>Default</Description>
        {/* <div>{this.renderIndividualKeys('prevStory')}</div>
        <TextInput onKeyDown={this.captureKeyPress('prevStory')} /> */}
      </Row>

      <Row>
        <EditButton
          onClick={this.handleOpenModal('nextStory', 'next story')}
          className="editButton"
        >
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>{optionOrAlt()}</Key>
          <Joiner>+</Joiner>
          <Key>▶︎</Key>
        </KeyLabel>
        <Description>Next Story</Description>
        <Description>Default</Description>
        {/* <div>{this.renderIndividualKeys('nextStory')}</div>
        <TextInput onKeyDown={this.captureKeyPress('nextStory')} /> */}
      </Row>

      <Row>
        <EditButton
          onClick={this.handleOpenModal('shortcutsPage', 'shortcuts page')}
          className="editButton"
        >
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>⇧</Key>
          <Joiner>+</Joiner>
          <Key>{controlOrMetaKey()}</Key>
          <Joiner>+</Joiner>
          <Key>,</Key>
        </KeyLabel>
        <Description>Customize Storybook Hotkeys</Description>
        <Description>Default</Description>
        {/* <div>{this.renderIndividualKeys('shortcutsPage')}</div>
        <TextInput onKeyDown={this.captureKeyPress('shortcutsPage')} /> */}
      </Row>
    </GridWrapper>
  );

  render() {
    const { activeInputField, activeTitle, showModal } = this.state;
    const layout = this.renderKeyBlob();
    return (
      <Route path="shortcuts">
        <ReactModal
          style={{
            overlay: {
              height: '100vh',
              width: '100vw',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(to bottom right, rgba(233, 233, 233, 0.6), rgba(255, 255, 255, 0.8))',
              zIndex: 1,
            },
          }}
          className="tmp" // This exists to make the Modal discard it's default styles for content
          isOpen={showModal}
          contentLabel="onRequestClose Example"
          onRequestClose={this.handleCloseModal}
        >
          <ModalInnerWrapper>
            <Icons className="modalClose" icon="cross" onClick={this.handleCloseModal} />
            <ColWrapper>
              <Description>Enter your desired key combination for {activeTitle}</Description>
              <div>{this.renderIndividualKeys(activeInputField)}</div>
              <TextInput onKeyDown={this.captureKeyPress(activeInputField)} />
            </ColWrapper>
          </ModalInnerWrapper>
        </ReactModal>

        <Container>
          <Wrapper>
            <Title>
              <TitleIcon />
              <TitleText>Storybook Shortcuts</TitleText>
            </Title>
          </Wrapper>
          <ColWrapper>
            <Main>
              <Heading>Configure Shortcuts Below</Heading>
              {layout}
            </Main>
          </ColWrapper>
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
