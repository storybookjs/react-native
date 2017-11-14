import React from 'react';
import PropTypes from 'prop-types';

import provideJestResult from '../hoc/provideJestResult';
import Indicator from './Indicator';
import colors from '../colors';

const PanelTitle = ({ tests }) => {
  if (!tests) {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Indicator color={colors.grey} size={10} />
        <div>Tests</div>
      </div>
    );
  }

  const results = tests.map(report => report.result).filter(report => !!report);
  const success = results.reduce((acc, result) => acc && result.status === 'passed', true);
  const color = success ? colors.success : colors.error;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Indicator color={results.length < tests.length ? colors.warning : color} size={10} />
      <div>Tests</div>
    </div>
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
