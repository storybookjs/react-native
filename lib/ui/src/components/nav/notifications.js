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
    padding: 0,
    display: 'flex',
    margin: 20,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 10,
    backgroundColor: 'rgba(50, 53, 71, 0.97)',
    boxShadow: '0 5px 15px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(0, 0, 0, 0.05)',
    color: 'white',

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
