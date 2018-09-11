import React from 'react';
import PropTypes from 'prop-types';
import { navigator } from 'global';
import styled from '@emotion/styled';

import { Route } from '../router';
import { Container, Wrapper, Title, TitleText, Footer, A } from './components';

const Command = styled.strong(
  ({ isLast, isFirst, theme }) => {
    switch (true) {
      case isFirst && isLast: {
        return {
          borderRight: '0 none',
          borderRadius: 2,
          marginRight: 0,
        };
      }
      case isFirst: {
        return {
          borderRight: theme.mainBorder,
          borderRadius: `${theme.mainBorderRadius} 0 0 ${theme.mainBorderRadius}`,
          marginRight: 0,
        };
      }
      case isLast: {
        return {
          borderRight: '0 none',
          borderRadius: `0 ${theme.mainBorderRadius} ${theme.mainBorderRadius} 0`,
          marginRight: 9,
        };
      }
      default: {
        return {
          borderRight: '0 none',
          borderRadius: 0,
          marginRight: 9,
        };
      }
    }
  },
  ({ theme }) => ({
    padding: '2px 10px',
    backgroundColor: theme.inputFill,
    color: 'inherit',
    lineHeight: '36px',
    minWidth: 50,
    display: 'inline-block',
    textAlign: 'center',
  })
);

const Table = styled.table({
  borderCollapse: 'collapse',
});

const CommandDescription = styled.span({
  fontSize: 12,
  color: 'inherit',
});

export const isMacLike = () => !!navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);

export const shortcuts = [
  // { name: 'Show Search Box', keys: ['⌘ ⇧ O', '⌃ ⇧ O'] },
  { name: 'Toggle Addon panel position', macKeys: ['⌘ ⇧ G', '⌃ ⇧ G'], keys: ['Ctrl + Shift + G'] },
  { name: 'Toggle Fullscreen Mode', macKeys: ['⌘ ⇧ F', '⌃ ⇧ F'], keys: ['Ctrl + Shift + F'] },
  { name: 'Toggle Stories Panel', macKeys: ['⌘ ⇧ X', '⌃ ⇧ X'], keys: ['Ctrl + Shift + X'] },
  { name: 'Toggle Addon panel', macKeys: ['⌘ ⇧ Z', '⌃ ⇧ Z'], keys: ['Ctrl + Shift + Z'] },
  { name: 'Next Story', macKeys: ['⌘ ⇧ →', '⌃ ⇧ →'], keys: ['Ctrl + Shift + →'] },
  { name: 'Previous Story', macKeys: ['⌘ ⇧ ←', '⌃ ⇧ ←'], keys: ['Ctrl + Shift + ←'] },
];

export const Keys = ({ shortcutKeys }) => (
  <span>
    {shortcutKeys.map((key, index, arr) => (
      <Command key={key} isLast={arr.length - 1 === index} isFirst={index === 0}>
        {key}
      </Command>
    ))}
  </span>
);

Keys.propTypes = {
  shortcutKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export const Shortcuts = ({ list }) => {
  const useMacKeys = isMacLike();
  return (
    <Container>
      <Wrapper>
        <Title>
          <TitleText>Keyboard Shortcuts</TitleText>
          {useMacKeys ? (
            <div>
              <em>Ajusted for mac-like platform</em>
            </div>
          ) : null}
        </Title>
      </Wrapper>
      <Wrapper>
        <Table>
          <tbody>
            {list.map(shortcut => (
              <tr key={shortcut.name}>
                <td>
                  <Keys shortcutKeys={useMacKeys ? shortcut.macKeys : shortcut.keys} />
                </td>
                <td>
                  <CommandDescription>{shortcut.name}</CommandDescription>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Wrapper>
      <Wrapper>
        <Footer>
          <em>
            These will be configurable/editable in the future,{' '}
            <A
              href="https://github.com/storybooks/storybook/issues/3984"
              rel="noopener noreferrer"
              target="_blank"
            >
              want to help?
            </A>
          </em>
        </Footer>
      </Wrapper>
    </Container>
  );
};
Shortcuts.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      macKeys: PropTypes.arrayOf(PropTypes.string),
      keys: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
};

const ShortcutPage = () => (
  <Route path="/settings/shortcuts">
    <Shortcuts list={shortcuts} />
  </Route>
);

export { ShortcutPage as default };
