import React from 'react';
import PropTypes from 'prop-types';

import glamorous from 'glamorous';

import Indicator from './Indicator';
import colors from '../colors';

const FlexContainer = glamorous.div`
  display: flex;
  align-items: center;
`;

const Positive = glamorous.strong({
  color: colors.success,
});
const Negative = glamorous.strong({
  color: colors.error,
});

const createSubgroup = (acc, item, i, list) => {
  // setup aggregators
  if (!acc.list) {
    acc.list = [];
  }
  if (!acc.grouped) {
    acc.grouped = [];
  }

  // start of stop extraction
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
      switch (acc.injectionPoint - 1) {
        // case -1: {
        //   return eacc.concat(acc.grouper({ children: acc.grouped })).concat(el);
        // }
        case ei: {
          // return eacc.concat(acc.grouper({ children: acc.grouped })).concat(el);
          return eacc.concat(el).concat(acc.grouper({ children: acc.grouped }));
        }
        default: {
          return eacc.concat(el);
        }
      }
      // ei === acc.injectionPoint
      //   ? eacc.concat(acc.grouper({ children: acc.grouped })).concat(el)
      //   : eacc.concat(el),
    }, []);
  }
  return acc;
};

const Message = ({ msg }) => {
  const data = msg
    .split(/\[2m/)
    .join('')
    .split(/\[22m/)
    .reduce((acc, item) => acc.concat(item), [])
    .map(
      (item, li) =>
        typeof item === 'string'
          ? item
              .split(/\[32m(.*?)\[39m/)
              .map((i, index) => (index % 2 ? <Positive key={`p_${li}_${i}`}>{i}</Positive> : i))
          : item
    )
    .reduce((acc, item) => acc.concat(item), [])
    .map(
      (item, li) =>
        typeof item === 'string'
          ? item
              .split(/\[31m(.*?)\[39m/)
              .map((i, index) => (index % 2 ? <Negative key={`n_${li}_${i}`}>{i}</Negative> : i))
          : item
    )
    .reduce((acc, item) => acc.concat(item), [])
    // trim all section of whitespace - BUGGY
    // .reduce((acc, i) => {
    //   if (typeof i === 'string') {
    //     const ii = i.trim();
    //     return ii === '' ? acc : acc.concat(ii);
    //   }
    //   return acc.concat(i);
    // }, [])
    .reduce(createSubgroup, {
      startTrigger: e => typeof e === 'string' && e.indexOf('Error: ') === 0,
      endTrigger: e => typeof e === 'string' && e.match('Expected '),
      grouper: props => <section {...props} />,
    })
    .reduce(createSubgroup, {
      startTrigger: e => typeof e === 'string' && e.match(/at(.|\n)+\d+:\d+\)/),
      endTrigger: () => false,
      grouper: props => <section {...props} />,
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
