import global from 'global';

export const createSubscriptionsStore = () => {
  const subscripions = new Map();

  return {
    register(subscribe) {
      let subscription = subscripions.get(subscribe);
      if (!subscription) {
        subscription = {
          unsubscribe: subscribe(),
        };
        subscripions.set(subscribe, subscription);
      }
      subscription.used = true;
    },

    markAllAsUnused() {
      subscripions.forEach(subscription => {
        // eslint-disable-next-line no-param-reassign
        subscription.used = false;
      });
    },

    clearUnused() {
      subscripions.forEach((subscripion, key) => {
        if (subscripion.used) return;

        subscripion.unsubscribe();
        subscripions.delete(key);
      });
    },
  };
};

// Enforce global singleton
const KEY = '__STORYBOOK_SUBSCRIPTIONS';
if (!global[KEY]) {
  global[KEY] = createSubscriptionsStore();
}
export default global[KEY];
