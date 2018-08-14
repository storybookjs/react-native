import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
  label: {
    fontSize: 11,
    padding: '5px',
  },
  group: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
};

class RadiosType extends Component {
  renderRadioButtonList({ options }) {
    if (Array.isArray(options)) {
      return options.map(val => this.renderRadioButton(val, val));
    }
    return Object.keys(options).map(key => this.renderRadioButton(key, options[key]));
  }

  renderRadioButton(label, value) {
    const opts = { label, value };
    const { onChange, knob } = this.props;
    const { name } = knob;
    const id = `${name}-${opts.value}`;

    return (
      <div key={id}>
        <input
          type="radio"
          id={id}
          name={name}
          value={opts.value}
          onChange={e => onChange(e.target.value)}
          checked={value === knob.value}
        />
        <label style={styles.label} htmlFor={id}>
          {label}
        </label>
      </div>
    );
  }

  render() {
    const { knob } = this.props;

    return <div style={styles.group}>{this.renderRadioButtonList(knob)}</div>;
  }
}

RadiosType.defaultProps = {
  knob: {},
  onChange: value => value,
};

RadiosType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }),
  onChange: PropTypes.func,
};

RadiosType.serialize = value => value;
RadiosType.deserialize = value => value;

export default RadiosType;
