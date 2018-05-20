import React from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion';

import PropField from './PropField';

const Form = styled('form')({
  display: 'table',
  boxSizing: 'border-box',
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '5px',
});

export default class propForm extends React.Component {
  makeChangeHandler(name, type) {
    return value => {
      const change = { name, type, value };
      this.props.onFieldChange(change);
    };
  }

  render() {
    const { knobs } = this.props;

    return (
      <Form>
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
              onClick={this.props.onFieldClick}
            />
          );
        })}
      </Form>
    );
  }
}

propForm.displayName = 'propForm';

propForm.defaultProps = {
  knobs: [],
};

propForm.propTypes = {
  knobs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
    })
  ),
  onFieldChange: PropTypes.func.isRequired,
  onFieldClick: PropTypes.func.isRequired,
};
