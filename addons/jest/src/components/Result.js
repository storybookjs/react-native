import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Indicator from './Indicator';
import colors from '../colors';

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Result = ({ fullName, title, status, failureMessages }) => {
  const color = status === 'passed' ? colors.success : colors.error;
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <FlexContainer>
          <Indicator color={color} size={10} />
          <div>{fullName || title}</div>
        </FlexContainer>
        <FlexContainer>
          <Indicator color={color} size={14} right>
            {status}
          </Indicator>
        </FlexContainer>
      </div>
      {/* eslint-disable react/no-array-index-key, react/no-danger  */}
      {failureMessages &&
        failureMessages.map((msg, i) => (
          <pre
            key={i}
            style={{ marginTop: 5, whiteSpace: 'pre-wrap' }}
            dangerouslySetInnerHTML={{
              __html: msg
                .replace(/\[22?m?/g, '')
                .replace(/\[31m/g, `<strong style="color: ${colors.error}">`)
                .replace(/\[32m/g, `<strong style="color: ${colors.success}">`)
                .replace(/\[39m/g, '</strong>'),
            }}
          />
        ))}
    </div>
  );
};

Result.defaultProps = {
  fullName: '',
  title: '',
};

Result.propTypes = {
  fullName: PropTypes.string,
  title: PropTypes.string,
  status: PropTypes.string.isRequired,
  failureMessages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Result;
