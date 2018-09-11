import { localStorage } from 'global';
import React, { Children, PureComponent, cloneElement } from 'react';
// import { PropTypes } from 'prop-types';
import styled from '@emotion/styled';
import debounce from 'lodash.debounce';

import Split from 'react-split-pane';

const splitStore = {
  get({ id, split }) {
    try {
      return localStorage.getItem(`storybook-split-${id}-${split}`).split(',');
    } catch (e) {
      console.error(e);
      return false;
    }
  },
  set: debounce(({ id, split, changes }) => {
    try {
      localStorage.setItem(`storybook-split-${id}-${split}`, changes.join(','));
    } catch (e) {
      console.error(e);
    }
  }, 2000),
};

class SplitObserver extends PureComponent {
  constructor(props) {
    super(props);
    const { id, split } = props;
    this.state = {
      sizes: splitStore.get({ id, split }) || [],
    };
  }

  render() {
    const { id, children, split, onChange, show, ...props } = this.props;
    const { sizes } = this.state;

    const list = Children.toArray(children);

    return show && show.length < 2 ? (
      list[show[0]]
    ) : (
      <Split
        split={split}
        resizerSize={10}
        onChange={changes => {
          splitStore.set({ id, split, changes });
          this.setState({ sizes: changes });
          if (onChange) {
            onChange(changes);
          }
        }}
        {...props}
      >
        {list.map((child, index) =>
          cloneElement(child, sizes[index] ? { size: sizes[index] } : {})
        )}
      </Split>
    );
  }
}

const MemSplit = styled(SplitObserver)(({ theme }) => ({
  position: 'relative',
  '& > *': {
    position: 'relative',
  },
  // themeing the resizer is kinda a pain
  '& > [data-type="Resizer"]': {
    borderLeft: ' 0 none',
    borderRight: ' 0 none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    transition: 'none',
    opacity: 1,
    background: 'none',
    color: theme.mainBorderColor,
    '&:hover': {
      borderLeft: ' 0 none',
      borderRight: ' 0 none',
      borderTop: ' 0 none',
      borderBottom: ' 0 none',
      margin: 0,
      color: theme.highlightColor,
    },
    '&[data-attribute="horizontal"]:after': {
      content: '""',
      display: 'block',
      height: '2px',
      width: theme.layoutMargin * 2,
      borderTop: theme.mainBorder,
      borderBottom: theme.mainBorder,
      borderColor: 'currentColor',
    },
    '&[data-attribute="vertical"]:after': {
      content: '""',
      display: 'block',
      width: '2px',
      height: theme.layoutMargin * 2,
      borderLeft: theme.mainBorder,
      borderRight: theme.mainBorder,
      borderColor: 'currentColor',
    },
  },
}));

export { MemSplit as default };
