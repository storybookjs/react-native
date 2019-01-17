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

  const state = { notifications: [] };

  return { api, state };
}
