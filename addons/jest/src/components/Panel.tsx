import React, { Fragment } from 'react';
import { styled, withTheme } from '@storybook/theming';
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
  right: '50px',
  marginTop: '15px',
});

const SuiteTotals = styled(({ successNumber, failedNumber, result, className, width }) => (
  <div className={className}>
    <Fragment>
      {width > 325 ? (
        <div>
          {result.assertionResults.length} {result.assertionResults.length > 1 ? `tests` : `test`}
        </div>
      ) : null}
      {width > 280 ? (
        <div>
          {result.endTime - result.startTime}
          ms
        </div>
      ) : null}
    </Fragment>
  </div>
))(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.color.dark,
  fontSize: '14px',
  marginTop: '-5px',
  '& > *': {
    marginRight: 10,
  },
}));

const SuiteProgress = styled(({ successNumber, result, className }) => (
  <div className={className} role="progressbar">
    <span style={{ width: `${(successNumber / result.assertionResults.length) * 100}%` }} />
  </div>
))(({ theme }) => ({
  width: '30px',
  backgroundColor: theme.color.negative,
  height: '6px',
  top: '3px',
  position: 'absolute',
  left: 0,
  overflow: 'hidden',
  appearance: 'none',

  '& > span': {
    backgroundColor: theme.color.positive,
    bottom: 0,
    position: 'absolute',
    left: 0,
    top: 0,
  },
}));

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

const ContentWithTheme = withTheme(Content);

interface PanelProps {
  tests: null | Test[];
}

const Panel = ({ tests }: PanelProps) => (
  <ScrollArea vertical>
    {tests ? (
      <ContentWithTheme tests={tests} />
    ) : (
      <NoTests>This story has no tests configured</NoTests>
    )}
  </ScrollArea>
);

Panel.defaultProps = {
  tests: null,
};

export default provideJestResult(Panel);
