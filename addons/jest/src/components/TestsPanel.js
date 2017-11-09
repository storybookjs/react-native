import React from 'react';

import Indicator from './Indicator';
import provideTests from '../hoc/provideTests';
import colors from '../colors';

const TestsPanel = ({ tests }) => {
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
                  <div style={{ color: colors.success }}>
                    {successNumber} passed
                  </div>
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
            <ul style={{ listStyle: 'none', fontSize: 14 }}>
              {result.assertionResults.map(({ fullName, status, failureMessages }) => {
                const color = status === 'passed' ? colors.success : colors.error;
                return (
                  <li key={fullName}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Indicator color={color} size={10} />
                        <div>{fullName}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Indicator color={color} size={14} right>
                          {status}
                        </Indicator>
                      </div>
                    </div>
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
                              .replace(/\[39m/g, `</strong>`),
                          }}
                        />
                      ))}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
};

export default provideTests(TestsPanel);
