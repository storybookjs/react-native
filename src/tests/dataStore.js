// import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import addons from '@kadira/storybook-addons';
import DataStore from '../manager/containers/CommentsPanel/dataStore';

const { describe, it } = global;

const dbGetPromiseReturn = sinon.stub();
const dbSetPromiseReturn = sinon.stub();

const myDb = {
  getCollection() {
    return {
      get() {
        return new Promise(dbGetPromiseReturn);
      },
      set() {
        return new Promise(dbSetPromiseReturn);
      },
    };
  },
};
addons.setDatabase(myDb);

const db = addons.getDatabase();
const theStore = new DataStore(db);

describe('DataStore', () => {
  it('set current user', () => {
    theStore.setCurrentUser({
      id: 'user-id',
      name: 'user-name',
    });

    expect(theStore.user).to.deep.equal({ id: 'user-id', name: 'user-name' });
  });

  it('set current story', () => {
    theStore.setCurrentStory('Components', 'CommentList - No Comments');

    expect(dbGetPromiseReturn.callCount).to.equal(1);
    expect(theStore.currentStory).to.deep.equal({ sbKind: 'Components', sbStory: 'CommentList - No Comments' });
  });

  it('add comment', () => {
    const comment = {
      text: 'sample comment',
      time: 1476435982029,
      userId: 'user-id',
    };

    theStore.addComment(comment);

    expect(dbGetPromiseReturn.callCount).to.equal(1);
    expect(dbSetPromiseReturn.callCount).to.equal(1);
  });

  it('onComments', () => {
    theStore.onComments((comments) => {
      return comments;
    });
    expect(dbGetPromiseReturn.callCount).to.equal(1);
  });
});
