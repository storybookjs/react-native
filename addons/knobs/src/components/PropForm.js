/* eslint no-underscore-dangle: 0 */

import React from 'react';
import PropTypes from 'prop-types';

import PropField from './PropField';

const stylesheet = {
  propForm: {
    fontFamily: `
      -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",
      "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif
    `,
    display: 'table',
    boxSizing: 'border-box',
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '5px',
  },
};

export default class propForm extends React.Component {
  constructor() {
    super();
    this._onFieldChange = this.onFieldChange.bind(this);
  }

  onFieldChange(name, type, value) {
    const change = { name, type, value };
    this.props.onFieldChange(change);
  }

  render() {
    const { knobs } = this.props;

    return (
      <form style={stylesheet.propForm}>
        {knobs.map(knob => {
          // eslint-disable-next-line react/jsx-no-bind
          const changeHandler = this.onFieldChange.bind(this, knob.name, knob.type);
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
      </form>
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
