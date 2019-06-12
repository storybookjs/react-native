export const createSubscriptionsStore = () => {
  const subscriptions = new Map();

  return {
    register(subscribe: () => void): void {
      let subscription = subscriptions.get(subscribe);
      if (!subscription) {
        subscription = {
          unsubscribe: subscribe(),
        };
        subscriptions.set(subscribe, subscription);
      }
      subscription.used = true;
    },

    markAllAsUnused(): void {
      subscriptions.forEach(subscription => {
        // eslint-disable-next-line no-param-reassign
        subscription.used = false;
      });
    },

    clearUnused(): void {
      subscriptions.forEach((subscription, key) => {
        if (subscription.used) return;

        subscription.unsubscribe();
        subscriptions.delete(key);
      });
    },
  };
};

export default createSubscriptionsStore();
