import React, { Component } from 'react';
import { Icons } from '@storybook/components';
import ReactModal from 'react-modal';
import { Route } from '../router';
import {
  controlOrMetaKey,
  controlOrMetaSymbol,
  optionOrAltSymbol,
} from '../../../components/src/treeview/utils';
import { defaultKeyboardShortcuts, isSetEqual, keyToSymbol, parseKey } from './utils';
import {
  A,
  Button,
  ColWrapper,
  Container,
  Description,
  Footer,
  GridHeaderRow,
  GridWrapper,
  Heading,
  Header,
  HeaderItem,
  IconButton,
  CenteredRow,
  HotKeyWrapper,
  Joiner,
  Key,
  KeyLabel,
  Main,
  ModalInnerWrapper,
  ModalInputWrapper,
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
      inputValue: new Set(),
      hasSaveError: false,
      shortcutKeys: {
        fullScreen: new Set(['F']),
        togglePanel: new Set(['S']), // Panel visibility
        panelPosition: new Set(['D']),
        navigation: new Set(['A']),
        search: new Set(['/']),
        focusNav: new Set(['1']),
        focusIframe: new Set(['2']),
        focusPanel: new Set(['3']),
        prevComponent: new Set(['alt', 'ArrowUp']),
        nextComponent: new Set(['alt', 'ArrowDown']),
        prevStory: new Set(['alt', 'ArrowLeft']),
        nextStory: new Set(['alt', 'ArrowRight']),
        shortcutsPage: new Set(['shift', ',', controlOrMetaKey()]),
        aboutPage: new Set([',']),
      },
    };
  }

  shortcutCreator = field => () => {
    const { shortcutKeys } = this.state;
    const creator = isSetEqual(shortcutKeys[field], defaultKeyboardShortcuts[field])
      ? 'Default'
      : 'User';

    return creator;
  };

  handleOpenModal = (inputName, title) => () => {
    this.setState({ showModal: true, activeInputField: inputName, activeTitle: title });
  };

  handleCloseModal = () => {
    this.setState({
      showModal: false,
      activeInputField: '',
      activeTitle: '',
      inputValue: new Set(),
    });
  };

  captureKeyPress = e => {
    const { inputValue } = this.state;

    const parsedKey = parseKey(e);
    const newSet = inputValue.add(parsedKey);
    this.setState({ inputValue: newSet, hasSaveError: false });
  };

  clearShortcuts = () => this.setState({ inputValue: new Set() });

  canSave = () => {
    const { inputValue, shortcutKeys } = this.state;
    const match = Object.entries(shortcutKeys).filter(i => !isSetEqual(inputValue, i[1]));

    return !!match.length;
  };

  saveShortcut = e => {
    const { activeInputField, shortcutKeys } = this.state;
    const parsedKey = parseKey(e);
    if (!this.canSave()) {
      this.setState({ hasSaveError: true });
    }
    const newSet = shortcutKeys[activeInputField].add(parsedKey);
    this.setState({ [activeInputField]: newSet });
  };

  renderCheckBox = stateValue => {
    const { shortcutKeys } = this.state;
    if (shortcutKeys[stateValue] && shortcutKeys[stateValue].size > 0) {
      return [
        <IconButton colorTheme="success" onClick={this.saveShortcut} key="confirmButton">
          <Icons icon="check" />
        </IconButton>,
        <IconButton colorTheme="undo" onClick={this.clearShortcuts} key="undoButton">
          <Icons icon="undo" />
        </IconButton>,
      ];
    }
    return undefined;
  };

  restoreDefaults = () => {
    this.setState({ shortcutKeys: defaultKeyboardShortcuts });
  };

  renderIndividualKeys = () => {
    const { inputValue } = this.state;

    if (inputValue && inputValue.size > 0) {
      const setArray = Array.from(inputValue);
      return setArray.map(k => (
        <KeyLabel key={k}>
          <Key>{keyToSymbol(k)}</Key>
        </KeyLabel>
      ));
    }
    return undefined;
  };

  renderKeyBlob = () => (
    <GridWrapper>
      <GridHeaderRow>
        <HeaderItem>Hot Keys</HeaderItem>
        <HeaderItem>Command</HeaderItem>
        <HeaderItem>Source</HeaderItem>
      </GridHeaderRow>
      <Row>
        <IconButton
          colorTheme="edit"
          onClick={this.handleOpenModal('fullScreen', 'full screen')}
          className="IconButton"
        >
          <Icons icon="edit" />
        </IconButton>
        <KeyLabel>
          <Key>F</Key>
        </KeyLabel>
        <Description>Go Fullscreen</Description>
        <Description>{this.shortcutCreator('fullScreen')()}</Description>
      </Row>

      <Row>
        <IconButton
          colorTheme="edit"
          onClick={this.handleOpenModal('togglePanel', 'toggle panel')}
          className="IconButton"
        >
          <Icons icon="edit" />
        </IconButton>
        <KeyLabel>
          <Key>D</Key>
        </KeyLabel>
        <Description>Toggle Panel</Description>
        <Description>{this.shortcutCreator('togglePanel')()}</Description>
      </Row>

      <Row>
        <IconButton
          colorTheme="edit"
          onClick={this.handleOpenModal('panelPosition', 'panel position')}
          className="IconButton"
        >
          <Icons icon="edit" />
        </IconButton>
        <KeyLabel>
          <Key>G</Key>
        </KeyLabel>
        <Description>Toggle Panel Position</Description>
        <Description>{this.shortcutCreator('panelPosition')()}</Description>
      </Row>

      <Row>
        <IconButton
          colorTheme="edit"
          onClick={this.handleOpenModal('navigation', 'navigation')}
          className="IconButton"
        >
          <Icons icon="edit" />
        </IconButton>
        <KeyLabel>
          <Key>S</Key>
        </KeyLabel>
        <Description>Toggle Navigation</Description>
        <Description>{this.shortcutCreator('navigation')()}</Description>
      </Row>

      <Row>
        <IconButton
          colorTheme="edit"
          onClick={this.handleOpenModal('search', 'search')}
          className="IconButton"
        >
          <Icons icon="edit" />
        </IconButton>
        <KeyLabel>
          <Key>/</Key>
        </KeyLabel>
        <Description>Focus Search</Description>
        <Description>{this.shortcutCreator('search')()}</Description>
      </Row>

      <Row>
        <IconButton
          colorTheme="edit"
          onClick={this.handleOpenModal('focusNav', 'focus nav')}
          className="IconButton"
        >
          <Icons icon="edit" />
        </IconButton>
        <KeyLabel>
          <Key>1</Key>
        </KeyLabel>
        <Description>Focus Nav</Description>
        <Description>{this.shortcutCreator('focusNav')()}</Description>
      </Row>

      <Row>
        <IconButton
          colorTheme="edit"
          onClick={this.handleOpenModal('focusIframe', 'focus Iframe')}
          className="IconButton"
        >
          <Icons icon="edit" />
        </IconButton>
        <KeyLabel>
          <Key>2</Key>
        </KeyLabel>
        <Description>Focus Iframe</Description>
        <Description>{this.shortcutCreator('focusIframe')()}</Description>
      </Row>

      <Row>
        <IconButton
          colorTheme="edit"
          onClick={this.handleOpenModal('focusPanel', 'focus panel')}
          className="IconButton"
        >
          <Icons icon="edit" />
        </IconButton>
        <KeyLabel>
          <Key>3</Key>
        </KeyLabel>
        <Description>Focus Panel</Description>
        <Description>{this.shortcutCreator('focusPanel')()}</Description>
      </Row>

      <Row>
        <IconButton
          colorTheme="edit"
          onClick={this.handleOpenModal('prevComponent', 'previous component')}
          className="IconButton"
        >
          <Icons icon="edit" />
        </IconButton>
        <KeyLabel>
          <Key>{optionOrAltSymbol()}</Key>
          <Joiner>+</Joiner>
          <Key>▲</Key>
        </KeyLabel>
        <Description>Previous Component</Description>
        <Description>{this.shortcutCreator('prevComponent')()}</Description>
      </Row>

      <Row>
        <IconButton
          colorTheme="edit"
          onClick={this.handleOpenModal('nextComponent', 'next component')}
          className="IconButton"
        >
          <Icons icon="edit" />
        </IconButton>
        <KeyLabel>
          <Key>{optionOrAltSymbol()}</Key>
          <Joiner>+</Joiner>
          <Key>▼</Key>
        </KeyLabel>
        <Description>Next Component</Description>
        <Description>{this.shortcutCreator('nextComponent')()}</Description>
      </Row>

      <Row>
        <IconButton
          colorTheme="edit"
          onClick={this.handleOpenModal('prevStory', 'previous story')}
          className="IconButton"
        >
          <Icons icon="edit" />
        </IconButton>
        <KeyLabel>
          <Key>{optionOrAltSymbol()}</Key>
          <Joiner>+</Joiner>
          <Key>◀︎</Key>
        </KeyLabel>
        <Description>Previous Story</Description>
        <Description>{this.shortcutCreator('prevStory')()}</Description>
      </Row>

      <Row>
        <IconButton
          colorTheme="edit"
          onClick={this.handleOpenModal('nextStory', 'next story')}
          className="IconButton"
        >
          <Icons icon="edit" />
        </IconButton>
        <KeyLabel>
          <Key>{optionOrAltSymbol()}</Key>
          <Joiner>+</Joiner>
          <Key>▶︎</Key>
        </KeyLabel>
        <Description>Next Story</Description>
        <Description>{this.shortcutCreator('nextStory')()}</Description>
      </Row>

      <Row>
        <IconButton
          colorTheme="edit"
          onClick={this.handleOpenModal('shortcutsPage', 'shortcuts page')}
          className="IconButton"
        >
          <Icons icon="edit" />
        </IconButton>
        <KeyLabel>
          <Key>⇧</Key>
          <Joiner>+</Joiner>
          <Key>{controlOrMetaSymbol()}</Key>
          <Joiner>+</Joiner>
          <Key>,</Key>
        </KeyLabel>
        <Description>Customize Storybook</Description>
        <Description>{this.shortcutCreator('shortcutsPage')()}</Description>
      </Row>

      <Row>
        <IconButton
          colorTheme="edit"
          onClick={this.handleOpenModal('aboutPage', 'about page')}
          className="IconButton"
        >
          <Icons icon="edit" />
        </IconButton>
        <KeyLabel>
          <Key>,</Key>
        </KeyLabel>
        <Description>Go to About Page</Description>
        <Description>{this.shortcutCreator('aboutPage')()}</Description>
      </Row>
    </GridWrapper>
  );

  render() {
    const { activeInputField, activeTitle, hasSaveError, inputValue, showModal } = this.state;
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
          shouldCloseOnEsc={false}
          className="tmp" // This exists to make the Modal discard it's default styles for content
          isOpen={showModal}
          shouldFocusAfterRender={false}
          contentLabel="onRequestClose Example"
          onRequestClose={this.handleCloseModal}
        >
          <ModalInnerWrapper>
            <Icons className="modalClose" icon="cross" onClick={this.handleCloseModal} />
            {hasSaveError && (
              <Heading style={{ width: '100%', color: 'orange' }}>
                <CenteredRow>
                  <Icons icon="alert" /> Shortcut already taken
                </CenteredRow>
              </Heading>
            )}
            <Description>Enter your desired key combination for {activeTitle}</Description>
            <ModalInputWrapper>
              <HotKeyWrapper>
                <CenteredRow>{this.renderIndividualKeys()}</CenteredRow>
                {this.renderCheckBox(activeInputField)}
              </HotKeyWrapper>
              <TextInput
                autofocus="autofocus"
                value={inputValue}
                onKeyDown={this.captureKeyPress}
              />
            </ModalInputWrapper>
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
              <Heading>
                <Header>
                  Configure Shortcuts Below
                  <Button onClick={this.restoreDefaults}>Restore Defaults</Button>
                </Header>
              </Heading>
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
