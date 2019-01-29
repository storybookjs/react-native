import { Module } from '../index';

export interface Notification {
  id: string;
  onClear?: () => void;
}

interface SubState {
  notifications: Notification[];
}

export default function({ store }: Module) {
  const api = {
    addNotification: ({ id, ...notification }: Notification) => {
      // Get rid of it if already exists
      api.clearNotification(id);

      const { notifications } = store.getState();

      store.setState({ notifications: [...notifications, { id, ...notification }] });
    },

    clearNotification: (id: string) => {
      const { notifications } = store.getState();

      store.setState({ notifications: notifications.filter(n => n.id !== id) });

      const notification = notifications.find(n => n.id === id);
      if (notification && notification.onClear) {
        notification.onClear();
      }
    },
  };

  const state: SubState = { notifications: [] };

  return { api, state };
}
