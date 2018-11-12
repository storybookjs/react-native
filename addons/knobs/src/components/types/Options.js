import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import styled from '@emotion/styled';

import RadiosType from './Radio';
import CheckboxesType from './Checkboxes';

const OptionsSelect = styled(ReactSelect)({
  width: '100%',
  maxWidth: '300px',
  color: 'black',
});

const OptionsType = props => {
  const { knob, onChange } = props;
  const { display } = knob.optionsObj;

  if (display === 'check' || display === 'inline-check') {
    const isInline = display === 'inline-check';
    return <CheckboxesType {...props} isInline={isInline} />;
  }

  if (display === 'radio' || display === 'inline-radio') {
    const isInline = display === 'inline-radio';
    return <RadiosType {...props} isInline={isInline} />;
  }

  if (display === 'select' || display === 'multi-select') {
    const options = Object.keys(knob.options).map(key => ({
      value: knob.options[key],
      label: key,
    }));

    const isMulti = display === 'multi-select';
    const optionsIndex = options.findIndex(i => i.value === knob.value);
    let defaultValue = options[optionsIndex];
    let handleChange = e => onChange(e.value);

    if (isMulti) {
      defaultValue = options.filter(i => knob.value.includes(i.value));
      handleChange = values => onChange(values.map(item => item.value));
    }

    return (
      <OptionsSelect
        value={defaultValue}
        options={options}
        isMulti={isMulti}
        onChange={handleChange}
      />
    );
  }
  return null;
};

OptionsType.defaultProps = {
  knob: {},
  display: 'select',
  onChange: value => value,
};

OptionsType.propTypes = {
  knob: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    options: PropTypes.object,
  }),
  display: PropTypes.oneOf([
    'check',
    'inline-check',
    'radio',
    'inline-radio',
    'select',
    'multi-select',
  ]),
  onChange: PropTypes.func,
};

OptionsType.serialize = value => value;
OptionsType.deserialize = value => value;

export default OptionsType;
