import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { Link } from '@storybook/router';

const levelStyle = ({ level, theme }) => {
  switch (level) {
    case 0: {
      return {
        background: theme.color.negative,
      };
    }
    case 1: {
      return {
        background: theme.color.danger,
      };
    }
    default: {
      return {
        background: theme.color.secondary,
      };
    }
  }
};

const baseStyle = {
  padding: '5px 10px',
  display: 'flex',
  margin: 10,
  alignItems: 'center',
  justifyContent: 'center',
  height: 48,
  borderRadius: 10,
  backgroundColor: 'rgba(50, 53, 71, 0.97)',
  boxShadow: '0 5px 15px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(0, 0, 0, 0.05)',
  color: 'white',
  textDecoration: 'none',
  userSelect: 'none',
};

const NotificationLink = styled(Link)(levelStyle, baseStyle);
const Notification = styled.div(levelStyle, baseStyle);

const NotificationText = styled.span({ flex: 1 });
const NotificationIcon = styled.span({ width: 20 });

export const NotificationItemSpacer = styled.div({
  height: 60,
});

export default function NotificationItem({ notification: { icon, content, level, link } }) {
  return link ? (
    <NotificationLink to={link} level={level}>
      {icon ? (
        <Fragment>
          <NotificationIcon>{icon}</NotificationIcon>
          <NotificationText>{content}</NotificationText>
        </Fragment>
      ) : (
        <NotificationText>{content}</NotificationText>
      )}
    </NotificationLink>
  ) : (
    <Notification level={level}>
      {icon ? (
        <Fragment>
          <NotificationIcon>{icon}</NotificationIcon>
          <NotificationText>{content}</NotificationText>
        </Fragment>
      ) : (
        <NotificationText>{content}</NotificationText>
      )}
    </Notification>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    icon: PropTypes.string,
    content: PropTypes.string.isRequired,
    level: PropTypes.oneOf([1, 2, 3]).isRequired,
    link: PropTypes.string,
  }).isRequired,
};
