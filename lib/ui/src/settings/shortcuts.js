import React, { Component } from 'react';
import { Icons, Router } from '@storybook/components';
import { setAll, setItem } from './persist';

import {
  defaultShortcutSets,
  serializableKeyboardShortcuts,
  initShortcutKeys,
  isShortcutTaken,
  labelsArr,
  mapToKeyEl,
  parseKey,
  serializedLocalStorage,
} from './utils';
import {
  A,
  Button,
  CenteredRow,
  ColWrapper,
  Container,
  Description,
  Footer,
  GridHeaderRow,
  GridWrapper,
  Heading,
  Header,
  HeaderItem,
  HotKeyWrapper,
  KeyInputWrapper,
  Main,
  Row,
  SuccessIcon,
  TextInput,
  Title,
  TitleText,
  Wrapper,
} from './components';

class ShortcutsPage extends Component {
  constructor(props) {
    super(props);
    const shortcuts = initShortcutKeys();

    this.state = {
      activeInputField: '',
      inputValue: [],
      shortcutKeys: serializedLocalStorage(shortcuts),
      successField: '',
    };
  }

  duplicateFound = () => {
    const { activeInputField, inputValue, shortcutKeys } = this.state;
    const match = Object.entries(shortcutKeys).filter(
      i => i[0] !== activeInputField && isShortcutTaken(inputValue, i[1].value)
    );

    return !!match.length;
  };

  submitKeyHandler = () => {
    const { inputValue, shortcutKeys, activeInputField } = this.state;

    if (inputValue.length === 0 || shortcutKeys[activeInputField].value.length === 0) {
      return this.restoreDefault(activeInputField);
    }
    return undefined;
  };

  handleBackspace = () => {
    const { shortcutKeys, activeInputField } = this.state;
    this.setState(state => {
      const updatedArray = state.inputValue;
      updatedArray.splice(-1);

      return {
        inputValue: updatedArray,
        shortcutKeys: {
          ...shortcutKeys,
          [activeInputField]: { value: updatedArray, error: false },
        },
      };
    });
  };

  onKeyDown = e => {
    if (e.key === 'Backspace') {
      return this.handleBackspace(e);
    }

    if (e.key === 'Enter' || e.key === 'Tab') {
      return this.submitKeyHandler();
    }
    const { shortcutKeys, activeInputField } = this.state;
    const parsedKey = parseKey(e)[0];

    return this.setState(state => {
      const lengthTooLong = [...state.inputValue, parsedKey].length > 3;
      const newValue =
        state.inputValue.length < 3 ? [...state.inputValue, parsedKey] : state.inputValue;
      return {
        inputValue: newValue,
        shortcutKeys: {
          ...shortcutKeys,
          [activeInputField]: { value: newValue, error: lengthTooLong },
        },
      };
    });
  };

  onFocus = focusedInput => () => {
    const { shortcutKeys } = this.state;

    this.setState({
      activeInputField: focusedInput,
      inputValue: [],
      shortcutKeys: { ...shortcutKeys, [focusedInput]: { value: [], error: false } },
    });
  };

  onBlur = () => {
    const { shortcutKeys, inputValue, activeInputField } = this.state;

    if (shortcutKeys[activeInputField] && shortcutKeys[activeInputField].value.length === 0) {
      return this.restoreDefault(activeInputField);
    }
    if (this.duplicateFound()) {
      return this.setState({
        shortcutKeys: { ...shortcutKeys, [activeInputField]: { value: inputValue, error: true } },
      });
    }
    return this.saveShortcut(activeInputField);
  };

  saveShortcut = () => {
    const { activeInputField, inputValue, shortcutKeys } = this.state;

    this.setState({
      successField: activeInputField,
      shortcutKeys: { ...shortcutKeys, [activeInputField]: { value: inputValue, error: false } },
    });
    return setItem('shortcutKeys', activeInputField, inputValue);
  };

  restoreDefaults = () => {
    this.setState({ shortcutKeys: serializedLocalStorage(serializableKeyboardShortcuts) });
    setAll('shortcutKeys', serializableKeyboardShortcuts);
  };

  restoreDefault = keyToReset => {
    const { shortcutKeys } = this.state;
    this.setState({
      inputValue: defaultShortcutSets[keyToReset].value,
      shortcutKeys: {
        ...shortcutKeys,
        [keyToReset]: defaultShortcutSets[keyToReset],
      },
    });
    return setItem('shortcutKeys', keyToReset, serializableKeyboardShortcuts[keyToReset]);
  };

  renderStateKeys = stateVal => () => {
    const { shortcutKeys } = this.state;
    const shortcut = shortcutKeys[stateVal];

    return mapToKeyEl(shortcut.value);
  };

  displaySuccessMessage = activeElement => {
    const { successField, shortcutKeys } = this.state;
    return activeElement === successField && shortcutKeys[activeElement].error === false
      ? 'success'
      : '';
  };

  displayError = activeElement => {
    const { activeInputField, shortcutKeys } = this.state;
    return activeElement === activeInputField && shortcutKeys[activeElement].error === true
      ? 'error'
      : '';
  };

  renderKeyInput = () => {
    const { shortcutKeys } = this.state;
    const arr = Object.entries(shortcutKeys).map(
      (shortcut, i) =>
        shortcut && (
          <Row key={`${shortcut[0]}`}>
            <Description>{`${labelsArr[i]}`}</Description>
            <KeyInputWrapper>
              <HotKeyWrapper>
                <CenteredRow>{this.renderStateKeys(shortcut[0])()}</CenteredRow>
                <TextInput
                  colorTheme={this.displayError(shortcut[0])}
                  className="modalInput"
                  onBlur={this.onBlur}
                  onFocus={this.onFocus(shortcut[0])}
                  onKeyDown={this.onKeyDown}
                  value={shortcutKeys[shortcut[0]].value}
                />
              </HotKeyWrapper>
            </KeyInputWrapper>

            <SuccessIcon colorTheme={this.displaySuccessMessage(shortcut[0])}>
              <Icons height={20} icon="check" />
            </SuccessIcon>
          </Row>
        )
    );
    return arr;
  };

  renderKeyForm = () => (
    <GridWrapper>
      <GridHeaderRow>
        <HeaderItem>Commands</HeaderItem>
        <HeaderItem>Shortcut</HeaderItem>
      </GridHeaderRow>
      {this.renderKeyInput()}
    </GridWrapper>
  );

  render() {
    const layout = this.renderKeyForm();
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
