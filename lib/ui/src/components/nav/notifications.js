import styled from '@emotion/styled';

export const Notification = styled.li(
  ({ level, theme }) => {
    switch (level) {
      case 0: {
        return {
          background: theme.failColor,
        };
      }
      case 1: {
        return {
          background: theme.warnColor,
        };
      }
      default: {
        return {
          background: theme.highlightColor,
        };
      }
    }
  },
  {
    margin: 0,
    padding: 0,
    display: 'flex',
    height: 50,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',

    '& > a': {
      color: 'inherit',
      textDecoration: 'none',
    },
  }
);
export const NotificationSpacer = styled.div({
  height: 60,
});

export const Notifications = styled.ul({
  position: 'absolute',
  display: 'block',
  bottom: 0,
  margin: 0,
  padding: 0,
  width: '100%',
  zIndex: 2,
});
