import React, { Component, PropTypes } from 'react';

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
    margin: '12px 0',
    display: 'block',
    width: '100%',
  },
}

class Item extends Component {
  static propTypes = {
    item: PropTypes.object,
    passes: PropTypes.bool,
  }

  constructor() {
    super();

    this.state = {
      open: false,
    }
  }

  onToggle = () => this.setState((prevState) => ({
    open: !prevState.open,
  }))

  render() {
    const { item, passes } = this.props;
    const { open } = this.state;

    return (
      <div style={styles.item}>
        <div
          style={styles.headerBar}
          onClick={() => this.onToggle()}
        >
          {item.description}
        </div>
        { open && (<Info item={item} />) }
        { open && (
          <Elements
            elements={item.nodes}
            passes={passes}
          />
        ) }
        { open && (<Tags tags={item.tags} />) }
      </div>
    )
  }
}

export default Item;
