import React from 'react';
import { baseFonts } from '../theme';

export class H1 extends React.Component {
  render() {
    const styles = {
      ...baseFonts,
      borderBottom: '1px solid #eee',
      fontWeight: 600,
      margin: 0,
      padding: 0,
      fontSize: '40',
    };

    return <h1 id={this.props.id} style={styles}>{this.props.children}</h1>;
  }
}

export class H2 extends React.Component {
  render() {
    const styles = {
      ...baseFonts,
      fontWeight: 600,
      margin: 0,
      padding: 0,
      fontSize: '30',
    };

    return <h2 id={this.props.id} style={styles}>{this.props.children}</h2>;
  }
}

export class H3 extends React.Component {
  render() {
    const styles = {
      ...baseFonts,
      fontWeight: 600,
      margin: 0,
      padding: 0,
      fontSize: '22',
      textTransform: 'uppercase',
    };

    return <h3 id={this.props.id} style={styles}>{this.props.children}</h3>;
  }
}

export class H4 extends React.Component {
  render() {
    const styles = {
      ...baseFonts,
      fontWeight: 600,
      margin: 0,
      padding: 0,
      fontSize: '20',
    };

    return <h4 id={this.props.id} style={styles}>{this.props.children}</h4>;
  }
}

export class H5 extends React.Component {
  render() {
    const styles = {
      ...baseFonts,
      fontWeight: 600,
      margin: 0,
      padding: 0,
      fontSize: '18',
    };

    return <h5 id={this.props.id} style={styles}>{this.props.children}</h5>;
  }
}

export class H6 extends React.Component {
  render() {
    const styles = {
      ...baseFonts,
      fontWeight: 400,
      margin: 0,
      padding: 0,
      fontSize: '18',
    };

    return <h6 id={this.props.id} style={styles}>{this.props.children}</h6>;
  }
}
