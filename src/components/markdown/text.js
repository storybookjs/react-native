import React from 'react';

export class P extends React.Component {
  render() {
    const style = {
      fontFamily: 'Arimo, Helvetica, sans-serif',
      fontSize: '1rem',
      marginBottom: '1.3rem',
      color: '#444',
    };
    return <p style={style}>{this.props.children}</p>;
  }
}

export class Small extends React.Component {
  render() {
    const style = {};

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

