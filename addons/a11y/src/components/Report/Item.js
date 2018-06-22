import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion';

import Info from './Info';
import Tags from './Tags';
import Elements from './Elements';

const Wrapper = styled('div')({
  padding: '0 14px',
  cursor: 'pointer',
  borderBottom: '1px solid rgb(234, 234, 234)',
});

const HeaderBar = styled('button')({
  padding: '12px 0px',
  display: 'block',
  width: '100%',
  border: 0,
  background: 'none',
});

const Arrow = styled('span')(props => ({
  display: 'inline-block',
  width: 0,
  height: 0,
  borderStyle: 'solid',
  borderWidth: '5px 0 5px 8.7px',
  borderColor: 'transparent transparent transparent #828282',
  paddingRight: 5,
  transformOrigin: '25% 50%',
  transform: `rotate(${props.open ? 90 : 0}deg)`,
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
          <Arrow open={open} />
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
