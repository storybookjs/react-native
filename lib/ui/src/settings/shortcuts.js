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
  SuccessIcon,
  CenteredRow,
  HotKeyWrapper,
  Main,
  KeyInputWrapper,
  Row,
  Title,
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
      successField: '',
      shortcutKeys: serializedLocalStorage(shortcuts),
    };
  }

  duplicateFound = () => {
    const { inputValue, shortcutKeys } = this.state;
    const match = Object.entries(shortcutKeys).filter(i => isSetEqual(inputValue, i[1]));
    return !!match.length;
  };

  onChange = e => {
    const { inputValue, shortcutKeys, activeInputField } = this.state;
    const parsedKey = parseKey(e);
    this.setState({
      inputValue: inputValue.add(parsedKey),
      shortcutKeys: {
        ...shortcutKeys,
        [activeInputField]: { value: inputValue.add(parsedKey), error: false },
      },
    });
  };

  onFocus = focusedInput => () => {
    const { shortcutKeys } = this.state;
    this.setState({
      activeInputField: focusedInput,
      inputValue: new Set(),
      shortcutKeys: { ...shortcutKeys, [focusedInput]: { value: new Set() } },
    });
  };

  onBlur = () => {
    const { shortcutKeys, activeInputField } = this.state;
    if (shortcutKeys[activeInputField].value.size === 0) {
      return this.restoreDefault(activeInputField);
    }
    this.saveShortcut(activeInputField);
    return this.setState({ inputValue: new Set(), activeInputField: '' });
  };

  saveShortcut = activeInputField => {
    const { inputValue, shortcutKeys } = this.state;

    if (this.duplicateFound()) {
      return this.setState({
        shortcutKeys: { ...shortcutKeys, [activeInputField]: { error: true } },
      });
    }

    this.setState({
      successField: activeInputField,
      shortcutKeys: { ...shortcutKeys, [activeInputField]: { value: inputValue, error: false } },
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

  displaySuccessMessage = activeElement => {
    const { successField, shortcutKeys } = this.state;
    return activeElement === successField && shortcutKeys[activeElement].error === false
      ? 'success'
      : '';
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

          <SuccessIcon colorTheme={this.displaySuccessMessage('fullScreen')}>
            <Icons height={20} icon="check" />
          </SuccessIcon>
        </Row>

        <Row>
          <Description>Toggle panel</Description>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('togglePanel')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('togglePanel')}
                onKeyDown={this.onChange}
                value={togglePanel.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>

          <SuccessIcon colorTheme={this.displaySuccessMessage('togglePanel')}>
            <Icons height={20} icon="check" />
          </SuccessIcon>
        </Row>

        <Row>
          <Description>Toggle panel position</Description>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('panelPosition')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('panelPosition')}
                onKeyDown={this.onChange}
                value={panelPosition.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>

          <SuccessIcon colorTheme={this.displaySuccessMessage('panelPosition')}>
            <Icons height={20} icon="check" />
          </SuccessIcon>
        </Row>

        <Row>
          <Description>Toggle navigation</Description>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('navigation')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('navigation')}
                onKeyDown={this.onChange}
                value={navigation.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>

          <SuccessIcon colorTheme={this.displaySuccessMessage('navigation')}>
            <Icons height={20} icon="check" />
          </SuccessIcon>
        </Row>

        <Row>
          <Description>Focus search</Description>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('search')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('search')}
                onKeyDown={this.onChange}
                value={search.value}
                error={search.error}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
          <SuccessIcon colorTheme={this.displaySuccessMessage('search')}>
            <Icons height={20} icon="check" />
          </SuccessIcon>
        </Row>

        <Row>
          <Description>Focus nav</Description>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('focusNav')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('focusNav')}
                onKeyDown={this.onChange}
                value={focusNav.value}
                error={focusNav.error}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
          <SuccessIcon colorTheme={this.displaySuccessMessage('focusNav')}>
            <Icons height={20} icon="check" />
          </SuccessIcon>
        </Row>

        <Row>
          <Description>Focus iframe</Description>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('focusIframe')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('focusIframe')}
                onKeyDown={this.onChange}
                value={focusIframe.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
          <SuccessIcon colorTheme={this.displaySuccessMessage('focusIframe')}>
            <Icons height={20} icon="check" />
          </SuccessIcon>
        </Row>

        <Row>
          <Description>Focus panel</Description>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('focusPanel')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('focusPanel')}
                onKeyDown={this.onChange}
                value={focusPanel.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
          <SuccessIcon colorTheme={this.displaySuccessMessage('focusPanel')}>
            <Icons height={20} icon="check" />
          </SuccessIcon>
        </Row>

        <Row>
          <Description>Previous component</Description>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('prevComponent')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('prevComponent')}
                onKeyDown={this.onChange}
                value={prevComponent.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
          <SuccessIcon colorTheme={this.displaySuccessMessage('prevComponent')}>
            <Icons height={20} icon="check" />
          </SuccessIcon>
        </Row>

        <Row>
          <Description>Next component</Description>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('nextComponent')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('nextComponent')}
                onKeyDown={this.onChange}
                value={nextComponent.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
          <SuccessIcon colorTheme={this.displaySuccessMessage('nextComponent')}>
            <Icons height={20} icon="check" />
          </SuccessIcon>
        </Row>

        <Row>
          <Description>Previous story</Description>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('prevStory')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('prevStory')}
                onKeyDown={this.onChange}
                value={prevStory.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
          <SuccessIcon colorTheme={this.displaySuccessMessage('prevStory')}>
            <Icons height={20} icon="cross" />
          </SuccessIcon>
        </Row>

        <Row>
          <Description>Next story</Description>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('nextStory')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('nextStory')}
                onKeyDown={this.onChange}
                value={nextStory.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
          <SuccessIcon colorTheme={this.displaySuccessMessage('nextStory')}>
            <Icons height={20} icon="check" />
          </SuccessIcon>
        </Row>

        <Row>
          <Description>Go to Shortcuts Page</Description>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('shortcutsPage')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('shortcutsPage')}
                onKeyDown={this.onChange}
                value={shortcutsPage.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>

          <SuccessIcon colorTheme={this.displaySuccessMessage('shortcutsPage')}>
            <Icons height={20} icon="check" />
          </SuccessIcon>
        </Row>

        <Row>
          <Description>Go to About Page</Description>
          <KeyInputWrapper>
            <HotKeyWrapper>
              <CenteredRow>{this.renderStateKeys('aboutPage')()}</CenteredRow>
              <TextInput
                className="modalInput"
                onBlur={this.onBlur}
                onFocus={this.onFocus('aboutPage')}
                onKeyDown={this.onChange}
                value={aboutPage.value}
              />
            </HotKeyWrapper>
          </KeyInputWrapper>
          <SuccessIcon colorTheme={this.displaySuccessMessage('aboutPage')}>
            <Icons height={20} icon="check" />
          </SuccessIcon>
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
