import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { styled, keyframes } from '@storybook/theming';
import { opacify } from 'polished';
import { GlobalHotKeys } from 'react-hotkeys';

import { Button, IconButton, Icons, Tabs } from '@storybook/components';
import SettingsFooter from './SettingsFooter';

import { eventToShortcut, shortcutToHumanString, shortcutMatchesShortcut } from '../libs/shortcut';

const Header = styled.header(({ theme }) => ({
  marginBottom: 20,
  fontSize: `${theme.typography.size.m3}px`,
  fontWeight: theme.typography.weight.black,
  alignItems: 'center',
  display: 'flex',
}));

// Grid
export const HeaderItem = styled.div(({ theme }) => ({
  fontWeight: theme.typography.weight.bold,
}));

export const GridHeaderRow = styled.div({
  alignSelf: 'flex-end',
  display: 'grid',
  margin: '10px 0',
  gridTemplateColumns: '1fr 1fr 15px',
  '& > *:last-of-type': {
    gridColumn: '2 / 2',
    justifySelf: 'flex-end',
    gridRow: '1',
  },
});

export const Row = styled.div(({ theme }) => ({
  padding: '6px 0',
  borderTop: `1px solid ${theme.mainBorderColor}`,
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 0px',
}));

export const GridWrapper = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridAutoRows: 'minmax(auto, auto)',
  marginBottom: '20px',

  fontSize: `${theme.typography.size.s2}px`,
}));

// Form

export const Description = styled.div({
  alignSelf: 'center',
});

export const KeyInputWrapper = styled.div({
  position: 'relative',
  display: 'flex',
  width: 80,
  flexDirection: 'column',
  justifySelf: 'flex-end',
});

export const TextInput = styled.input(
  ({ colorTheme, theme }) =>
    colorTheme === 'error'
      ? {
          boxShadow: `${theme.color.negative} 0 0 0 1px inset !important`,
          animation: `${theme.animation.jiggle} 700ms ease-out`,
        }
      : {},
  ({ theme }) => ({
    transition: 'all 150ms ease-out',
    color: theme.color.darkest,
    fontSize: `${theme.typography.size.s1}px`,
    lineHeight: '20px',
    paddingTop: '4px',
    paddingBottom: '4px',

    border: 'none',
    borderRadius: 2,

    background: 'transparent',
    textAlign: 'center',

    '::placeholder': {
      color: theme.color.mediumdark,
    },

    boxShadow: `${theme.mainBorderColor} 0 0 0 1px inset`,

    '&:hover': {
      boxShadow: `${opacify(0.1, theme.mainBorderColor)} 0 0 0 1px inset`,
    },

    '&:focus': {
      outline: 'none',
      boxShadow: `${theme.color.secondary} 0 0 0 1px inset`,
    },
  })
);

export const Fade = keyframes`
0%,100% { opacity: 0; }
  50% { opacity: 1; }
`;

export const SuccessIcon = styled(Icons)(
  ({ colorTheme, theme }) =>
    colorTheme === 'success'
      ? {
          color: theme.color.positive,
          animation: `${Fade} 2s ease forwards`,
        }
      : {
          opacity: 0,
        },
  {
    alignSelf: 'center',
    display: 'flex',
    marginLeft: 10,
    height: 14,
    width: 14,
  }
);

const Container = styled.div({
  padding: `3rem 20px`,
  maxWidth: 600,
  margin: '0 auto',
});

const shortcutLabels = {
  fullScreen: 'Go full screen',
  togglePanel: 'Toggle addons',
  panelPosition: 'Toggle addons orientation',
  toggleNav: 'Toggle sidebar',
  toolbar: 'Toggle canvas toolbar',
  search: 'Focus search',
  focusNav: 'Focus sidebar',
  focusIframe: 'Focus canvas',
  focusPanel: 'Focus addons',
  prevComponent: 'Previous component',
  nextComponent: 'Next component',
  prevStory: 'Previous story',
  nextStory: 'Next story',
  shortcutsPage: 'Go to shortcuts page',
  aboutPage: 'Go to about page',
};

// Shortcuts that cannot be configured
const fixedShortcuts = ['escape'];

function toShortcutState(shortcutKeys) {
  return Object.entries(shortcutKeys).reduce(
    (acc, [feature, shortcut]) =>
      fixedShortcuts.includes(feature) ? acc : { ...acc, [feature]: { shortcut, error: false } },
    {}
  );
}

const keyMap = {
  CLOSE: 'escape',
};

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
          <TextInput
            spellCheck="false"
            colorTheme={this.displayError(feature)}
            className="modalInput"
            onBlur={this.onBlur}
            onFocus={this.onFocus(feature)}
            onKeyDown={this.onKeyDown}
            value={shortcut ? shortcutToHumanString(shortcut) : ''}
            placeholder="Type keys"
            readOnly
          />
        </KeyInputWrapper>

        <SuccessIcon colorTheme={this.displaySuccessMessage(feature)} icon="check" />
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
    const { onClose } = this.props;
    const layout = this.renderKeyForm();
    return (
      <GlobalHotKeys handlers={{ CLOSE: onClose }} keyMap={keyMap}>
        <Tabs
          absolute
          selected="shortcuts"
          actions={{ onSelect: () => {} }}
          tools={
            <Fragment>
              <IconButton
                onClick={e => {
                  e.preventDefault();
                  return onClose();
                }}
              >
                <Icons icon="close" />
              </IconButton>
            </Fragment>
          }
        >
          <div id="shortcuts" title="Keyboard Shortcuts">
            <Container>
              <Header>Keyboard shortcuts</Header>

              {layout}
              <Button tertiary small id="restoreDefaultsHotkeys" onClick={this.restoreDefaults}>
                Restore defaults
              </Button>

              <SettingsFooter />
            </Container>
          </div>
        </Tabs>
      </GlobalHotKeys>
    );
  }
}

ShortcutsScreen.propTypes = {
  shortcutKeys: PropTypes.shape({}).isRequired, // Need TS for this
  setShortcut: PropTypes.func.isRequired,
  restoreDefaultShortcut: PropTypes.func.isRequired,
  restoreAllDefaultShortcuts: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ShortcutsScreen;
