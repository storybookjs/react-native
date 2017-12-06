import React from 'react';
import PropTypes from 'prop-types';

import glamorous from 'glamorous';

import provideJestResult from '../hoc/provideJestResult';
import Indicator from './Indicator';
import colors from '../colors';

const Wrapper = glamorous.div({
  display: 'flex',
  alignItems: 'center',
});
const PanelName = glamorous.div({
  paddingLeft: 5,
});

const PanelTitle = ({ tests }) => {
  if (!tests) {
    return null;
  }

  const results = tests.map(report => report.result).filter(report => !!report);
  const success = results.reduce((acc, result) => acc && result.status === 'passed', true);
  const color = success ? colors.success : colors.error;

  return (
    <Wrapper>
      <Indicator color={results.length < tests.length ? colors.warning : color} size={10} />
      <PanelName>Tests</PanelName>
    </Wrapper>
  );
};

PanelTitle.defaultProps = {
  tests: null,
};

PanelTitle.propTypes = {
  tests: PropTypes.arrayOf(
    PropTypes.shape({
      result: PropTypes.object,
    })
  ),
};

export default provideJestResult(PanelTitle);
