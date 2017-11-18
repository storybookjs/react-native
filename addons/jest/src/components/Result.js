import React from 'react';
import PropTypes from 'prop-types';

import glamorous from 'glamorous';

import Indicator from './Indicator';
import colors from '../colors';

const FlexContainer = glamorous.div`
  display: flex;
  align-items: center;
`;

/* eslint no-control-regex:0 */
const patterns = [/^\x08+/, /^\x1b\[[012]?K/, /^\x1b\[?[\d;]{0,3}/];

const Positive = glamorous.strong({
  color: colors.success,
});
const Negative = glamorous.strong({
  color: colors.error,
});
const StackTrace = glamorous(({ trace, className }) => (
  <details className={className}>
    <summary>Callstack</summary>
    {trace
      .join('')
      .trim()
      .split(/\n/)
      .map(i => <div>{i.trim()}</div>)}
  </details>
))({
  background: 'silver',
});
const Main = glamorous(({ msg, className }) => <section className={className}>{msg}</section>)({
  border: '1px solid hotpink',
});
const Sub = glamorous(({ msg, className }) => (
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
            debugger; //eslint-disable-line
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
  border: '1px solid deepskyblue',
});

const createSubgroup = (acc, item, i, list) => {
  // setup aggregators
  if (!acc.list) {
    acc.list = [];
  }
  if (!acc.grouped) {
    acc.grouped = [];
  }

  // start or stop extraction
  if (acc.startTrigger(item)) {
    // debugger; //eslint-disable-line
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
    return acc.list.reduce((eacc, el, ei) => {
      switch (true) {
        case acc.injectionPoint === 0 && ei === 0: {
          // at index 0, inject before
          return eacc.concat(acc.grouper(acc.grouped)).concat(el);
        }
        case acc.injectionPoint > 0 && acc.injectionPoint === ei + 1: {
          // at index > 0, and next index WOULD BE injectionPoint, inject after
          return eacc.concat(el).concat(acc.grouper(acc.grouped));
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
    .map(
      (item, li) =>
        typeof item === 'string'
          ? item
              .split(/\[32m(.*?)\[39m/)
              // eslint-disable-next-line react/no-array-index-key
              .map((i, index) => (index % 2 ? <Positive key={`p_${li}_${i}`}>{i}</Positive> : i))
          : item
    )
    .reduce((acc, item) => acc.concat(item), [])
    .map(
      (item, li) =>
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
      grouper: list => <Main msg={list} />,
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
      grouper: list => <Sub msg={list} />,
    })
    .reduce(createSubgroup, {
      startTrigger: e => typeof e === 'string' && e.match(/at(.|\n)+\d+:\d+\)/),
      endTrigger: () => false,
      grouper: list => <StackTrace trace={list} />,
    });

  return <pre>{data}</pre>;
};
Message.propTypes = {
  msg: PropTypes.string.isRequired,
};

const Result = ({ fullName, title, status, failureMessages }) => {
  const color = status === 'passed' ? colors.success : colors.error;

  // debugger; //eslint-disable-line
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <FlexContainer>
          <Indicator color={color} size={10} />
          <div>{fullName || title}</div>
        </FlexContainer>
        <FlexContainer>
          <Indicator color={color} size={14} right>
            {status}
          </Indicator>
        </FlexContainer>
      </div>
      {/* eslint-disable react/no-array-index-key, react/no-danger  */}
      {failureMessages && failureMessages.map((msg, i) => <Message msg={msg} key={i} />)}
    </div>
  );
};

Result.defaultProps = {
  fullName: '',
  title: '',
};

Result.propTypes = {
  fullName: PropTypes.string,
  title: PropTypes.string,
  status: PropTypes.string.isRequired,
  failureMessages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Result;
