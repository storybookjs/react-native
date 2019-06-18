import React, { Component, Fragment } from 'react';
import { styled } from '@storybook/theming';
import { Icons } from '@storybook/components';
import Message from './Message';

const Wrapper = styled.div(({ theme }) => ({
  display: 'flex',
  width: '100%',
  borderBottom: `1px solid ${theme.appBorderColor}`,
  '&:hover': {
    background: theme.background.hoverable,
  },
}));

const HeaderBar = styled.div(({ theme }) => ({
  padding: theme.layoutMargin,
  paddingLeft: theme.layoutMargin - 3,
  background: 'none',
  color: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
  borderLeft: '3px solid transparent',
  width: '100%',
  display: 'flex',

  '&:focus': {
    outline: '0 none',
    borderLeft: `3px solid ${theme.color.secondary}`,
  },
}));

const Icon = styled<any, any>(Icons)(({ theme }) => ({
  height: 10,
  width: 10,
  minWidth: 10,
  color: theme.color.mediumdark,
  marginRight: '10px',
  transition: 'transform 0.1s ease-in-out',
  alignSelf: 'center',
  display: 'inline-flex',
}));

const formatSeverityText = (severity: string) => {
  return severity
    .charAt(0)
    .toUpperCase()
    .concat(severity.slice(1));
};

interface ResultProps {
  fullName?: string;
  title?: string;
  failureMessages: any;
}

interface ResultState {
  open: boolean;
}

export class Result extends Component<ResultProps, ResultState> {
  state = {
    open: false,
  };

  onToggle = () =>
    this.setState(prevState => ({
      open: !prevState.open,
    }));

  render() {
    const { fullName, title, failureMessages } = this.props;
    const { open } = this.state;

    return (
      <Fragment>
        <Wrapper>
          {failureMessages && failureMessages.length ? (
            <HeaderBar onClick={this.onToggle} role="button">
              <Icon
                icon="chevrondown"
                size={10}
                color="#9DA5AB"
                style={{
                  transform: `rotate(${open ? 0 : -90}deg)`,
                }}
              />
              <div>{fullName || title}</div>
            </HeaderBar>
          ) : (
            <HeaderBar>
              <div>{fullName || title}</div>
            </HeaderBar>
          )}
        </Wrapper>
        {open ? (
          <Fragment>
            {failureMessages.map((msg: string, i: number) => (
              // eslint-disable-next-line react/no-array-index-key
              <Message msg={msg} key={i} />
            ))}
          </Fragment>
        ) : null}
      </Fragment>
    );
  }
}

export default Result;
