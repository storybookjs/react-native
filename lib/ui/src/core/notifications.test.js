import initNotifications from './notifications';

describe('stories API', () => {
  it('allows removing notifications', () => {
    const store = {
      getState: () => ({
        notifications: [{ id: '1' }, { id: '2' }, { id: '3' }],
      }),
      setState: jest.fn(),
    };

    const { api } = initNotifications({ store });

    api.clearNotification('2');
    expect(store.setState).toHaveBeenCalledWith({
      notifications: [{ id: '1' }, { id: '3' }],
    });
  });
});
