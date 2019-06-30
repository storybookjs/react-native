import React from 'react';
import { styled, css } from '@storybook/theming';
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
  marginTop: '13px',
});

const SuiteTotals = styled(({ successNumber, failedNumber, result, className }) => (
  <div className={className}>
    <div>
      {result.assertionResults.length} {result.assertionResults.length > 1 ? `tests` : `test`}
    </div>
    <div>
      {result.endTime - result.startTime}
      ms
    </div>
    <div>{((successNumber / (failedNumber + successNumber)) * 100).toFixed(2)}%</div>
  </div>
))({
  display: 'flex',
  alignItems: 'center',
  color: '#333333',
  fontSize: '13px',

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
  backgroundColor: '#FF4400',
  height: '10px',
  top: 0,
  position: 'absolute',
  left: 0,
  overflow: 'hidden',
  appearance: 'none',
  marginTop: '1px',

  '& > span': {
    backgroundColor: '#66BF3C',
    bottom: 0,
    position: 'absolute',
    left: 0,
    top: 0,
    boxShadow: '1px 0 0 white',
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
      const passingRate = ((successNumber / result.assertionResults.length) * 100).toFixed(2);
      return (
        <section key={name}>
          <SuiteHead>
            <SuiteTotals {...{ successNumber, failedNumber, result, passingRate }} />
            <ProgressWrapper>
              <SuiteProgress {...{ successNumber, failedNumber, result }} />
            </ProgressWrapper>
          </SuiteHead>
          <TabsState initial="failing-tests" backgroundColor="rgba(0,0,0,.05)">
            <div id="failing-tests" title={`${failedNumber} Failed`} textColor="#FF4400">
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
            <div id="passing-tests" title={`${successNumber} Passed`} textColor="#66BF3C">
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
