import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { linkTo } from '../src';

storiesOf('Button', module)
  .add('First Story', () => (
    <button onClick={linkTo('Button', 'Second Story')}>Go to "Second Story"</button>
  ))
  .add('Second Story', () => (
    <button onClick={linkTo('Button', 'First Story')}>Go to "First Story"</button>
  ))
  .add('Multiple Selection', () => (
    <MultipleStories
      onClick={linkTo('Button', filter => (filter === 'First' ? 'First Story' : 'Second Story'))}
    />
  ));

class MultipleStories extends Component {
  constructor(...args) {
    super(...args);
    this.onFirstClick = this.onFirstClick.bind(this);
    this.onSecondClick = this.onSecondClick.bind(this);
  }

  onFirstClick() {
    this.props.onClick('First');
  }

  onSecondClick() {
    this.props.onClick('Second');
  }

  render() {
    return (
      <ul>
        <button onClick={this.onFirstClick}>Go to "First Story"</button>
        <button onClick={this.onSecondClick}>Go to "Second Story"</button>
      </ul>
    );
  }
}

MultipleStories.propTypes = {
  onClick: PropTypes.func.isRequired,
};
