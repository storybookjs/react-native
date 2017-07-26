import React, { Component } from 'react';

class ComponentWithRef extends Component {
  componentDidMount() {
    // Read the scroll width off the DOM element
    this.scrollWidth = this.ref.scrollWidth;
  }
  scrollWidth = 0;
  render() {
    return (
      <div
        ref={r => {
          this.ref = r;
        }}
      />
    );
  }
}

export default ComponentWithRef;
