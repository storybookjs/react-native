import React from 'react';
import { linkTo } from '../';

const styles = {
  wrapper: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0, left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    color: '#333',
    outline: 'none',
    border: 'solid 1px #666',
    padding: '5px 15px',
    background: 'white',
    margin: '5px 0',
  },
};

export default class Preview extends React.Component {
  constructor(props, ...args) {
    super();
  }

  render() {
    return (
      <div style={styles.wrapper}>
        <button
          onClick={linkTo('Component 2', 'Example State 1')}
          style={styles.button}>
          goto Component 2 / Example State 1
        </button>
      </div>
    );
  }
}
