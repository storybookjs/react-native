import React from 'react';
import { baseFonts } from '../theme';

export class P extends React.Component {
  render() {
    const style = {
      ...baseFonts,
      fontSize: 15,
    };
    return <p style={style}>{this.props.children}</p>;
  }
}

export class LI extends React.Component {
  render() {
    const style = {
      ...baseFonts,
      fontSize: 15,
    };
    return <li style={style}>{this.props.children}</li>;
  }
}

export class UL extends React.Component {
  render() {
    const style = {
      ...baseFonts,
      fontSize: 15,
    };

    return <ul style={style}>{this.props.children}</ul>;
  }
}

export class A extends React.Component {
  render() {
    const style = {
      color: '#3498db',
    };

    return <a href={this.props.href} style={style}>{this.props.children}</a>;
  }
}
