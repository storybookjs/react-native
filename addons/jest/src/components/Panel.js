import React from 'react';
import PropTypes from 'prop-types';

import Indicator from './Indicator';
import Result from './Result';
import provideJestResult from '../hoc/provideJestResult';
import colors from '../colors';

const Panel = ({ tests }) => {
  const style = {
    padding: '10px 20px',
    flex: 1,
  };

  if (!tests) {
    return (
      <div className="markdown-body" style={style}>
        <p>No tests added.</p>
      </div>
    );
  }

  return (
    <div className="markdown-body" style={style}>
      {tests.map(({ name, result }) => {
        if (!result) {
          return (
            <section key={name}>
              <header style={{ display: 'flex', alignItems: 'center' }}>
                <h2 style={{ display: 'flex', alignItems: 'center' }}>
                  <div>{name}</div>
                  <Indicator color={colors.warning} size={16} right>
                    File not found
                  </Indicator>
                </h2>
              </header>
            </section>
          );
        }

        const successNumber = result.assertionResults.filter(({ status }) => status === 'passed')
          .length;
        const failedNumber = result.assertionResults.length - successNumber;

        return (
          <section key={name}>
            <h2
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>{name}</div>
                <Indicator
                  color={result.status === 'passed' ? colors.success : colors.error}
                  size={16}
                  right
                >
                  {result.status}
                </Indicator>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: colors.grey,
                  fontSize: '.5em',
                }}
              >
                {successNumber > 0 && (
                  <div style={{ color: colors.success }}>{successNumber} passed</div>
                )}
                {failedNumber > 0 && (
                  <div style={{ marginLeft: 10, color: colors.error }}>{failedNumber} failed</div>
                )}
                <div style={{ marginLeft: 10 }}>{result.assertionResults.length} total</div>
                <div style={{ marginLeft: 20 }}>{result.endTime - result.startTime}ms</div>
              </div>

              <div
                style={{
                  width: '100%',
                  backgroundColor: colors.error,
                  height: 4,
                  bottom: -2,
                  position: 'absolute',
                  left: 0,
                }}
              >
                <div
                  style={{
                    width: `${successNumber / result.assertionResults.length * 100}%`,
                    backgroundColor: colors.success,
                    height: '100%',
                    bottom: -2,
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    boxShadow: '4px 0 0 white',
                  }}
                />
              </div>
            </h2>
            <ul style={{ listStyle: 'none', fontSize: 14, padding: 0, margin: 0 }}>
              {result.assertionResults.map(res => (
                <li key={res.fullName || res.title}>
                  <Result {...res} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
};

Panel.defaultProps = {
  tests: null,
};

Panel.propTypes = {
  tests: PropTypes.arrayOf(
    PropTypes.shape({
      result: PropTypes.object,
    })
  ),
};

export default provideJestResult(Panel);
