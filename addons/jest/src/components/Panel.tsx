import React from 'react';
import { styled } from '@storybook/theming';
import { ScrollArea, TabsState } from '@storybook/components';
import Result from './Result';
import provideJestResult, { Test } from '../hoc/provideJestResult';

const List = styled.ul({
  listStyle: 'none',
  fontSize: 14,
  padding: 0,
  margin: 0,
});

const Item = styled.li({
  display: 'block',
  padding: 0,
});

const NoTests = styled.div({
  padding: '10px 20px',
  flex: 1,
});

const ProgressWrapper = styled.div({
  position: 'relative',
  height: '10px',
});

const FileTitle = styled.h2({
  marginRight: '6px',
  marginBottom: '3px',
  fontWeight: 500,
  fontSize: 18,
});

const SuiteHead = styled.div({
  display: 'flex',
  alignItems: 'baseline',
  position: 'absolute',
  zIndex: 2,
  right: '60px',
  marginTop: '14px',
  marginBottom: '14px',
});

const SuiteTotals = styled(({ successNumber, failedNumber, result, className }) => (
  <div className={className}>
    {successNumber > 0 && <div style={{ color: 'green' }}>{successNumber} passed</div>}
    {failedNumber > 0 && <div style={{ color: 'red' }}>{failedNumber} failed</div>}
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
  color: 'grey',
  fontSize: '10px',

  '& > *': {
    marginRight: 10,
  },
});

const SuiteProgress = styled(({ successNumber, result, className }) => (
  <div className={className} role="progressbar">
    <span style={{ width: `${(successNumber / result.assertionResults.length) * 100}%` }} />
  </div>
))(() => ({
  width: '50px',
  backgroundColor: 'red',
  height: '10px',
  top: 0,
  position: 'absolute',
  left: 0,
  overflow: 'hidden',
  appearance: 'none',
  marginTop: '1px',

  '& > span': {
    backgroundColor: 'green',
    bottom: 0,
    position: 'absolute',
    left: 0,
    top: 0,
    boxShadow: '4px 0 0 white',
  },
}));

const PassingRate = styled.div({
  fontWeight: 500,
  fontSize: '10px',
});

interface ContentProps {
  tests: Test[];
  className?: string;
}

const Content = styled(({ tests, className }: ContentProps) => (
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
            {/* <PassingRate>{`Passing rate: ${(
              (successNumber / result.assertionResults.length) *
              100
            ).toFixed(2)}%`}</PassingRate> */}
            <SuiteTotals {...{ successNumber, failedNumber, result }} />
            <ProgressWrapper>
              <SuiteProgress {...{ successNumber, failedNumber, result }} />
            </ProgressWrapper>
          </SuiteHead>
          <TabsState initial="failing-tests">
            <div id="failing-tests" title={`${failedNumber} Failing`}>
              <List>
                {result.assertionResults.map(res => {
                  if (res.status === 'failed') {
                    return (
                      <Item key={res.fullName || res.title}>
                        <Result {...res} />
                      </Item>
                    );
                  }
                })}
              </List>
            </div>
            <div id="passing-tests" title={`${successNumber} Passing`}>
              <List>
                {result.assertionResults.map(res => {
                  if (res.status === 'passed') {
                    return (
                      <Item key={res.fullName || res.title}>
                        <Result {...res} />
                      </Item>
                    );
                  }
                })}
              </List>
            </div>
          </TabsState>
        </section>
      );
    })}
  </div>
))({
  flex: '1 1 0%',
});

interface PanelProps {
  tests: null | Test[];
}

const Panel = ({ tests }: PanelProps) => (
  <ScrollArea vertical>
    {tests ? <Content tests={tests} /> : <NoTests>This story has no tests configured</NoTests>}
  </ScrollArea>
);

Panel.defaultProps = {
  tests: null,
};

export default provideJestResult(Panel);
