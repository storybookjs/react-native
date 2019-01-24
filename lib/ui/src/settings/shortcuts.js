import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icons } from '@storybook/components';

import { eventToShortcut, shortcutToHumanString, shortcutMatchesShortcut } from '../libs/shortcut';

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

const shortcutLabels = {
  fullScreen: 'Go full screen',
  togglePanel: 'Toggle panel',
  panelPosition: 'Toggle panel position',
  navigation: 'Toggle navigation',
  toolbar: 'Toggle toolbar',
  search: 'Focus search',
  focusNav: 'Focus navigation',
  focusIframe: 'Focus iFrame',
  focusPanel: 'Focus panel',
  prevComponent: 'Previous component',
  nextComponent: 'Next component',
  prevStory: 'Previous story',
  nextStory: 'Next story',
  shortcutsPage: 'Go to shortcuts page',
  aboutPage: 'Go to about page',
};

function toShortcutState(shortcutKeys) {
  return Object.entries(shortcutKeys).reduce(
    (acc, [action, shortcut]) => ({ ...acc, [action]: { shortcut, error: false } }),
    {}
  );
}

class ShortcutsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeFeature: '',
      successField: '',
      // The initial shortcutKeys that come from props are the defaults/what was saved
      // As the user interacts with the page, the state stores the temporary, unsaved shortcuts
      // This object also includes the error attached to each shortcut
      shortcutKeys: toShortcutState(props.shortcutKeys),
    };
  }

  onKeyDown = e => {
    const { activeFeature, shortcutKeys } = this.state;

    if (e.key === 'Backspace') {
      return this.restoreDefault();
    }

    const shortcut = eventToShortcut(e);

    // Keypress is not a potential shortcut
    if (!shortcut) {
      return false;
    }

    // Check we don't match any other shortucts
    const error = !!Object.entries(shortcutKeys).find(
      ([feature, { shortcut: existingShortcut }]) =>
        feature !== activeFeature &&
        existingShortcut &&
        shortcutMatchesShortcut(shortcut, existingShortcut)
    );

    return this.setState({
      shortcutKeys: { ...shortcutKeys, [activeFeature]: { shortcut, error } },
    });
  };

  onFocus = focusedInput => () => {
    const { shortcutKeys } = this.state;

    this.setState({
      activeFeature: focusedInput,
      shortcutKeys: { ...shortcutKeys, [focusedInput]: { shortcut: null, error: false } },
    });
  };

  onBlur = async () => {
    const { shortcutKeys, activeFeature } = this.state;

    if (shortcutKeys[activeFeature]) {
      const { shortcut, error } = shortcutKeys[activeFeature];
      if (!shortcut || error) {
        return this.restoreDefault();
      }
      return this.saveShortcut();
    }
    return false;
  };

  saveShortcut = async () => {
    const { activeFeature, shortcutKeys } = this.state;

    const { setShortcut } = this.props;
    await setShortcut(activeFeature, shortcutKeys[activeFeature].shortcut);
    this.setState({ successField: activeFeature });
  };

  restoreDefaults = async () => {
    const { restoreAllDefaultShortcuts } = this.props;

    const defaultShortcuts = await restoreAllDefaultShortcuts();
    return this.setState({ shortcutKeys: toShortcutState(defaultShortcuts) });
  };

  restoreDefault = async () => {
    const { activeFeature, shortcutKeys } = this.state;

    const { restoreDefaultShortcut } = this.props;

    const defaultShortcut = await restoreDefaultShortcut(activeFeature);
    return this.setState({
      shortcutKeys: {
        ...shortcutKeys,
        ...toShortcutState({ [activeFeature]: defaultShortcut }),
      },
    });
  };

  displaySuccessMessage = activeElement => {
    const { successField, shortcutKeys } = this.state;
    return activeElement === successField && shortcutKeys[activeElement].error === false
      ? 'success'
      : '';
  };

  displayError = activeElement => {
    const { activeFeature, shortcutKeys } = this.state;
    return activeElement === activeFeature && shortcutKeys[activeElement].error === true
      ? 'error'
      : '';
  };

  renderKeyInput = () => {
    const { shortcutKeys } = this.state;
    const arr = Object.entries(shortcutKeys).map(([feature, { shortcut }]) => (
      <Row key={feature}>
        <Description>{shortcutLabels[feature]}</Description>
        <KeyInputWrapper>
          <HotKeyWrapper>
            <TextInput
              spellCheck="false"
              colorTheme={this.displayError(feature)}
              className="modalInput"
              onBlur={this.onBlur}
              onFocus={this.onFocus(feature)}
              onKeyDown={this.onKeyDown}
              value={shortcut ? shortcutToHumanString(shortcut) : ''}
              readOnly
            />
          </HotKeyWrapper>
        </KeyInputWrapper>

        <SuccessIcon colorTheme={this.displaySuccessMessage(feature)}>
          <Icons height={20} icon="check" />
        </SuccessIcon>
      </Row>
    ));

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
    );
  }
}

ShortcutsScreen.propTypes = {
  shortcutKeys: PropTypes.shape({}).isRequired, // Need TS for this
  setShortcut: PropTypes.func.isRequired,
  restoreDefaultShortcut: PropTypes.func.isRequired,
  restoreAllDefaultShortcuts: PropTypes.func.isRequired,
};

export default ShortcutsScreen;
