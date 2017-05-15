import React, { Component } from 'react';
import style from './style';

export default class FullScreen extends Component {
  render() {
    return (
      <div style={style.wrapper}>
        {this.props.children}
      </div>
    );
  }
}
