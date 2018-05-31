import React from 'react';
import PropTypes from 'prop-types';

import { Label, Row, Select } from './styles';

export function SelectViewport({ viewports, defaultViewport, activeViewport, onChange }) {
  return (
    <Row>
      <Label htmlFor="device">Device</Label>
      <Select id="device" value={activeViewport} onChange={onChange}>
        {Object.entries(viewports).map(([key, { name }]) => (
          <option value={key} key={key}>
            {key === defaultViewport ? `(Default) ${name}` : name}
          </option>
        ))}
      </Select>
    </Row>
  );
}

SelectViewport.propTypes = {
  onChange: PropTypes.func.isRequired,
  activeViewport: PropTypes.string.isRequired,
  viewports: PropTypes.shape({}).isRequired,
  defaultViewport: PropTypes.string.isRequired,
};
