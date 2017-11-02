import deepEquals from 'deep-equal';
import { EventEmitter } from 'events';

export default class DataStore {
  constructor(db) {
    this.db = db;
    this.currentStory = null;
    this.callbacks = [];
    this.cache = {};
    this.users = {};
    this.user = null;

    this.eventStore = new EventEmitter();
  }

  addToCache(currentStory, comments) {
    const key = this.getStoryKey(currentStory);
    this.cache[key] = {
      comments,
      addedAt: Date.now(),
    };
  }

  getFromCache(currentStory) {
    const key = this.getStoryKey(currentStory);
    const item = this.cache[key];

    if (!item) {
      return {
        comments: [],
        invalidated: false,
      };
    }

    const { comments } = item;
    let invalidated = false;

    // invalid caches created 60 minutes ago.
    if (Date.now() - item.addedAt > 1000 * 60) {
      delete this.cache[key];
      invalidated = true;
    }

    return { comments, invalidated };
  }

  reloadCurrentComments() {
    if (this.stopReloading) {
      clearInterval(this.stopReloading);
    }

    this.stopReloading = setInterval(
      () => {
        this.loadUsers().then(() => this.loadComments());
      },
      1000 * 60 // Reload for every minute
    );
  }

  setCurrentStory(sbKind, sbStory) {
    this.currentStory = { sbKind, sbStory };

    // We don't need to do anything if the there's no loggedIn user.
    // if (!this.user) return;

    this.reloadCurrentComments();
    const item = this.getFromCache(this.currentStory);

    if (item) {
      this.fireComments(item.comments);
      // if the cache invalidated we need to load comments again.
      if (item.invalidated) {
        return this.loadUsers().then(() => this.loadComments());
      }
      return Promise.resolve(null);
    }

    // load comments for the first time.
    // TODO: send a null and handle the loading part in the UI side.
    this.eventStore.emit('loading', true);
    this.fireComments([]);
    this.loadUsers()
      .then(() => this.loadComments())
      .then(() => {
        this.eventStore.emit('loading', false);
        return Promise.resolve(null);
      });

    return this.currentStory;
  }

  setCurrentUser(user) {
    this.user = user;
  }

  loadUsers() {
    const query = {};
    const options = { limit: 1e6 };
    return this.db.persister.getAppInfo().then(info => {
      if (!info) {
        return null;
      }
      return this.db
        .getCollection('users')
        .get(query, options)
        .then(users => {
          this.users = users.reduce((newUsers, user) => {
            const usersObj = {
              ...newUsers,
            };
            usersObj[user.id] = user;
            return usersObj;
          }, {});
        });
    });
  }

  loadComments() {
    const currentStory = { ...this.currentStory };
    const query = currentStory;
    const options = { limit: 1e6 };
    return this.db.persister.getAppInfo().then(info => {
      if (!info) {
        return null;
      }
      return this.db
        .getCollection('comments')
        .get(query, options)
        .then(comments => {
          // add to cache
          this.addToCache(currentStory, comments);

          // set comments only if we are on the relavant story
          if (deepEquals(currentStory, this.currentStory)) {
            this.fireComments(comments);
          }
        });
    });
  }

  getStoryKey(currentStory) {
    return `${currentStory.sbKind}:::${currentStory.sbStory}`;
  }

  fireComments(comments) {
    this.callbacks.forEach(callback => {
      // link user to the comment directly
      const commentsWithUser = comments.map(comment =>
        Object.assign({}, comment, { user: this.users[comment.userId] })
      );
      callback(commentsWithUser);
    });
  }

  onComments(cb) {
    this.callbacks.push(cb);
    const stop = () => {
      const index = this.callbacks.indexOf(cb);
      this.callbacks.splice(index, 1);
    };

    return stop;
  }

  addPendingComment(comment) {
    // Add the pending comment.
    const pendingComment = { ...comment, loading: true };
    const { comments: existingComments } = this.getFromCache(this.currentStory);
    const updatedComments = existingComments.concat(pendingComment);

    this.fireComments(updatedComments);
    return Promise.resolve(null);
  }

  setDeletedComment(commentId) {
    const { comments } = this.getFromCache(this.currentStory);
    const deleted = comments.find(c => c.id === commentId);
    if (deleted) {
      deleted.loading = true;
    }
    this.fireComments(comments);
    return Promise.resolve(null);
  }

  addAuthorToTheDatabase() {
    if (this.users[this.user.id]) {
      // user exists in the DB.
      return Promise.resolve(null);
    }

    // add user to the local cache
    this.users[this.user.id] = this.user;

    // add user to the actual collection
    return this.db.getCollection('users').set(this.user);
  }

  // NOTE the "sbProtected" makes sure only the author can modify
  // or delete a comment after its saved on the cloud database.
  addCommentToDatabase(comment) {
    const doc = {
      ...comment,
      ...this.currentStory,
      ...this.currentStory,
      sbProtected: true,
    };

    return this.db.getCollection('comments').set(doc);
  }

  deleteCommentOnDatabase(commentId) {
    const query = { id: commentId };
    return this.db.getCollection('comments').del(query);
  }

  addComment(comment) {
    return this.addAuthorToTheDatabase()
      .then(() => this.addPendingComment(comment))
      .then(() => this.addCommentToDatabase(comment))
      .then(() => this.loadUsers())
      .then(() => this.loadComments());
  }

  deleteComment(commentId) {
    return this.setDeletedComment(commentId)
      .then(() => this.deleteCommentOnDatabase(commentId))
      .then(() => this.loadComments());
  }

  onLoading(cb) {
    this.eventStore.on('loading', cb);
    return () => {
      this.eventStore.removeListener('loading', cb);
    };
  }
}
