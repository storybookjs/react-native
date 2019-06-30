import React, { Component, Fragment } from 'react';
import { styled } from '@storybook/theming';
import { Icons } from '@storybook/components';
import Message from './Message';

const Wrapper = styled.div(({ theme, status }) => ({
  display: 'flex',
  width: '100%',
  borderTop: `1px solid ${theme.appBorderColor}`,
  '&:hover': {
    background: status === `failed` ? theme.background.hoverable : null,
  },
}));

const HeaderBar = styled.div(({ theme, status }) => ({
  padding: theme.layoutMargin,
  paddingLeft: theme.layoutMargin - 3,
  background: 'none',
  color: 'inherit',
  textAlign: 'left',
  cursor: status === `failed` ? 'pointer' : null,
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

const capitalizeFirstLetter = (text: string) => {
  return text
    .charAt(0)
    .toUpperCase()
    .concat(text.slice(1));
};

interface ResultProps {
  fullName?: string;
  title?: string;
  failureMessages: any;
  status: string;
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
    const { fullName, title, failureMessages, status } = this.props;
    const { open } = this.state;
    return (
      <Fragment>
        <Wrapper status={status}>
          <HeaderBar onClick={this.onToggle} role="button" status={status}>
            {status === `failed` ? (
              <Icon
                icon="chevrondown"
                size={10}
                color="#9DA5AB"
                style={{
                  transform: `rotate(${open ? 0 : -90}deg)`,
                }}
              />
            ) : null}
            <div>{capitalizeFirstLetter(fullName) || capitalizeFirstLetter(title)}</div>
          </HeaderBar>
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
