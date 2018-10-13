import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text } from 'react-native';

import style from '../style';

export default class Tab extends PureComponent {
  onPressHandler = () => {
    const { onPress, id } = this.props;
    onPress(id);
  };

  render() {
    const { title } = this.props;
    return (
      <TouchableOpacity style={style.tab} onPress={this.onPressHandler}>
        <Text style={style.text}>{title}</Text>
      </TouchableOpacity>
    );
  }
}

Tab.propTypes = {
  onPress: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
