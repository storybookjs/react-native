import PropTypes from 'prop-types';
import React from 'react';

import PropVal from './PropVal';
import PrettyPropType from './types/PrettyPropType';

const Table = props => <table {...props} />;
const Td = props => <td style={{ paddingRight: 10, verticalAlign: 'top' }} {...props} />;
const Tr = props => <tr {...props} />;
const Th = props => <th style={{ textAlign: 'left', verticalAlign: 'top' }} {...props} />;
const Tbody = props => <tbody {...props} />;
const Thead = props => <thead {...props} />;

export const multiLineText = input => {
  if (!input) {
    return input;
  }
  const text = String(input);
  const arrayOfText = text.split(/\r?\n|\r/g);
  const isSingleLine = arrayOfText.length < 2;
  return isSingleLine
    ? text
    : arrayOfText.map((lineOfText, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <span key={`${lineOfText}.${i}`}>
          {i > 0 && <br />} {lineOfText}
        </span>
      ));
};

const determineIncludedPropTypes = (propDefinitions, excludedPropTypes) => {
  if (excludedPropTypes.length === 0) {
    return propDefinitions;
  }

  return propDefinitions.filter(
    propDefinition => !excludedPropTypes.includes(propDefinition.property)
  );
};

export default function PropTable(props) {
  const {
    type,
    maxPropObjectKeys,
    maxPropArrayLength,
    maxPropStringLength,
    propDefinitions,
    excludedPropTypes,
  } = props;

  if (!type) {
    return null;
  }

  const includedPropDefinitions = determineIncludedPropTypes(propDefinitions, excludedPropTypes);

  if (!includedPropDefinitions.length) {
    return <small>No propTypes defined!</small>;
  }

  const propValProps = {
    maxPropObjectKeys,
    maxPropArrayLength,
    maxPropStringLength,
  };

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>property</Th>
          <Th>propType</Th>
          <Th>required</Th>
          <Th>default</Th>
          <Th>description</Th>
        </Tr>
      </Thead>
      <Tbody>
        {includedPropDefinitions.map(row => (
          <Tr key={row.property}>
            <Td>{row.property}</Td>
            <Td>
              <PrettyPropType propType={row.propType} />
            </Td>
            <Td>{row.required ? 'yes' : '-'}</Td>
            <Td>
              {row.defaultValue === undefined ? (
                '-'
              ) : (
                <PropVal val={row.defaultValue} {...propValProps} valueStyles={{}} />
              )}
            </Td>
            <Td>{multiLineText(row.description)}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

PropTable.displayName = 'PropTable';
PropTable.defaultProps = {
  type: null,
  propDefinitions: [],
  excludedPropTypes: [],
};
PropTable.propTypes = {
  type: PropTypes.func,
  maxPropObjectKeys: PropTypes.number.isRequired,
  maxPropArrayLength: PropTypes.number.isRequired,
  maxPropStringLength: PropTypes.number.isRequired,
  excludedPropTypes: PropTypes.arrayOf(PropTypes.string),
  propDefinitions: PropTypes.arrayOf(
    PropTypes.shape({
      property: PropTypes.string.isRequired,
      propType: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      required: PropTypes.bool,
      description: PropTypes.string,
      defaultValue: PropTypes.any,
    })
  ),
};
