import React, { Fragment } from 'react';
import { withTheme, styled, themes, convert } from '@storybook/theming';
import { ScrollArea, TabsState, Link, Placeholder } from '@storybook/components';
import { SizeMe } from 'react-sizeme';
import Result from './Result';
import provideJestResult, { Test } from '../hoc/provideJestResult';

const PASSED_TYPE = 'passed';
const FAILED_TYPE = 'failed';

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

const ProgressWrapper = styled.div({
  position: 'relative',
  height: '10px',
  width: '30px',
  display: 'flex',
  top: '-2px',
});

const SuiteHead = styled.div({
  display: 'flex',
  alignItems: 'baseline',
  position: 'absolute',
  zIndex: 2,
  right: '20px',
  marginTop: '15px',
});

const SuiteTotals = styled(({ result, className, width }) => (
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

const SuiteProgressPortion = styled.div<{ color: any; progressPercent: number }>(
  ({ theme, color, progressPercent }) => ({
    height: '6px',
    top: '3px',
    width: `${progressPercent}%`,
    backgroundColor: color,
  })
);

interface ContentProps {
  tests: Test[];
  className?: string;
}

const getTestsByTypeMap = (result: any) => {
  const testsByType: Map<string, any> = new Map();
  result.assertionResults.forEach((assertion: any) => {
    // using switch to allow for new types to be added
    switch (assertion.status) {
      case PASSED_TYPE:
        testsByType.set(
          PASSED_TYPE,
          testsByType.get(PASSED_TYPE)
            ? testsByType.get(PASSED_TYPE).concat(assertion)
            : [assertion]
        );
        break;
      case FAILED_TYPE:
        testsByType.set(
          FAILED_TYPE,
          testsByType.get(FAILED_TYPE)
            ? testsByType.get(FAILED_TYPE).concat(assertion)
            : [assertion]
        );
        break;
      default:
        break;
    }
  });
  return testsByType;
};

const getColorByType = (type: string) => {
  // using switch to allow for new types to be added
  switch (type) {
    case PASSED_TYPE:
      return convert(themes.normal).color.positive;
    case FAILED_TYPE:
      return convert(themes.normal).color.negative;
    default:
      return null;
  }
};

const Content = styled(({ tests, className }: ContentProps) => (
  <div className={className}>
    {tests.map(({ name, result }) => {
      if (!result) {
        return (
          <Placeholder key={name}>
            This story has tests configured, but no file was found
          </Placeholder>
        );
      }

      const testsByType: Map<string, any> = getTestsByTypeMap(result);
      const entries: any = testsByType.entries();
      const sortedTestsByCount = [...entries].sort((a, b) => a[1].length - b[1].length);
      return (
        <SizeMe refreshMode="debounce" key={name}>
          {({ size }: { size: any }) => {
            const { width } = size;
            return (
              <section>
                <SuiteHead>
                  <SuiteTotals {...{ result, width }} />
                  {width > 240 ? (
                    <ProgressWrapper>
                      {sortedTestsByCount.map((entry: any) => {
                        return (
                          <SuiteProgressPortion
                            key={`progress-portion-${entry[0]}`}
                            color={getColorByType(entry[0])}
                            progressPercent={
                              (entry[1].length / result.assertionResults.length) * 100
                            }
                          />
                        );
                      })}
                    </ProgressWrapper>
                  ) : null}
                </SuiteHead>
                <TabsState initial="failing-tests" backgroundColor="rgba(0,0,0,.05)">
                  <div
                    id="failing-tests"
                    title={`${testsByType.get(FAILED_TYPE).length} Failed`}
                    color={getColorByType(FAILED_TYPE)}
                  >
                    <List>
                      {testsByType.get(FAILED_TYPE).map((res: any) => (
                        <Item key={res.fullName || res.title}>
                          <Result {...res} />
                        </Item>
                      ))}
                    </List>
                  </div>
                  <div
                    id="passing-tests"
                    title={`${testsByType.get(PASSED_TYPE).length} Passed`}
                    color={getColorByType(PASSED_TYPE)}
                  >
                    <List>
                      {testsByType.get(PASSED_TYPE).map((res: any) => (
                        <Item key={res.fullName || res.title}>
                          <Result {...res} />
                        </Item>
                      ))}
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
    {tests ? (
      <Content tests={tests} />
    ) : (
      <Placeholder>
        <Fragment>No tests found</Fragment>
        <Fragment>
          Learn how to{' '}
          <Link
            href="https://github.com/storybookjs/storybook/tree/master/addons/jest"
            target="_blank"
            withArrow
          >
            add Jest test results to your story
          </Link>
        </Fragment>
      </Placeholder>
    )}
  </ScrollArea>
);

Panel.defaultProps = {
  tests: null,
};

export default provideJestResult(Panel);
