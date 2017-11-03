import React from 'react';
import PropTypes from 'prop-types';
import EventEmitter from 'events';

import addons from '@storybook/addons';

const style = {
  wrapper: {
    overflow: 'scroll',
    position: 'fixed',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    transition: 'background 0.25s ease-in-out',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    background: 'transparent',
  },
};

export class BackgroundDecorator extends React.Component {
  constructor(props) {
    super(props);

    const { channel, story } = props;

    // A channel is explicitly passed in for testing
    if (channel) {
      this.channel = channel;
    } else {
      this.channel = addons.getChannel();
    }

    this.state = { background: 'transparent' };

    this.story = story();
  }

  componentWillMount() {
    this.channel.on('background', this.setBackground);
    this.channel.emit('background-set', this.props.backgrounds);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.story !== this.props.story) {
      this.story = nextProps.story();
    }
  }

  componentWillUnmount() {
    this.channel.removeListener('background', this.setBackground);
    this.channel.emit('background-unset');
  }

  setBackground = background => this.setState({ background });

  render() {
    const styles = style.wrapper;
    styles.background = this.state.background;
    return <div style={Object.assign({}, styles)}>{this.story}</div>;
  }
}
BackgroundDecorator.propTypes = {
  backgrounds: PropTypes.arrayOf(PropTypes.object),
  channel: PropTypes.instanceOf(EventEmitter),
  story: PropTypes.func.isRequired,
};
BackgroundDecorator.defaultProps = {
  backgrounds: [],
  channel: undefined,
};

export default backgrounds => story => (
  <BackgroundDecorator story={story} backgrounds={backgrounds} />
);
