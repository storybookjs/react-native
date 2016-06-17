import React from 'react';

export class H1 extends React.Component {
  render() {
    const styles = {
      fontFamily: 'Arimo, Helvetica, sans-serif',
      color: '#777',
      borderBottom: '2px solid #fafafa',
      marginBottom: '1.15rem',
      paddingBottom: '.5rem',
      margin: '1.414rem 0 .5rem',
      fontWeight: 'inherit',
      lineHeight: 1.42,
      textAlign: 'center',
      marginTop: 0,
      fontSize: '3.998rem',
    };

    return <h1 id={this.props.id} style={styles}>{this.props.children}</h1>;
  }
}

export class H2 extends React.Component {
  render() {
    const styles = {
      fontFamily: 'Arimo, Helvetica, sans-serif',
      borderBottom: '2px solid #fafafa',
      marginBottom: '1.15rem',
      paddingBottom: '.5rem',
      margin: '1.414rem 0 .5rem',
      fontWeight: 'inherit',
      lineHeight: 1.42,
      fontSize: '2.827rem',
    };

    return <h2 id={this.props.id} style={styles}>{this.props.children}</h2>;
  }
}

export class H3 extends React.Component {
  render() {
    const styles = {
      fontFamily: 'Arimo, Helvetica, sans-serif',
      borderBottom: '2px solid #fafafa',
      marginBottom: '1.15rem',
      paddingBottom: '.5rem',
      margin: '1.414rem 0 .5rem',
      fontWeight: 'inherit',
      lineHeight: 1.42,
      fontSize: '1.999rem',
    };

    return <h3 id={this.props.id} style={styles}>{this.props.children}</h3>;
  }
}

export class H4 extends React.Component {
  render() {
    const styles = {
      fontFamily: 'Arimo, Helvetica, sans-serif',
      color: '#444',
      margin: '1.414rem 0 .5rem',
      fontWeight: 'inherit',
      lineHeight: 1.42,
      fontSize: '1.414rem',
    };

    return <h4 id={this.props.id} style={styles}>{this.props.children}</h4>;
  }
}

export class H5 extends React.Component {
  render() {
    const styles = {
      fontFamily: 'Arimo, Helvetica, sans-serif',
      fontSize: '1.121rem',
    };

    return <h5 id={this.props.id} style={styles}>{this.props.children}</h5>;
  }
}

export class H6 extends React.Component {
  render() {
    const styles = {
      fontFamily: 'Arimo, Helvetica, sans-serif',
      fontSize: '.88rem',
    };

    return <h6 id={this.props.id} style={styles}>{this.props.children}</h6>;
  }
}
