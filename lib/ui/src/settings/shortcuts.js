import React, { Component } from 'react';
import { Icons } from '@storybook/components';
import ReactModal from 'react-modal';
import { Route } from '../router';
import { controlOrMetaSymbol, optionOrAltSymbol } from '../../../components/src/treeview/utils';
import { defaultKeyboardShortcuts, keyToSymbol, parseKey } from './utils';
import {
  A,
  ConfirmButton,
  Container,
  Description,
  EditButton,
  Footer,
  ColWrapper,
  GridWrapper,
  Heading,
  Header,
  HeaderItem,
  GridHeaderRow,
  Hotkeys,
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
  UndoButton,
  Wrapper,
} from './components';
import { Badge } from '../../../components/src/menu/menu';

class ShortcutsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      activeInputField: '',
      activeTitle: '',
      shortcutKeys: {
        ...defaultKeyboardShortcuts,
      },
    };
  }

  handleOpenModal = (inputName, title) => () => {
    this.setState({ showModal: true, activeInputField: inputName, activeTitle: title });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, activeInputField: '', activeTitle: '' });
  };

  captureKeyPress = stateValue => e => {
    const { shortcutKeys } = this.state;

    const parsedKey = parseKey(e);
    const newSet = shortcutKeys[stateValue].add(parsedKey);
    this.setState({ [stateValue]: newSet });
  };

  clearShortCuts = () => {
    const { activeInputField, shortcutKeys } = this.state;
    const clearedSet = shortcutKeys[activeInputField].clear();

    return this.setState({ [activeInputField]: clearedSet });
  };

  renderCheckBox = stateValue => {
    const { shortcutKeys } = this.state;
    if (shortcutKeys[stateValue] && shortcutKeys[stateValue].size > 0) {
      return [
        <ConfirmButton key="confirmButton">
          <Icons icon="check" />
        </ConfirmButton>,
        <UndoButton key="undoButton">
          <Icons icon="undo" onClick={this.clearShortCuts} />
        </UndoButton>,
      ];
    }
    return undefined;
  };

  restoreDefaults = () => this.setState({ shortcutKeys: { ...defaultKeyboardShortcuts } });

  renderIndividualKeys = stateValue => {
    const { shortcutKeys } = this.state;
    if (stateValue && shortcutKeys[stateValue].size > 0) {
      const setArray = Array.from(shortcutKeys[stateValue]);
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
        <EditButton onClick={this.handleOpenModal('fullScreen')} className="editButton">
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>F</Key>
        </KeyLabel>
        <Description>Go Fullscreen</Description>
        <Description>Default</Description>
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
      </Row>

      <Row>
        <EditButton onClick={this.handleOpenModal('search', 'search')} className="editButton">
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>/</Key>
        </KeyLabel>
        <Description>Focus Search</Description>
        <Description>Default</Description>
      </Row>

      <Row>
        <EditButton onClick={this.handleOpenModal('focusNav', 'focus nav')} className="editButton">
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>1</Key>
        </KeyLabel>
        <Description>Focus Nav</Description>
        <Description>Default</Description>
      </Row>

      <Row>
        <EditButton
          onClick={this.handleOpenModal('focusIframe', 'focus Iframe')}
          className="editButton"
        >
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>2</Key>
        </KeyLabel>
        <Description>Focus Iframe</Description>
        <Description>Default</Description>
      </Row>

      <Row>
        <EditButton
          onClick={this.handleOpenModal('focusPanel', 'focus panel')}
          className="editButton"
        >
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>3</Key>
        </KeyLabel>
        <Description>Focus Panel</Description>
        <Description>Default</Description>
      </Row>

      <Row>
        <EditButton
          onClick={this.handleOpenModal('prevComponent', 'previous component')}
          className="editButton"
        >
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>{optionOrAltSymbol()}</Key>
          <Joiner>+</Joiner>
          <Key>▲</Key>
        </KeyLabel>
        <Description>Previous Component</Description>
        <Description>Default</Description>
      </Row>

      <Row>
        <EditButton
          onClick={this.handleOpenModal('nextComponent', 'next component')}
          className="editButton"
        >
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>{optionOrAltSymbol()}</Key>
          <Joiner>+</Joiner>
          <Key>▼</Key>
        </KeyLabel>
        <Description>Next Component</Description>
        <Description>Default</Description>
      </Row>

      <Row>
        <EditButton
          onClick={this.handleOpenModal('prevStory', 'previous story')}
          className="editButton"
        >
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>{optionOrAltSymbol()}</Key>
          <Joiner>+</Joiner>
          <Key>◀︎</Key>
        </KeyLabel>
        <Description>Previous Story</Description>
        <Description>Default</Description>
      </Row>

      <Row>
        <EditButton
          onClick={this.handleOpenModal('nextStory', 'next story')}
          className="editButton"
        >
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>{optionOrAltSymbol()}</Key>
          <Joiner>+</Joiner>
          <Key>▶︎</Key>
        </KeyLabel>
        <Description>Next Story</Description>
        <Description>Default</Description>
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
          <Key>{controlOrMetaSymbol()}</Key>
          <Joiner>+</Joiner>
          <Key>,</Key>
        </KeyLabel>
        <Description>Customize Storybook Hotkeys</Description>
        <Description>Default</Description>
      </Row>

      <Row>
        <EditButton
          onClick={this.handleOpenModal('aboutPage', 'about page')}
          className="editButton"
        >
          <Icons icon="edit" />
        </EditButton>
        <KeyLabel>
          <Key>,</Key>
        </KeyLabel>
        <Description>Go to About Page</Description>
        <Description>Default</Description>
      </Row>
    </GridWrapper>
  );

  render() {
    const { activeInputField, activeTitle, shortcutKeys, showModal } = this.state;
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

            <Description>Enter your desired key combination for {activeTitle}</Description>
            <ModalInputWrapper>
              <HotKeyWrapper>
                <Hotkeys>{this.renderIndividualKeys(activeInputField)}</Hotkeys>
                {this.renderCheckBox(activeInputField)}
              </HotKeyWrapper>
              <TextInput
                autofocus="autofocus"
                value={shortcutKeys[activeInputField]}
                onKeyDown={this.captureKeyPress(activeInputField)}
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
                  Configure Shortcuts Below{' '}
                  <Badge onClick={this.restoreDefaults}>Restore Defaults</Badge>
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
