/* eslint-disable no-underscore-dangle */

import PropTypes from 'prop-types';
import React from 'react';
import PropVal from './PropVal';

const PropTypesMap = new Map();
for (const typeName in PropTypes) { // eslint-disable-line
  if (!PropTypes.hasOwnProperty(typeName)) { // eslint-disable-line
    continue; // eslint-disable-line
  }
  const type = PropTypes[typeName];
  PropTypesMap.set(type, typeName);
  PropTypesMap.set(type.isRequired, typeName);
}

const stylesheet = {
  propTable: {
    marginLeft: -10,
    borderSpacing: '10px 5px',
    borderCollapse: 'separate',
  },
};

export default class PropTable extends React.Component {
  render() {
    const type = this.props.type;

    if (!type) {
      return null;
    }

    const props = {};

    if (type.propTypes) {
      for (const property in type.propTypes) { // eslint-disable-line
        if (!type.propTypes.hasOwnProperty(property)) { // eslint-disable-line
          continue; // eslint-disable-line
        }
        const typeInfo = type.propTypes[property];
        const propType = PropTypesMap.get(typeInfo) || 'other';
        const required = typeInfo.isRequired === undefined ? 'yes' : 'no';
        const description = type.__docgenInfo &&
          type.__docgenInfo.props &&
          type.__docgenInfo.props[property]
          ? type.__docgenInfo.props[property].description
          : null; // eslint-disable-line no-underscore-dangle

        props[property] = { property, propType, required, description };
      }
    }

    if (type.defaultProps) {
      for (const property in type.defaultProps) { // eslint-disable-line
        if (!type.defaultProps.hasOwnProperty(property)) { // eslint-disable-line
          continue; // eslint-disable-line
        }
        const value = type.defaultProps[property];
        if (value === undefined) {
          continue; // eslint-disable-line
        }
        if (!props[property]) {
          props[property] = { property };
        }
        props[property].defaultValue = value;
      }
    }

    const array = Object.values(props);
    if (!array.length) {
      return <small>No propTypes defined!</small>;
    }
    array.sort((a, b) => a.property > b.property);

    return (
      <table style={stylesheet.propTable}>
        <thead>
          <tr>
            <th>property</th>
            <th>propType</th>
            <th>required</th>
            <th>default</th>
            <th>description</th>
          </tr>
        </thead>
        <tbody>
          {array.map(row => (
            <tr key={row.property}>
              <td>{row.property}</td>
              <td>{row.propType}</td>
              <td>{row.required}</td>
              <td>{row.defaultValue === undefined ? '-' : <PropVal val={row.defaultValue} />}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

PropTable.displayName = 'PropTable';
PropTable.defaultProps = {
  type: null,
};
PropTable.propTypes = {
  type: PropTypes.func,
};
