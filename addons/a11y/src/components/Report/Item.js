import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion';
import { Icons } from '@storybook/components';

import Info from './Info';
import Tags from './Tags';
import Elements from './Elements';

const Wrapper = styled('div')(({ theme }) => ({
  padding: '0 14px',
  cursor: 'pointer',
  borderBottom: theme.mainBorder,
}));

const HeaderBar = styled('button')(({ theme }) => ({
  padding: '12px 0px',
  display: 'block',
  width: '100%',
  border: 0,
  background: 'none',
  color: 'inherit',

  borderTop: '3px solid transparent',
  borderBottom: '3px solid transparent',

  '&:focus': {
    outline: '0 none',
    borderBottom: `3px solid ${theme.highlightColor}`,
  },
}));

class Item extends Component {
  static propTypes = {
    item: PropTypes.shape({
      description: PropTypes.string,
      nodes: PropTypes.array,
      tags: PropTypes.array,
    }).isRequired,
    passes: PropTypes.bool.isRequired,
  };

  state = {
    open: false,
  };

  onToggle = () =>
    this.setState(prevState => ({
      open: !prevState.open,
    }));

  render() {
    const { item, passes } = this.props;
    const { open } = this.state;

    return (
      <Wrapper>
        <HeaderBar onClick={this.onToggle}>
          <Icons.ChevronRight
            size={10}
            color="#9DA5AB"
            style={{
              marginRight: '5px',
              marginBottom: '2px',
              transform: `rotate(${open ? 90 : 0}deg)`,
              transition: 'transform 0.3s ease-in-out',
            }}
          />
          {item.description}
        </HeaderBar>
        {open && <Info item={item} />}
        {open && <Elements elements={item.nodes} passes={passes} />}
        {open && <Tags tags={item.tags} />}
      </Wrapper>
    );
  }
}

export default Item;
