import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
  label: {
    fontSize: 11,
    padding: '5px',
  },
};

class RadioButtonsType extends Component {
  renderRadioButtonList({ options }) {
    if (Array.isArray(options)) {
      return options.map(val => this.renderRadioButton(val, val));
    }
    return Object.keys(options).map(key => this.renderRadioButton(key, options[key]));
  }

  renderRadioButton(label, value) {
    const opts = { label, value };
    const { onChange } = this.props;
    const { name } = this.props.knob;
    const id = `${name}-${opts.value}`;

    return (
      <div key={id}>
        <input
          type="radio"
          id={id}
          name={name}
          value={opts.value}
          onChange={e => onChange(e.target.value)}
          checked={value === this.props.knob.value}
        />
        <label style={styles.label} htmlFor={id}>
          {label}
        </label>
      </div>
    );
  }

  render() {
    const { knob, onChange } = this.props;

    return <div>{this.renderRadioButtonList(knob, onChange)}</div>;
  }
}

RadioButtonsType.defaultProps = {
  knob: {},
  onChange: value => value,
};

RadioButtonsType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }),
  onChange: PropTypes.func,
};

RadioButtonsType.serialize = value => value;
RadioButtonsType.deserialize = value => value;

export default RadioButtonsType;
