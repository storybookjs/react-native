import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';

import { Table as BaseTable, Td as BaseTD, Th as BaseTH } from '@storybook/components';

import PropVal from './PropVal';
import PrettyPropType from './types/PrettyPropType';

const Table = styled(BaseTable)`
  margin-top: 16px;
  width: auto;
  table-layout: auto;
]`;

const THead = styled.thead`
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const TH = styled(BaseTH)`
  line-height: 18px;
  vertical-align: middle;
  padding: 8px 16px;
]`;

const TBody = styled.tbody`
  font-size: 14px;
`;

const TBodyTR = styled.tr`
  border-bottom: 1px solid #eee;
`;

const TD = styled(BaseTD)`
  text-align: left;
  padding: 8px 16px;
`;

const TDName = styled(TD)`
  color: #774dd7;
`;

const TDType = styled(TD)`
  color: #1ea7fd;

  button {
    color: #37d5d3;
  }

  span {
    white-space: pre;
  }
`;

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
      <THead>
        <tr>
          <TH>Property</TH>
          <TH>Type</TH>
          <TH>Required</TH>
          <TH>Default</TH>
          <TH>Description</TH>
        </tr>
      </THead>
      <TBody>
        {includedPropDefinitions.map(row => (
          <TBodyTR key={row.property}>
            <TDName code>{row.property}</TDName>
            <TDType code>
              <PrettyPropType propType={row.propType} />
            </TDType>
            <TD code>{row.required ? 'yes' : '-'}</TD>
            <TD code>
              {row.defaultValue === undefined ? (
                '-'
              ) : (
                <PropVal val={row.defaultValue} {...propValProps} valueStyles={{}} />
              )}
            </TD>
            <TD>{multiLineText(row.description)}</TD>
          </TBodyTR>
        ))}
      </TBody>
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
