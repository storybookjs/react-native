import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form } from '@storybook/components';
import TypeMap from './types';

const InvalidType = () => <span>Invalid Type</span>;

export default class PropForm extends Component {
  makeChangeHandler(name, type) {
    const { onFieldChange } = this.props;
    return value => {
      const change = { name, type, value };

      onFieldChange(change);
    };
  }

  render() {
    const { knobs, onFieldClick } = this.props;

    return (
      <Form>
        {knobs.map(knob => {
          const changeHandler = this.makeChangeHandler(knob.name, knob.type);
          const InputType = TypeMap[knob.type] || InvalidType;

          return (
            <Form.Field key={knob.name} label={!knob.hideLabel && `${knob.name}`}>
              <InputType knob={knob} onChange={changeHandler} onClick={onFieldClick} />
            </Form.Field>
          );
        })}
      </Form>
    );
  }
}

PropForm.displayName = 'PropForm';

PropForm.propTypes = {
  knobs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
    })
  ).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onFieldClick: PropTypes.func.isRequired,
};
