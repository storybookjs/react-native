/* tslint:disable:object-literal-sort-keys */

import React from 'react';
import { styled } from '@storybook/theming';
import colors from '../colors';

const patterns = [/^\x08+/, /^\x1b\[[012]?K/, /^\x1b\[?[\d;]{0,3}/];

const Pre = styled.pre({
  margin: 0,
});

const Positive = styled.strong({
  color: colors.success,
  fontWeight: 500,
});
const Negative = styled.strong({
  color: colors.error,
  fontWeight: 500,
});

interface StackTraceProps {
  trace: MsgElement[];
  className?: string;
}

const StackTrace = styled(({ trace, className }: StackTraceProps) => (
  <details className={className}>
    <summary>Callstack</summary>
    {trace
      .join('')
      .trim()
      .split(/\n/)
      .map((traceLine, traceLineIndex) => (
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

interface SubProps {
  msg: MsgElement[];
  className?: string;
}

const Sub = styled(({ msg, className }: SubProps) => (
  <section className={className}>
    {msg
      .filter(item => typeof item !== 'string' || item.trim() !== '')
      .map((item, index, list) => {
        if (typeof item === 'string') {
          if (index === 0 && index === list.length - 1) {
            return item.trim();
          }
          if (index === 0) {
            return item.replace(/^[\s\n]*/, '');
          }
          if (index === list.length - 1) {
            return item.replace(/[\s\n]*$/, '');
          }
        }
        return item;
      })}
  </section>
))({
  padding: 10,
});

interface SubgroupOptions {
  startTrigger: (e: MsgElement) => boolean;
  endTrigger: (e: MsgElement) => boolean;
  grouper: (list: MsgElement[], key: number) => JSX.Element;
  accList?: MsgElement[];
  grouped?: MsgElement[];
  grouperIndex?: number;
  mode?: 'inject' | 'stop';
  injectionPoint?: number;
}

const createSubgroup = ({
  startTrigger,
  endTrigger,
  grouper,
  accList = [],
  grouped = [],
  grouperIndex = 0,
  mode,
  injectionPoint,
}: SubgroupOptions) => (acc: MsgElement[], item: MsgElement, i: number, list: MsgElement[]) => {
  grouperIndex += 1;

  // start or stop extraction
  if (startTrigger(item)) {
    mode = 'inject';
    injectionPoint = i;
  }
  if (endTrigger(item)) {
    mode = 'stop';
  }

  // push item in correct aggregator
  if (mode === 'inject') {
    grouped.push(item);
  } else {
    accList.push(item);
  }

  // on last iteration inject at detected injection point, and group
  if (i === list.length - 1) {
    // Provide a "safety net" when Jest returns a partially recognized "group"
    // (recognized by acc.startTrigger but acc.endTrigger was never found) and
    // it's the only group in output for a test result. In that case, accList
    // will be empty, so return whatever was found, even if it will be unstyled
    // and prevent next createSubgroup calls from throwing due to empty lists.
    accList.push(null);

    return accList.reduce<MsgElement[]>((eacc, el, ei) => {
      if (injectionPoint === 0 && ei === 0) {
        // at index 0, inject before
        return eacc.concat(grouper(grouped, grouperIndex)).concat(el);
      }
      if (injectionPoint > 0 && injectionPoint === ei + 1) {
        // at index > 0, and next index WOULD BE injectionPoint, inject after
        return eacc.concat(el).concat(grouper(grouped, grouperIndex));
      }
      // do not inject
      return eacc.concat(el);
    }, []);
  }
  return acc;
};

interface MessageProps {
  msg: string;
}

type MsgElement = string | JSX.Element;

const Message = ({ msg }: MessageProps) => {
  const data = patterns
    .reduce((acc, regex) => acc.replace(regex, ''), msg)
    .split(/\[2m/)
    .join('')
    .split(/\[22m/)
    .reduce((acc, item) => acc.concat(item), [] as string[])
    .map((item, li) =>
      item
        .split(/\[32m(.*?)\[39m/)
        .map((i, index) => (index % 2 ? <Positive key={`p_${li}_${i}`}>{i}</Positive> : i))
    )
    .reduce((acc, item) => acc.concat(item))
    .map((item, li) =>
      typeof item === 'string'
        ? item
            .split(/\[31m(.*?)\[39m/)
            .map((i, index) => (index % 2 ? <Negative key={`n_${li}_${i}`}>{i}</Negative> : i))
        : item
    )
    .reduce<MsgElement[]>((acc, item) => acc.concat(item), [])
    .reduce(
      createSubgroup({
        startTrigger: e => typeof e === 'string' && e.indexOf('Error: ') === 0,
        endTrigger: e => typeof e === 'string' && Boolean(e.match('Expected ')),
        grouper: (list, key) => <Main key={key} msg={list} />,
      }),
      []
    )
    .reduce(
      (acc, it) =>
        typeof it === 'string' ? acc.concat(it.split(/(at(.|\n)+\d+:\d+\))/)) : acc.concat(it),
      [] as MsgElement[]
    )
    .reduce((acc, item) => acc.concat(item), [] as MsgElement[])
    .reduce(
      createSubgroup({
        startTrigger: e => typeof e === 'string' && e.indexOf('Expected ') !== -1,
        endTrigger: e => typeof e === 'string' && Boolean(e.match(/^at/)),
        grouper: (list, key) => <Sub key={key} msg={list} />,
      }),
      []
    )
    .reduce(
      createSubgroup({
        startTrigger: e => typeof e === 'string' && Boolean(e.match(/at(.|\n)+\d+:\d+\)/)),
        endTrigger: () => false,
        grouper: (list, key) => <StackTrace key={key} trace={list} />,
      }),
      []
    );

  return <Pre>{data}</Pre>;
};

export default Message;
