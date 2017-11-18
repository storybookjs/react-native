import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';

import { baseFonts } from '@storybook/components';

import Indicator from './Indicator';
import Result, { FailedResult } from './Result';
import provideJestResult from '../hoc/provideJestResult';
import colors from '../colors';

const List = glamorous.ul({
  listStyle: 'none',
  fontSize: 14,
  padding: 0,
  margin: '10px 0',
});

const Item = glamorous.li({
  display: 'block',
  margin: '10px 0',
  padding: 0,
});

const NoTests = glamorous.div({
  padding: '10px 20px',
  flex: 1,
  ...baseFonts,
});

const Content = glamorous(({ tests, className }) => (
  <div className={className}>
    {tests.map(({ name, result }) => {
      if (!result) {
        return <NoTests>This story has tests configures, but no file not found</NoTests>;
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
          <List>
            {result.assertionResults.map(res => (
              <Item key={res.fullName || res.title}>
                {res.failureMessages && res.failureMessages.length ? (
                  <FailedResult {...res} />
                ) : (
                  <Result {...res} />
                )}
              </Item>
            ))}
          </List>
        </section>
      );
    })}
  </div>
))({
  padding: '10px 20px',
  flex: '1 1 0%',
  ...baseFonts,
});

const Panel = ({ tests }) =>
  tests ? <Content tests={tests} /> : <NoTests>This story has no tests configures</NoTests>;

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
