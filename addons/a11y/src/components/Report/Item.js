import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Info from './Info';
import Tags from './Tags';
import Elements from './Elements';

const styles = {
  item: {
    padding: '0 14px',
    cursor: 'pointer',
    borderBottom: '1px solid rgb(234, 234, 234)',
  },
  headerBar: {
    padding: '12px 0px',
    display: 'block',
    width: '100%',
    border: 0,
    background: 'none',
  },
};

class Item extends Component {
  static propTypes = {
    item: PropTypes.shape({
      description: PropTypes.string,
      nodes: PropTypes.array,
      tags: PropTypes.array,
    }).isRequired,
    passes: PropTypes.bool.isRequired,
  };

  constructor() {
    super();

    this.state = {
      open: false,
    };
  }

  onToggle = () =>
    this.setState(prevState => ({
      open: !prevState.open,
    }));

  render() {
    const { item, passes } = this.props;
    const { open } = this.state;

    return (
      <div style={styles.item}>
        <button style={styles.headerBar} onClick={() => this.onToggle()}>
          {item.description}
        </button>
        {open && <Info item={item} />}
        {open && <Elements elements={item.nodes} passes={passes} />}
        {open && <Tags tags={item.tags} />}
      </div>
    );
  }
}

export default Item;
