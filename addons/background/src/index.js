import React from 'react';
import { polyfill } from 'react-lifecycles-compat';
import PropTypes from 'prop-types';

import addons from '@storybook/addons';

export class BackgroundDecorator extends React.Component {
  constructor(props) {
    super(props);

    const { channel } = props;

    // A channel is explicitly passed in for testing
    if (channel) {
      this.channel = channel;
    } else {
      this.channel = addons.getChannel();
    }

    this.state = {};
  }

  componentDidMount() {
    this.channel.emit('background-set', this.props.backgrounds);
  }

  componentWillUnmount() {
    this.channel.emit('background-unset');
  }

  render() {
    return this.state.story;
  }
}

BackgroundDecorator.getDerivedStateFromProps = ({ story }, { prevStory }) => {
  if (story !== prevStory) {
    return {
      story: story(),
      prevStory: story,
    };
  }
  return null;
};

BackgroundDecorator.propTypes = {
  backgrounds: PropTypes.arrayOf(PropTypes.object),
  channel: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    removeListener: PropTypes.func,
  }),
  // eslint-disable-next-line react/no-unused-prop-types
  story: PropTypes.func.isRequired,
};

BackgroundDecorator.defaultProps = {
  backgrounds: [],
  channel: undefined,
};

polyfill(BackgroundDecorator);

export default backgrounds => story => (
  <BackgroundDecorator story={story} backgrounds={backgrounds} />
);
