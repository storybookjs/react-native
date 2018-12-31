import { logger } from '@storybook/client-logger';

export default function({ store }) {
  const api = {
    clearNotification: id => {
      const { notifications } = store.getState();

      const newNotifications = notifications.filter(n => n.id !== id);
      if (newNotifications.length === notifications.length) {
        logger.error(`Trying to unset notification ${id} that does not exist`);
        return;
      }

      store.setState({ notifications: newNotifications });
    },
  };

  // For the minute, hard code a new update as an initial notification.
  // Soon we will need to actually check this on init and add it.
  const state = {
    notifications: [
      {
        id: 'update',
        level: 2,
        link: '/settings/about',
        icon: '🎉',
        content: `There's a new version available: 4.0.0`,
      },
    ],
  };

  return { api, state };
}
