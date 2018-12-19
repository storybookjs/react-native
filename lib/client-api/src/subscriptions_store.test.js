import { createSubscriptionsStore } from './subscriptions_store';

const mockSubscription = () => {
  let listening = false;
  const listener = jest.fn();

  return {
    listener,
    subscribe() {
      listening = true;
      return () => {
        listening = false;
      };
    },
    trigger(value) {
      if (listening) {
        listener(value);
      }
    },
  };
};

describe('preview.subscriptions_store', () => {
  describe('register', () => {
    it('should register a subscription', () => {
      const { listener, subscribe, trigger } = mockSubscription();
      const store = createSubscriptionsStore();

      trigger('foo');
      store.register(subscribe);
      trigger('bar');

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('bar');
    });

    it("shouldn't subscribe when subscription is already registered", () => {
      const subscribe = jest.fn();
      const store = createSubscriptionsStore();

      store.register(subscribe);
      store.register(subscribe);

      expect(subscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearUnused', () => {
    it('should stop unused subscriptions', () => {
      const { listener, subscribe, trigger } = mockSubscription();
      const store = createSubscriptionsStore();

      store.register(subscribe);
      store.markAllAsUnused();
      store.clearUnused();

      trigger();

      expect(listener).not.toHaveBeenCalled();
    });

    it("shouldn't stop used subscriptions", () => {
      const { listener, subscribe, trigger } = mockSubscription();
      const store = createSubscriptionsStore();

      store.register(subscribe);
      store.markAllAsUnused();
      store.register(subscribe);
      store.clearUnused();

      trigger();

      expect(listener).toHaveBeenCalled();
    });

    it('should subscribe again after unsubscribing', () => {
      const { listener, subscribe, trigger } = mockSubscription();
      const store = createSubscriptionsStore();

      store.register(subscribe);
      store.markAllAsUnused();
      store.clearUnused();

      trigger('foo');
      store.register(subscribe);
      trigger('bar');

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('bar');
    });
  });
});
