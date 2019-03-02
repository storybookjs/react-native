import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { ScrollArea } from '@storybook/components';

import Indicator from './Indicator';
import Result, { FailedResult } from './Result';
import provideJestResult from '../hoc/provideJestResult';
import colors from '../colors';

const List = styled.ul({
  listStyle: 'none',
  fontSize: 14,
  padding: 0,
  margin: '10px 0',
});

const Item = styled.li({
  display: 'block',
  margin: '10px 0',
  padding: 0,
});

const NoTests = styled.div({
  padding: '10px 20px',
  flex: 1,
});

const FileTitle = styled.h2({
  margin: 0,
  fontWeight: 500,
  fontSize: 18,
});

const SuiteHead = styled.div({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  position: 'relative',
  paddingTop: 10,
});

const SuiteTotals = styled(({ successNumber, failedNumber, result, className }) => (
  <div className={className}>
    {successNumber > 0 && <div style={{ color: colors.success }}>{successNumber} passed</div>}
    {failedNumber > 0 && <div style={{ color: colors.error }}>{failedNumber} failed</div>}
    <div>{result.assertionResults.length} total</div>
    <div>
      <strong>
        {result.endTime - result.startTime}
        ms
      </strong>
    </div>
  </div>
))({
  display: 'flex',
  alignItems: 'center',
  color: colors.grey,
  fontSize: '10px',

  '& > *': {
    marginLeft: 10,
  },
});

const SuiteProgress = styled(({ successNumber, result, className }) => (
  <div className={className} role="progressbar">
    <span style={{ width: `${(successNumber / result.assertionResults.length) * 100}%` }}>
      {`${(successNumber / result.assertionResults.length) * 100}%`}
    </span>
  </div>
))(() => ({
  width: '100%',
  backgroundColor: colors.error,
  height: 4,
  top: 0,
  position: 'absolute',
  left: 0,
  borderRadius: 3,
  overflow: 'hidden',
  appearance: 'none',

  '& > span': {
    backgroundColor: colors.success,
    bottom: 0,
    position: 'absolute',
    left: 0,
    top: 0,
    boxShadow: '4px 0 0 white',
  },
}));

const SuiteTitle = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const Content = styled(({ tests, className }) => (
  <div className={className}>
    {tests.map(({ name, result }) => {
      if (!result) {
        return <NoTests key={name}>This story has tests configured, but no file was found</NoTests>;
      }

      const successNumber = result.assertionResults.filter(({ status }) => status === 'passed')
        .length;
      const failedNumber = result.assertionResults.length - successNumber;

      return (
        <section key={name}>
          <SuiteHead>
            <SuiteTitle>
              <Indicator
                color={result.status === 'passed' ? colors.success : colors.error}
                size={16}
                styles={{ marginRight: 5 }}
              >
                {result.status}
              </Indicator>
              <FileTitle>{name}</FileTitle>
            </SuiteTitle>
            <SuiteTotals {...{ successNumber, failedNumber, result }} />
            <SuiteProgress {...{ successNumber, failedNumber, result }} />
          </SuiteHead>
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
});

const Panel = ({ tests }) => (
  <ScrollArea vertical>
    {tests ? <Content tests={tests} /> : <NoTests>This story has no tests configured</NoTests>}
  </ScrollArea>
);

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
