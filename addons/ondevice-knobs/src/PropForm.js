/* eslint no-underscore-dangle: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import PropField from './PropField';

export default class PropForm extends React.Component {
  makeChangeHandler(name, type) {
    return value => {
      const { onFieldChange } = this.props;
      const change = { name, type, value };
      onFieldChange(change);
    };
  }

  render() {
    const { knobs, onFieldClick } = this.props;

    return (
      <View>
        {knobs.map(knob => {
          const changeHandler = this.makeChangeHandler(knob.name, knob.type);
          return (
            <PropField
              key={knob.name}
              name={knob.name}
              type={knob.type}
              value={knob.value}
              knob={knob}
              onChange={changeHandler}
              onPress={onFieldClick}
            />
          );
        })}
      </View>
    );
  }
}

PropForm.displayName = 'PropForm';

PropForm.defaultProps = {
  knobs: [],
};

PropForm.propTypes = {
  knobs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
    })
  ),
  onFieldChange: PropTypes.func.isRequired,
  onFieldClick: PropTypes.func.isRequired,
};
