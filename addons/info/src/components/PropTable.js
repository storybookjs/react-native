/* eslint-disable no-underscore-dangle */

import PropTypes from 'prop-types';
import React from 'react';

import { Table, Td, Th } from '@storybook/components';
import PropVal from './PropVal';
import PrettyPropType from './types/PrettyPropType';

export const multiLineText = input => {
  if (!input) return input;
  const text = String(input);
  const arrayOfText = text.split(/\r?\n|\r/g);
  const isSingleLine = arrayOfText.length < 2;
  return isSingleLine
    ? text
    : arrayOfText.map((
        lineOfText,
        i // note: lineOfText is the closest we will get to a unique key
      ) => (
        <span key={lineOfText}>
          {i > 0 && <br />} {lineOfText}
        </span>
      ));
};

export default function PropTable(props) {
  const {
    type,
    maxPropObjectKeys,
    maxPropArrayLength,
    maxPropStringLength,
    propDefinitions,
  } = props;

  if (!type) {
    return null;
  }

  if (!propDefinitions.length) {
    return <small>No propTypes defined!</small>;
  }

  const propValProps = {
    maxPropObjectKeys,
    maxPropArrayLength,
    maxPropStringLength,
  };

  return (
    <Table>
      <thead>
        <tr>
          <Th bordered>property</Th>
          <Th bordered>propType</Th>
          <Th bordered>required</Th>
          <Th bordered>default</Th>
          <Th bordered>description</Th>
        </tr>
      </thead>
      <tbody>
        {propDefinitions.map(row => (
          <tr key={row.property}>
            <Td bordered code>
              {row.property}
            </Td>
            <Td bordered code>
              <PrettyPropType propType={row.propType} />
            </Td>
            <Td bordered>{row.required ? 'yes' : '-'}</Td>
            <Td bordered>
              {row.defaultValue === undefined ? (
                '-'
              ) : (
                <PropVal val={row.defaultValue} {...propValProps} />
              )}
            </Td>
            <Td bordered>{multiLineText(row.description)}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

PropTable.displayName = 'PropTable';
PropTable.defaultProps = {
  type: null,
  propDefinitions: [],
};
PropTable.propTypes = {
  type: PropTypes.func,
  maxPropObjectKeys: PropTypes.number.isRequired,
  maxPropArrayLength: PropTypes.number.isRequired,
  maxPropStringLength: PropTypes.number.isRequired,
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
