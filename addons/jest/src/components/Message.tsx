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

const getConvertedText: (msg: string) => any = (msg: string) => {
  const endToken = '[39m';
  const failStartToken = '[31m';
  const passStartToken = '[32m';

  const splitDescription = msg
    .split(/\[2m/)
    .join('')
    .split(/\[22m/);

  let text = '';
  splitDescription.forEach(element => {
    const modifiedElement = null;
    if (
      element.indexOf(failStartToken) > -1 &&
      element.indexOf(failStartToken) < element.indexOf(endToken)
    ) {
      text += element
        .split(failStartToken)
        .join('')
        .split(endToken)
        .join('');
    } else if (
      element.indexOf(passStartToken) > -1 &&
      element.indexOf(passStartToken) < element.indexOf(endToken)
    ) {
      text += element
        .split(passStartToken)
        .join('')
        .split(endToken)
        .join('');
    } else {
      text += element;
    }
  });
  return text;
};

interface MessageProps {
  msg: string;
}

export class Message extends Component<MessageProps, {}> {
  render() {
    const { msg } = this.props;

    let expected = null;
    let received = null;
    let stackTrace = '';
    const lines = patterns
      .reduce((acc, regex) => acc.replace(regex, ''), msg)
      .split('\n')
      .filter(Boolean);
    const description = getConvertedText(lines[0]);

    for (let i = 1; i < lines.length; i++) {
      if (
        lines[i]
          .trim()
          .toLowerCase()
          .indexOf('expected') === 0
      ) {
        expected = getConvertedText(lines[i]);
      } else if (
        lines[i]
          .trim()
          .toLowerCase()
          .indexOf('received') === 0
      ) {
        received = getConvertedText(lines[i]);
      } else if (
        lines[i]
          .trim()
          .toLowerCase()
          .indexOf('at') === 0
      ) {
        stackTrace += getConvertedText(lines[i]);
        stackTrace += i != lines.length ? '\n' : '';
      }
    }

    return (
      <Fragment>
        <Description>{description}</Description>
        <Results>
          <div>{expected}</div>
          <div>{received}</div>
        </Results>
        <StackTrace>{stackTrace}</StackTrace>
      </Fragment>
    );
  }
}

export default Message;
