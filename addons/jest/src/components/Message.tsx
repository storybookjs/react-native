import React, { Component, Fragment } from 'react';
import { styled } from '@storybook/theming';

const patterns = [/^\x08+/, /^\x1b\[[012]?K/, /^\x1b\[?[\d;]{0,3}/];
const positiveType = 'positive';
const negativeType = 'negative';
const endToken = '[39m';
const failStartToken = '[31m';
const passStartToken = '[32m';
const stackTraceStartToken = 'at';

const StackTrace = styled.pre({
  background: '#f2f2f2',
  paddingTop: '4px',
  paddingBottom: '4px',
  paddingLeft: '6px',
  borderRadius: '2px',
  overflow: 'auto',
  margin: '10px 30px 10px 30px',
  whiteSpace: 'pre',
});

const Results = styled.div({
  paddingTop: '10px',
  marginLeft: '31px',
  marginRight: '30px',
});

const Description = styled.div({
  paddingBottom: '10px',
  paddingTop: '10px',
  borderBottom: '1px solid rgb(226, 226, 226)',
  marginLeft: '31px',
  marginRight: '30px',
  overflowWrap: 'break-word',
});

const Positive = styled.strong({
  color: '#66BF3C',
  fontWeight: 500,
});

const Negative = styled.strong({
  color: '#FF4400',
  fontWeight: 500,
});

const Main = styled(({ msg, className }) => <section className={className}>{msg}</section>)({
  padding: 5,
});

type MsgElement = string | JSX.Element;

const getConvertedText: (msg: string) => MsgElement[] = (msg: string) => {
  let elementArray: MsgElement[] = [];

  if (!msg) return elementArray;

  const splitDescription = msg
    .split(/\[2m/)
    .join('')
    .split(/\[22m/);

  splitDescription.forEach(element => {
    const modifiedElement: any = null;
    if (element && element.trim()) {
      if (
        element.indexOf(failStartToken) > -1 &&
        element.indexOf(failStartToken) < element.indexOf(endToken)
      ) {
        elementArray = elementArray.concat(colorizeText(element, negativeType));
      } else if (
        element.indexOf(passStartToken) > -1 &&
        element.indexOf(passStartToken) < element.indexOf(endToken)
      ) {
        elementArray = elementArray.concat(colorizeText(element, positiveType));
      } else {
        elementArray = elementArray.concat(element);
      }
    }
  });
  return elementArray;
};

const colorizeText: (msg: string, type: string) => MsgElement[] = (msg: string, type: string) => {
  let elementArray: MsgElement[];
  if (type === positiveType) {
    return msg
      .split(/\[32m(.*?)\[39m/)
      .map((i, index) => (index % 2 ? <Positive key={`p_${i}`}>{i}</Positive> : i));
  }
  if (type === negativeType) {
    return msg
      .split(/\[31m(.*?)\[39m/)
      .map((i, index) => (index % 2 ? <Negative key={`n_${i}`}>{i}</Negative> : i));
  }
  return [msg];
};

const getTestDetail: (msg: string) => TestDetail = (msg: string) => {
  const lines = patterns
    .reduce((acc, regex) => acc.replace(regex, ''), msg)
    .split('\n')
    .filter(Boolean);

  const testDetail: TestDetail = new TestDetail();
  testDetail.description = getConvertedText(lines[0]);
  testDetail.stackTrace = '';
  testDetail.result = [];

  for (let index = 1; index < lines.length; index++) {
    const current = lines[index];
    const next = lines[index + 1];

    if (
      current
        .trim()
        .toLowerCase()
        .indexOf(stackTraceStartToken) === 0
    ) {
      testDetail.stackTrace += `${current.trim()}\n`;
    } else if (current.trim().indexOf(':') > -1) {
      let title = null;
      let value = null;

      if (current.trim().indexOf(':') === current.length - 1) {
        // there are breaks in the middle of result
        title = current.trim();
        value = getConvertedText(next);
        index++;
      } else {
        // results come in one line
        title = current.substring(0, current.indexOf(':')).trim();
        value = getConvertedText(current.substring(current.indexOf(':'), current.length));
      }
      testDetail.result = [testDetail.result, title, ' ', value, <br key={index} />];
    } else {
      // results come in unexpected format
      testDetail.result = [testDetail.result, ' ', getConvertedText(current)];
    }
  }

  return testDetail;
};

interface MessageProps {
  msg: string;
}

class TestDetail {
  description: MsgElement[];

  result: MsgElement[];

  stackTrace: string;
}

export class Message extends Component<MessageProps, {}> {
  render() {
    const { msg } = this.props;
    const detail: TestDetail = getTestDetail(msg);

    return (
      <Fragment>
        {detail.description ? <Description>{detail.description}</Description> : null}
        <Results>{detail.result ? <div>{detail.result}</div> : null}</Results>
        <StackTrace>{detail.stackTrace}</StackTrace>
      </Fragment>
    );
  }
}

export default Message;
