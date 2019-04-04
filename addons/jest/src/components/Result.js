import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@storybook/theming';

import Indicator from './Indicator';
import colors from '../colors';

const Pre = styled.pre({
  margin: 0,
});

const FlexContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
});

/* eslint no-control-regex:0 */
const patterns = [/^\x08+/, /^\x1b\[[012]?K/, /^\x1b\[?[\d;]{0,3}/];

const Positive = styled.strong({
  color: colors.success,
  fontWeight: 500,
});
const Negative = styled.strong({
  color: colors.error,
  fontWeight: 500,
});
const StackTrace = styled(({ trace, className }) => (
  <details className={className}>
    <summary>Callstack</summary>
    {trace
      .join('')
      .trim()
      .split(/\n/)
      .map((traceLine, traceLineIndex) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={traceLineIndex}>{traceLine.trim()}</div>
      ))}
  </details>
))({
  background: 'silver',
  padding: 10,
  overflow: 'auto',
});
const Main = styled(({ msg, className }) => <section className={className}>{msg}</section>)({
  padding: 10,
  borderBottom: '1px solid silver',
});
const Sub = styled(({ msg, className }) => (
  <section className={className}>
    {msg
      .filter(item => typeof item !== 'string' || (typeof item === 'string' && item.trim() !== ''))
      .map((item, index, list) => {
        switch (true) {
          case typeof item === 'string' && index === 0 && index === list.length - 1: {
            return item.trim();
          }
          case typeof item === 'string' && index === 0: {
            return item.replace(/^[\s\n]*/, '');
          }
          case typeof item === 'string' && index === list.length - 1: {
            return item.replace(/[\s\n]*$/, '');
          }
          default: {
            return item;
          }
        }
        // typeof item === 'string' ? <span>{item}</span> : item;
      })}
  </section>
))({
  padding: 10,
});

const createSubgroup = (acc, item, i, list) => {
  // setup aggregators
  if (!acc.list) {
    acc.list = [];
  }
  if (!acc.grouped) {
    acc.grouped = [];
  }
  if (!('grouperIndex' in acc)) {
    acc.grouperIndex = 0;
  } else {
    acc.grouperIndex += 1;
  }

  // start or stop extraction
  if (acc.startTrigger(item)) {
    acc.mode = 'inject';
    acc.injectionPoint = i;
  }
  if (acc.endTrigger(item)) {
    acc.mode = 'stop';
  }

  // push item in correct aggregator
  if (acc.mode === 'inject') {
    acc.grouped.push(item);
  } else {
    acc.list.push(item);
  }

  // on last iteration inject at detected injectionpoint, and group
  if (i === list.length - 1) {
    // Provide a "safety net" when Jest returns a partially recognized "group"
    // (recognized by acc.startTrigger but acc.endTrigger was never found) and
    // it's the only group in output for a test result. In that case, acc.list
    // will be empty, so return whatever was found, even if it will be unstyled
    // and prevent next createSubgroup calls from throwing due to empty lists.
    acc.list.push(null);

    return acc.list.reduce((eacc, el, ei) => {
      switch (true) {
        case acc.injectionPoint === 0 && ei === 0: {
          // at index 0, inject before
          return eacc.concat(acc.grouper(acc.grouped, acc.grouperIndex)).concat(el);
        }
        case acc.injectionPoint > 0 && acc.injectionPoint === ei + 1: {
          // at index > 0, and next index WOULD BE injectionPoint, inject after
          return eacc.concat(el).concat(acc.grouper(acc.grouped, acc.grouperIndex));
        }
        default: {
          // do not inject
          return eacc.concat(el);
        }
      }
    }, []);
  }
  return acc;
};

const Message = ({ msg }) => {
  const data = patterns
    .reduce((acc, regex) => acc.replace(regex, ''), msg)
    .split(/\[2m/)
    .join('')
    .split(/\[22m/)
    .reduce((acc, item) => acc.concat(item), [])
    .map((item, li) =>
      typeof item === 'string'
        ? item
            .split(/\[32m(.*?)\[39m/)
            // eslint-disable-next-line react/no-array-index-key
            .map((i, index) => (index % 2 ? <Positive key={`p_${li}_${i}`}>{i}</Positive> : i))
        : item
    )
    .reduce((acc, item) => acc.concat(item), [])
    .map((item, li) =>
      typeof item === 'string'
        ? item
            .split(/\[31m(.*?)\[39m/)
            // eslint-disable-next-line react/no-array-index-key
            .map((i, index) => (index % 2 ? <Negative key={`n_${li}_${i}`}>{i}</Negative> : i))
        : item
    )
    .reduce((acc, item) => acc.concat(item), [])
    .reduce(createSubgroup, {
      startTrigger: e => typeof e === 'string' && e.indexOf('Error: ') === 0,
      endTrigger: e => typeof e === 'string' && e.match('Expected '),
      grouper: (list, key) => <Main key={key} msg={list} />,
    })
    .reduce(
      (acc, it) =>
        typeof it === 'string' ? acc.concat(it.split(/(at(.|\n)+\d+:\d+\))/)) : acc.concat(it),
      []
    )
    .reduce((acc, item) => acc.concat(item), [])
    .reduce(createSubgroup, {
      startTrigger: e => typeof e === 'string' && e.indexOf('Expected ') !== -1,
      endTrigger: e => typeof e === 'string' && e.match(/^at/),
      grouper: (list, key) => <Sub key={key} msg={list} />,
    })
    .reduce(createSubgroup, {
      startTrigger: e => typeof e === 'string' && e.match(/at(.|\n)+\d+:\d+\)/),
      endTrigger: () => false,
      grouper: (list, key) => <StackTrace key={key} trace={list} />,
    });

  return <Pre>{data}</Pre>;
};
Message.propTypes = {
  msg: PropTypes.string.isRequired,
};

const Head = styled.header({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
});

const Title = styled.h3({
  padding: '10px 10px 0 10px',
  margin: 0,
});

export const FailedResult = styled(({ fullName, title, status, failureMessages, className }) => (
  <div className={className}>
    <Head>
      <FlexContainer>
        <Indicator
          color={colors.error}
          size={10}
          overrides={{ borderRadius: '5px 0', position: 'absolute', top: -1, left: -1 }}
        />
        <Title>{fullName || title}</Title>
      </FlexContainer>
      <Indicator
        color={colors.error}
        size={16}
        overrides={{ borderRadius: '0 5px', position: 'absolute', top: -1, right: -1 }}
      >
        {status}
      </Indicator>
    </Head>
    {/* eslint-disable react/no-array-index-key  */}
    {failureMessages.map((msg, i) => (
      <Message msg={msg} key={i} />
    ))}
  </div>
))({
  display: 'block',
  borderRadius: 5,
  margin: 0,
  padding: 0,
  position: 'relative',
  border: '1px solid silver',
  boxSizing: 'border-box',
});

const Result = ({ fullName, title, status }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <FlexContainer>
      <Indicator color={colors.success} size={10} overrides={{ marginRight: 10 }} />
      <div>{fullName || title}</div>
    </FlexContainer>
    <FlexContainer>
      <Indicator color={colors.success} size={14} right>
        {status}
      </Indicator>
    </FlexContainer>
  </div>
);

Result.defaultProps = {
  fullName: '',
  title: '',
};

Result.propTypes = {
  fullName: PropTypes.string,
  title: PropTypes.string,
  status: PropTypes.string.isRequired,
};

export default Result;
