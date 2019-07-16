import React, { Fragment } from 'react';
import { styled } from '@storybook/theming';
import { ScrollArea, TabsState } from '@storybook/components';
import { SizeMe } from 'react-sizeme';
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

const SuiteHead = styled.div({
  display: 'flex',
  alignItems: 'baseline',
  position: 'absolute',
  zIndex: 2,
  right: '60px',
  marginTop: '15px',
});

const SuiteTotals = styled(({ successNumber, failedNumber, result, className, width }) => (
  <div className={className}>
    {width > 400 ? (
      <Fragment>
        <div>
          {result.assertionResults.length} {result.assertionResults.length > 1 ? `tests` : `test`}
        </div>
        <div>
          {result.endTime - result.startTime}
          ms
        </div>
      </Fragment>
    ) : null}
    {width > 280 ? (
      <Fragment>
        <div>{((successNumber / (failedNumber + successNumber)) * 100).toFixed(2)}%</div>
      </Fragment>
    ) : null}
  </div>
))({
  display: 'flex',
  alignItems: 'center',
  color: '#666666',
  fontSize: '14px',
  marginTop: '-5px',
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

  '& > span': {
    backgroundColor: '#66BF3C',
    bottom: 0,
    position: 'absolute',
    left: 0,
    top: 0,
    boxShadow: '1px 0 0 white',
  },
}));

interface ContentProps {
  tests: Test[];
  className?: string;
}

// @ts-ignore
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
        <SizeMe refreshMode="debounce">
          {({ size }: { size: any }) => {
            const { width } = size;
            return (
              <section key={name}>
                <SuiteHead>
                  <SuiteTotals {...{ successNumber, failedNumber, result, passingRate, width }} />
                  {width > 240 ? (
                    <ProgressWrapper>
                      <SuiteProgress {...{ successNumber, failedNumber, result }} />
                    </ProgressWrapper>
                  ) : null}
                </SuiteHead>
                <TabsState initial="failing-tests" backgroundColor="rgba(0,0,0,.05)">
                  <div id="failing-tests" title={`${failedNumber} Failed`} color="#FF4400">
                    <List>
                      {result.assertionResults.map(res => {
                        return res.status === 'failed' ? (
                          <Item key={res.fullName || res.title}>
                            <Result {...res} />
                          </Item>
                        ) : null;
                      })}
                    </List>
                  </div>
                  <div id="passing-tests" title={`${successNumber} Passed`} color="#66BF3C">
                    <List>
                      {result.assertionResults.map(res => {
                        return res.status === 'passed' ? (
                          <Item key={res.fullName || res.title}>
                            <Result {...res} />
                          </Item>
                        ) : null;
                      })}
                    </List>
                  </div>
                </TabsState>
              </section>
            );
          }}
        </SizeMe>
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
