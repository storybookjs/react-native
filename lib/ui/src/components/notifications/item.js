import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { Link } from '@storybook/router';
import { rgba, lighten, darken } from 'polished';

const baseStyle = ({ theme }) => ({
  display: 'block',
  padding: '16px 20px',
  borderRadius: 10,
  fontSize: theme.typography.size.s1,
  fontWeight: theme.typography.weight.bold,
  lineHeight: `16px`,
  boxShadow: '0 5px 15px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(0, 0, 0, 0.05)',
  color: theme.color.inverseText,
  backgroundColor:
    theme.base === 'light'
      ? rgba(`${darken(1, theme.background.app)}`, 0.95)
      : rgba(`${lighten(1, theme.background.app)}`, 0.95),
  textDecoration: 'none',
});

const NotificationLink = styled(Link)(baseStyle);
const Notification = styled.div(baseStyle);

export const NotificationItemSpacer = styled.div({
  height: 48,
});

export default function NotificationItem({ notification: { content, link } }) {
  return link ? (
    <NotificationLink to={link}>{content}</NotificationLink>
  ) : (
    <Notification>{content}</Notification>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    content: PropTypes.string.isRequired,
    link: PropTypes.string,
  }).isRequired,
};
