import React, { Component, Fragment } from 'react';
import { styled } from '@storybook/theming';

const patterns = [/^\x08+/, /^\x1b\[[012]?K/, /^\x1b\[?[\d;]{0,3}/];

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
  marginLeft: '35px',
  marginRight: '30px',
});

const Description = styled.div({
  paddingBottom: '10px',
  paddingTop: '10px',
  borderBottom: '1px solid rgb(226, 226, 226)',
  marginLeft: '35px',
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

  const endToken = '[39m';
  const failStartToken = '[31m';
  const passStartToken = '[32m';

  const splitDescription = msg
    .split(/\[2m/)
    .join('')
    .split(/\[22m/);

  splitDescription.forEach(element => {
    const modifiedElement: any = null;
    if (
      element.indexOf(failStartToken) > -1 &&
      element.indexOf(failStartToken) < element.indexOf(endToken)
    ) {
      elementArray = elementArray.concat(colorizeText(element, 'negative'));
    } else if (
      element.indexOf(passStartToken) > -1 &&
      element.indexOf(passStartToken) < element.indexOf(endToken)
    ) {
      elementArray = elementArray.concat(colorizeText(element, 'positive'));
    } else {
      elementArray = elementArray.concat(element);
    }
  });
  return elementArray;
};

const colorizeText: (msg: string, type: string) => MsgElement[] = (msg: string, type: string) => {
  let elementArray: MsgElement[];
  if (type === 'positive') {
    elementArray = msg
      .split(/\[32m(.*?)\[39m/)
      .map((i, index) => (index % 2 ? <Positive key={`p_${i}`}>{i}</Positive> : i));
  } else {
    elementArray = msg
      .split(/\[31m(.*?)\[39m/)
      .map((i, index) => (index % 2 ? <Negative key={`n_${i}`}>{i}</Negative> : i));
  }
  return elementArray;
};

const getTestDetail: (msg: string) => TestDetail = (msg: string) => {
  const lines = patterns
    .reduce((acc, regex) => acc.replace(regex, ''), msg)
    .split('\n')
    .filter(Boolean);

  const testDetail: TestDetail = new TestDetail();
  testDetail.description = getConvertedText(lines[0]);
  testDetail.stackTrace = '';
  testDetail.altResult = [];
  for (let i = 1; i < lines.length; i++) {
    if (
      lines[i]
        .trim()
        .toLowerCase()
        .indexOf('expected') === 0
    ) {
      testDetail.expected = getConvertedText(lines[i]);
    } else if (
      lines[i]
        .trim()
        .toLowerCase()
        .indexOf('received') === 0
    ) {
      testDetail.received = getConvertedText(lines[i]);
    } else if (
      lines[i]
        .trim()
        .toLowerCase()
        .indexOf('at') === 0
    ) {
      testDetail.stackTrace += `${lines[i].trim()}\n`;
    } else {
      testDetail.altResult = testDetail.altResult.concat(getConvertedText(lines[i]));
    }
  }
  return testDetail;
};

interface MessageProps {
  msg: string;
}

class TestDetail {
  description: MsgElement[];

  expected: MsgElement[];

  received: MsgElement[];

  altResult: MsgElement[];

  stackTrace: string;
}

export class Message extends Component<MessageProps, {}> {
  render() {
    const { msg } = this.props;
    const detail: TestDetail = getTestDetail(msg);
    console.log(detail.description);
    return (
      <Fragment>
        {detail.description ? <Description>{detail.description}</Description> : null}
        <Results>
          {detail.expected ? <div>{detail.expected}</div> : null}
          {detail.received ? <div>{detail.received}</div> : null}
          {detail.altResult ? <div>{detail.altResult}</div> : null}
        </Results>
        <StackTrace>{detail.stackTrace}</StackTrace>
      </Fragment>
    );
  }
}

export default Message;
