import React, { Component } from 'react';
import { Icons } from '@storybook/components';
import ReactModal from 'react-modal';
import { Route } from '../router';
import {
  defaultHotkeys,
  defaultKeyboardShortcuts,
  isSetEqual,
  keyToSymbol,
  parseKey,
} from './utils';
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
        ...defaultKeyboardShortcuts,
      },
    };
  }

  shortcutCreator = field => () => {
    const { shortcutKeys } = this.state;
    const creator = isSetEqual(shortcutKeys[field], defaultHotkeys[field]) ? 'Default' : 'User';

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

  duplicateFound = () => {
    const { inputValue, shortcutKeys } = this.state;
    const match = Object.entries(shortcutKeys).filter(i => isSetEqual(inputValue, i[1]));
    return !!match.length;
  };

  saveShortcut = () => {
    const { activeInputField, inputValue, shortcutKeys } = this.state;

    if (this.duplicateFound()) {
      this.setState({ hasSaveError: true });
    }

    this.setState({
      shortcutKeys: { ...shortcutKeys, [activeInputField]: inputValue },
      showModal: false,
    });
  };

  renderCheckBox = stateValue => {
    const { shortcutKeys } = this.state;
    if (shortcutKeys[stateValue] && shortcutKeys[stateValue].size > 0) {
      return [
        <IconButton
          style={{ zIndex: 2 }}
          colorTheme="success"
          onClick={this.saveShortcut}
          key="confirmButton"
        >
          <Icons icon="check" />
        </IconButton>,
        <IconButton
          style={{ zIndex: 2 }}
          colorTheme="undo"
          onClick={this.clearShortcuts}
          key="undoButton"
        >
          <Icons icon="undo" />
        </IconButton>,
      ];
    }
    return undefined;
  };

  restoreDefaults = () => {
    this.setState({ shortcutKeys: defaultKeyboardShortcuts });
  };

  mapOverKeys = inputValue => {
    if (inputValue && inputValue.size > 0) {
      return Array.from(inputValue).map(k => (
        <KeyLabel key={k}>
          <Key>{keyToSymbol(k)}</Key>
        </KeyLabel>
      ));
    }
    return undefined;
  };

  renderStateKeys = stateVal => () => {
    const { shortcutKeys } = this.state;
    const inputValue = shortcutKeys[stateVal];
    return this.mapOverKeys(inputValue);
  };

  renderKeysInModal = () => {
    const { inputValue } = this.state;

    return this.mapOverKeys(inputValue);
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
        <div>{this.renderStateKeys('fullScreen')()}</div>
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

        <div>{this.renderStateKeys('togglePanel')()}</div>
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

        <div>{this.renderStateKeys('panelPosition')()}</div>
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
        <div>{this.renderStateKeys('navigation')()}</div>
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
        <div>{this.renderStateKeys('search')()}</div>
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
        <div>{this.renderStateKeys('focusNav')()}</div>
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
        <div>{this.renderStateKeys('focusIframe')()}</div>
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

        <div>{this.renderStateKeys('focusPanel')()}</div>
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

        <div>{this.renderStateKeys('prevComponent')()}</div>
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
        <div>{this.renderStateKeys('nextComponent')()}</div>
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
        <div>{this.renderStateKeys('prevStory')()}</div>
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
        <div>{this.renderStateKeys('nextStory')()}</div>
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
        <div>{this.renderStateKeys('shortcutsPage')()}</div>
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
        <div>{this.renderStateKeys('aboutPage')()}</div>
        <Description>Go to About Page</Description>
        <Description>{this.shortcutCreator('aboutPage')()}</Description>
      </Row>
    </GridWrapper>
  );

  render() {
    const { activeInputField, activeTitle, hasSaveError, inputValue, showModal } = this.state;
    const layout = this.renderKeyBlob();
    const displayErr = hasSaveError ? 1 : 0;
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
            <Description>Enter your desired key combination for {activeTitle}</Description>
            <Heading
              style={{
                transition: 'all .2s ease',
                width: '100%',
                opacity: displayErr,
                color: 'orange',
              }}
            >
              <CenteredRow>
                <Icons icon="alert" /> Shortcut already taken
              </CenteredRow>
            </Heading>

            <ModalInputWrapper>
              <HotKeyWrapper>
                <CenteredRow>{this.renderKeysInModal()}</CenteredRow>
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
