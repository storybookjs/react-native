import { Module } from '../index';

export interface Notification {
  id: string;
  onClear?: () => void;
}

export interface SubState {
  notifications: Notification[];
}

export interface SubAPI {
  addNotification: (notification: Notification) => void;
  clearNotification: (id: string) => void;
}

export default function({ store }: Module) {
  const api = {
    addNotification: (notification: Notification) => {
      // Get rid of it if already exists
      api.clearNotification(notification.id);

      const { notifications } = store.getState();

      store.setState({ notifications: [...notifications, notification] });
    },

    clearNotification: (id: string) => {
      const { notifications } = store.getState();

      store.setState({ notifications: notifications.filter((n: Notification) => n.id !== id) });

      const notification = notifications.find((n: Notification) => n.id === id);
      if (notification && notification.onClear) {
        notification.onClear();
      }
    },
  };

  const state: SubState = { notifications: [] };

  return { api, state };
}
