import React, { Component } from 'react';
import { Icons, Router } from '@storybook/components';
import { setAll, setItem } from './persist';

import {
  defaultShortcutSets,
  serializableKeyboardShortcuts,
  initShortcutKeys,
  isSetEqual,
  mapToKeyEl,
  parseKey,
  serializedLocalStorage,
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
  Main,
  KeyInputWrapper,
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
    const shortcuts = initShortcutKeys();

    this.state = {
      activeInputField: '',
      inputValue: new Set(),
      shortcutKeys: serializedLocalStorage(shortcuts),
    };
  }

  clearShortcut = activeInput => () => {
    const { shortcutKeys } = this.state;
    return this.setState({
      shortcutKeys: { ...shortcutKeys, [activeInput]: { value: new Set() } },
    });
  };

  duplicateFound = () => {
    const { inputValue, shortcutKeys } = this.state;
    const match = Object.entries(shortcutKeys).filter(i => isSetEqual(inputValue, i[1]));
    return !!match.length;
  };

  onChange = e => {
    const { inputValue, shortcutKeys, activeInputField } = this.state;
    const parsedKey = parseKey(e);
    const newSet = inputValue.add(parsedKey);
    this.setState({
      inputValue: newSet,
      shortcutKeys: { ...shortcutKeys, [activeInputField]: { value: newSet, error: false } },
    });
  };

  onFocus = focusedInput => () => {
    const { shortcutKeys } = this.state;
    this.setState({
      activeInputField: focusedInput,
      shortcutKeys: { ...shortcutKeys, [focusedInput]: { value: new Set() } },
    });
  };

  onBlur = () => {
    const { shortcutKeys, activeInputField } = this.state;
    if (shortcutKeys[activeInputField].value.size === 0) {
      this.restoreDefault(activeInputField);
    }
    this.setState({ activeInputField: '' });
    this.saveShortcut();
  };

  saveShortcut = () => {
    const { activeInputField, inputValue, shortcutKeys } = this.state;

    if (this.duplicateFound()) {
      return this.setState({
        shortcutKeys: { ...shortcutKeys, [activeInputField]: { error: true } },
      });
    }

    this.setState({
      shortcutKeys: { ...shortcutKeys, [activeInputField]: { value: inputValue } },
    });
    return setItem('shortcutKeys', activeInputField, [...inputValue]);
  };

  restoreDefaults = () => {
    this.setState({ shortcutKeys: serializedLocalStorage(serializableKeyboardShortcuts) });
    setAll('shortcutKeys', serializableKeyboardShortcuts);
  };

  restoreDefault = keyToReset => {
    const { shortcutKeys } = this.state;
    this.setState({
      shortcutKeys: { ...shortcutKeys, [keyToReset]: defaultShortcutSets[keyToReset] },
    });
    setItem('shortcutKeys', keyToReset, serializableKeyboardShortcuts[keyToReset]);
  };

  renderStateKeys = stateVal => () => {
    const { shortcutKeys } = this.state;
    const inputValue = shortcutKeys[stateVal];
    return mapToKeyEl(inputValue.value);
  };

  renderKeyBlob = () => {
    const { shortcutKeys } = this.state;
    const {
      fullScreen,
      togglePanel,
      navigation,
      search,
      nextStory,
      prevStory,
      nextComponent,
      prevComponent,
      focusIframe,
      focusPanel,
      aboutPage,
      shortcutsPage,
      panelPosition,
      focusNav,
    } = shortcutKeys;

    return (
      <GridWrapper>
        <GridHeaderRow>
          <HeaderItem>Commands</HeaderItem>
          <HeaderItem>Shortcut</HeaderItem>
        </GridHeaderRow>

        <Row>
          <Description>Go full screen</Description>
          <IconButton
            className="clear"
            colorTheme="undo"
            onClick={this.clearShortcut('fullScreen')}
            key="undoButton"
          >
            <Icons height={10} icon="cross" />
          </IconButton>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('fullScreen')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('fullScreen')}
                onKeyDown={this.onChange}
                value={fullScreen}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
        </Row>

        <Row>
          <Description>Toggle panel</Description>
          <IconButton
            className="clear"
            colorTheme="undo"
            onClick={this.clearShortcut('togglePanel')}
          >
            <Icons height={10} icon="cross" />
          </IconButton>

          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('togglePanel')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('togglePanel')}
                onChange={this.onChange}
                value={togglePanel.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
        </Row>

        <Row>
          <Description>Toggle panel position</Description>
          <IconButton
            className="clear"
            colorTheme="undo"
            onClick={this.clearShortcut('panelPosition')}
          >
            <Icons height={10} icon="cross" />
          </IconButton>

          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('panelPosition')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('panelPosition')}
                onChange={this.onChange}
                value={panelPosition.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
        </Row>

        <Row>
          <Description>Toggle navigation</Description>
          <IconButton
            className="clear"
            colorTheme="undo"
            onClick={this.clearShortcut('navigation')}
          >
            <Icons height={10} icon="cross" />
          </IconButton>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('navigation')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('navigation')}
                onChange={this.onChange}
                value={navigation.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
        </Row>

        <Row>
          <Description>Focus search</Description>
          <IconButton className="clear" colorTheme="undo" onClick={this.clearShortcut('search')}>
            <Icons height={10} icon="cross" />
          </IconButton>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('search')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('search')}
                onChange={this.onChange}
                value={search.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
        </Row>

        <Row>
          <Description>Focus nav</Description>
          <IconButton className="clear" colorTheme="undo" onClick={this.clearShortcut('focusNav')}>
            <Icons height={10} icon="cross" />
          </IconButton>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('focusNav')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('focusNav')}
                onChange={this.onChange}
                value={focusNav.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
        </Row>

        <Row>
          <Description>Focus iframe</Description>
          <IconButton
            className="clear"
            colorTheme="undo"
            onClick={this.clearShortcut('focusIframe')}
          >
            <Icons height={10} icon="cross" />
          </IconButton>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('focusIframe')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('focusIframe')}
                onChange={this.onChange}
                value={focusIframe.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
        </Row>

        <Row>
          <Description>Focus panel</Description>
          <IconButton
            className="clear"
            colorTheme="undo"
            onClick={this.clearShortcut('focusPanel')}
          >
            <Icons height={10} icon="cross" />
          </IconButton>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('focusPanel')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('focusPanel')}
                onChange={this.onChange}
                value={focusPanel.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
        </Row>

        <Row>
          <Description>Previous component</Description>
          <IconButton
            className="clear"
            colorTheme="undo"
            onClick={this.clearShortcut('prevComponent')}
          >
            <Icons height={10} icon="cross" />
          </IconButton>

          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('prevComponent')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('prevComponent')}
                onChange={this.onChange}
                value={prevComponent.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
        </Row>

        <Row>
          <Description>Next component</Description>
          <IconButton
            className="clear"
            colorTheme="undo"
            onClick={this.clearShortcut('nextComponent')}
          >
            <Icons height={10} icon="cross" />
          </IconButton>

          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('nextComponent')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('nextComponent')}
                onChange={this.onChange}
                value={nextComponent.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
        </Row>

        <Row>
          <Description>Previous story</Description>
          <IconButton className="clear" colorTheme="undo" onClick={this.clearShortcut('prevStory')}>
            <Icons height={10} icon="cross" />
          </IconButton>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('prevStory')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('prevStory')}
                onChange={this.onChange}
                value={prevStory.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
        </Row>

        <Row>
          <Description>Next story</Description>
          <IconButton className="clear" colorTheme="undo" onClick={this.clearShortcut('nextStory')}>
            <Icons height={10} icon="cross" />
          </IconButton>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('nextStory')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('nextStory')}
                onChange={this.onChange}
                value={nextStory.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
        </Row>

        <Row>
          <Description>Go to Shortcuts Page</Description>
          <IconButton
            className="clear"
            colorTheme="undo"
            onClick={this.clearShortcut('shortcutsPage')}
          >
            <Icons height={10} icon="cross" />
          </IconButton>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('shortcutsPage')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('shortcutsPage')}
                onChange={this.onChange}
                value={shortcutsPage.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
        </Row>

        <Row>
          <Description>Go to About Page</Description>
          <IconButton className="clear" colorTheme="undo" onClick={this.clearShortcut('aboutPage')}>
            <Icons height={10} icon="cross" />
          </IconButton>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('aboutPage')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('aboutPage')}
                onChange={this.onChange}
                value={aboutPage.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
        </Row>
      </GridWrapper>
    );
  };

  render() {
    const layout = this.renderKeyBlob();
    return (
      <Router.Route path="shortcuts">
        <Container>
          <Wrapper>
            <Title>
              <TitleIcon />
              <TitleText>Keyboard Shortcuts</TitleText>
            </Title>
          </Wrapper>
          <ColWrapper>
            <Main>
              <Heading>
                <Header>
                  <Button id="restoreDefaultsHotkeys" onClick={this.restoreDefaults}>
                    Restore Defaults
                  </Button>
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
      </Router.Route>
    );
  }
}

export default ShortcutsPage;
