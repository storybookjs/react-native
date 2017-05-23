import React, { Component } from 'react';

class ComponentWithRef extends Component {
  componentDidMount() {
    // Read the scroll width off the DOM element
    console.log(this.ref.scrollWidth);
  }
  render() {
    return <div ref={r => (this.ref = r)} />;
  }
}

export default ComponentWithRef;
