import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { Link } from '@storybook/router';

const NotificationText = styled.div();

const baseStyle = ({ theme }) => ({
  display: 'block',
  padding: '16px 20px',
  borderRadius: 10,
  fontSize: `${theme.typography.size.s1}px`,
  fontWeight: `${theme.typography.weight.bold}`,
  lineHeight: `16px`,
  backgroundColor: 'rgba(50, 53, 71, 0.97)',
  boxShadow: '0 5px 15px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(0, 0, 0, 0.05)',
  color: `${theme.color.lightest}`,
  textDecoration: 'none',
});

const NotificationLink = styled(Link)(baseStyle);
const Notification = styled.div(baseStyle);

export const NotificationItemSpacer = styled.div({
  height: 48,
});

export default function NotificationItem({ notification: { content, link } }) {
  return link ? (
    <NotificationLink to={link}>
      <NotificationText>{content}</NotificationText>
    </NotificationLink>
  ) : (
    <Notification>
      <NotificationText>{content}</NotificationText>
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
