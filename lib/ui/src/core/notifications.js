export default function({ store }) {
  const api = {
    addNotification: ({ id, ...notification }) => {
      // Get rid of it if already exists
      api.clearNotification(id);

      const { notifications } = store.getState();

      store.setState({ notifications: [...notifications, { id, ...notification }] });
    },

    clearNotification: id => {
      const { notifications } = store.getState();

      store.setState({ notifications: notifications.filter(n => n.id !== id) });
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
