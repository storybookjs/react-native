import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import styled from '@emotion/styled';
import { Icons } from '@storybook/components';

import Info from './Info';
import Tags from './Tags';
import Elements from './Elements';

const Wrapper = styled.div();

const HeaderBar = styled.button(({ theme }) => ({
  padding: theme.layoutMargin,
  paddingLeft: theme.layoutMargin - 3,
  display: 'flex',
  width: '100%',
  border: 0,
  background: 'none',
  color: 'inherit',

  borderLeft: '3px solid transparent',

  '&:focus': {
    outline: '0 none',
    borderLeft: `3px solid ${theme.highlightColor}`,
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
          <Icons
            icon="chevrondown"
            size={10}
            color="#9DA5AB"
            style={{
              marginRight: '10px',
              transform: `rotate(${open ? 0 : -90}deg)`,
              transition: 'transform 0.1s ease-in-out',
            }}
          />
          {item.description}
        </HeaderBar>
        {open ? (
          <Fragment>
            <Info item={item} key="info" />
            <Elements elements={item.nodes} passes={passes} key="elements" />
            <Tags tags={item.tags} key="tags" />
          </Fragment>
        ) : null}
      </Wrapper>
    );
  }
}

export default Item;
