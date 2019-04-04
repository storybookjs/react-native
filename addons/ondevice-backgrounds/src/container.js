import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Constants from './constants';

export default class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = { background: props.initialBackground || '' };
  }

  componentDidMount() {
    const { channel } = this.props;
    channel.on(Constants.UPDATE_BACKGROUND, this.onBackgroundChange);
  }

  componentWillUnmount() {
    const { channel } = this.props;
    channel.removeListener(Constants.UPDATE_BACKGROUND, this.onBackgroundChange);
  }

  onBackgroundChange = (background) => {
    this.setState({ background });
  }

  render() {
    const { background } = this.state;
    const { children } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: background || 'transparent' }}>{children}</View>
    );
  }
}

Container.propTypes = {
  channel: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    removeListener: PropTypes.func,
  }),
  initialBackground: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Container.defaultProps = {
  channel: undefined,
  initialBackground: '',
};
