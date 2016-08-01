import React from 'react';
import { action } from '../';

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

  renderButton(n) {
    return (
      <button
        onClick={action(`action-${n}`)}
        style={styles.button}>
        send action {n}
      </button>
    );
  }

  render() {
    return (
      <div style={styles.wrapper}>
        {this.renderButton(1)}
        {this.renderButton(2)}
        {this.renderButton(3)}
      </div>
    );
  }
}
