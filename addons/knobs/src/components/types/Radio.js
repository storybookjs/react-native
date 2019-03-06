import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

const RadiosWrapper = styled.div(({ isInline }) =>
  isInline
    ? {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        '> * + *': {
          marginLeft: 10,
        },
      }
    : {}
);

const RadioLabel = styled.label({
  padding: '3px 0 3px 5px',
  lineHeight: '18px',
  display: 'inline-block',
});

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
        <RadioLabel htmlFor={id}>{label}</RadioLabel>
      </div>
    );
  }

  render() {
    const { knob, isInline } = this.props;

    return <RadiosWrapper isInline={isInline}>{this.renderRadioButtonList(knob)}</RadiosWrapper>;
  }
}

RadiosType.defaultProps = {
  knob: {},
  onChange: value => value,
  isInline: false,
};

RadiosType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  }),
  onChange: PropTypes.func,
  isInline: PropTypes.bool,
};

RadiosType.serialize = value => value;
RadiosType.deserialize = value => value;

export default RadiosType;
