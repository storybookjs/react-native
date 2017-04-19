import DataStore from './dataStore';

const user = {
  id: 'user-id',
  name: 'user-name',
};

const dbGetUsers = jest.fn(a => Promise.resolve([user]));
const dbSetUsers = jest.fn(a => Promise.resolve(a));
const dbGetComments = jest.fn(a => Promise.resolve(a));
const dbSetComments = jest.fn(a => Promise.resolve(a));

const db = {
  getCollection(namespace) {
    switch (namespace) {
      case 'users': {
        return {
          get: dbGetUsers,
          set: dbGetUsers,
        };
      }
      case 'comments': {
        return {
          get: dbGetComments,
          set: dbSetComments,
        };
      }
    }
  },
  persister: {
    _getAppInfo() {
      return Promise.resolve(true);
    },
  },
};

const theStore = new DataStore(db);

describe('DataStore', () => {
  it('set current story - when user not logged in', () => {
    theStore.setCurrentStory('Components', 'CommentList - No Comments');

    expect(theStore.currentStory).toEqual({
      sbKind: 'Components',
      sbStory: 'CommentList - No Comments',
    });
  });

  it('set current user', () => {
    theStore.setCurrentUser({
      id: 'user-id',
      name: 'user-name',
    });

    expect(theStore.user).toEqual({ id: 'user-id', name: 'user-name' });
  });

  it('set current story - when user already logged in', () => {
    theStore.setCurrentStory('Components', 'CommentList - No Comments');

    expect(theStore.currentStory).toEqual({
      sbKind: 'Components',
      sbStory: 'CommentList - No Comments',
    });
  });

  it('add comment', async () => {
    theStore.setCurrentStory('Components', 'CommentList - No Comments');
    const comment = {
      text: 'sample comment',
      time: 1476435982029,
      userId: 'user-id',
    };

    await theStore.addComment(comment);

    expect(dbGetComments).toHaveBeenCalled();
    expect(dbSetComments).toHaveBeenCalled();
  });

  it('onComments', () => {
    const callback = comments => comments;
    const stopper = theStore.onComments(callback);
    expect(theStore.callbacks).toContain(callback);

    expect(stopper).not.toThrow();
    expect(theStore.callbacks).not.toContain(callback);
  });
});
