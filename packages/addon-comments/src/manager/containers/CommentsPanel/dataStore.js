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

  _addToCache(currentStory, comments) {
    const key = this._getStoryKey(currentStory);
    this.cache[key] = {
      comments,
      addedAt: Date.now(),
    };
  }

  _getFromCache(currentStory) {
    const key = this._getStoryKey(currentStory);
    const item = this.cache[key];

    if (!item) {
      return {
        comments: [],
        invalidated: false,
      };
    }

    const comments = item.comments;
    let invalidated = false;

    // invalid caches created 60 minutes ago.
    if (Date.now() - item.addedAt > 1000 * 60) {
      delete this.cache[key];
      invalidated = true;
    }

    return { comments, invalidated };
  }

  _reloadCurrentComments() {
    if (this._stopReloading) {
      clearInterval(this._stopReloading);
    }

    this._stopReloading = setInterval(
      () => {
        this._loadUsers().then(() => this._loadComments());
      },
      1000 * 60, // Reload for every minute
    );
  }

  setCurrentStory(sbKind, sbStory) {
    this.currentStory = { sbKind, sbStory };

    // We don't need to do anything if the there's no loggedIn user.
    // if (!this.user) return;

    this._reloadCurrentComments();
    const item = this._getFromCache(this.currentStory);

    if (item) {
      this._fireComments(item.comments);
      // if the cache invalidated we need to load comments again.
      if (item.invalidated) {
        return this._loadUsers().then(() => this._loadComments());
      }
      return Promise.resolve(null);
    }

    // load comments for the first time.
    // TODO: send a null and handle the loading part in the UI side.
    this.eventStore.emit('loading', true);
    this._fireComments([]);
    this._loadUsers().then(() => this._loadComments()).then(() => {
      this.eventStore.emit('loading', false);
      return Promise.resolve(null);
    });
  }

  setCurrentUser(user) {
    this.user = user;
  }

  _loadUsers() {
    const query = {};
    const options = { limit: 1e6 };
    return this.db.persister._getAppInfo().then(info => {
      if (!info) {
        return null;
      }
      return this.db.getCollection('users').get(query, options).then(users => {
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

  _loadComments() {
    const currentStory = { ...this.currentStory };
    const query = currentStory;
    const options = { limit: 1e6 };
    return this.db.persister._getAppInfo().then(info => {
      if (!info) {
        return null;
      }
      return this.db.getCollection('comments').get(query, options).then(comments => {
        // add to cache
        this._addToCache(currentStory, comments);

        // set comments only if we are on the relavant story
        if (deepEquals(currentStory, this.currentStory)) {
          this._fireComments(comments);
        }
      });
    });
  }

  _getStoryKey(currentStory) {
    return `${currentStory.sbKind}:::${currentStory.sbStory}`;
  }

  _fireComments(comments) {
    this.callbacks.forEach(callback => {
      // link user to the comment directly
      comments.forEach(comment => {
        comment.user = this.users[comment.userId];
      });

      callback(comments);
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

  _addPendingComment(comment) {
    // Add the pending comment.
    const pendingComment = { ...comment, loading: true };
    const { comments: existingComments } = this._getFromCache(this.currentStory);
    const updatedComments = existingComments.concat(pendingComment);

    this._fireComments(updatedComments);
    return Promise.resolve(null);
  }

  _setDeletedComment(commentId) {
    const { comments } = this._getFromCache(this.currentStory);
    const deleted = comments.find(c => c.id === commentId);
    if (deleted) {
      deleted.loading = true;
    }
    this._fireComments(comments);
    return Promise.resolve(null);
  }

  _addAuthorToTheDatabase() {
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
  _addCommentToDatabase(comment) {
    const doc = {
      ...comment,
      ...this.currentStory,
      sbProtected: true,
    };

    return this.db.getCollection('comments').set(doc);
  }

  _deleteCommentOnDatabase(commentId) {
    const query = { id: commentId };
    return this.db.getCollection('comments').del(query);
  }

  addComment(comment) {
    return this._addAuthorToTheDatabase()
      .then(() => this._addPendingComment(comment))
      .then(() => this._addCommentToDatabase(comment))
      .then(() => this._loadUsers())
      .then(() => this._loadComments());
  }

  deleteComment(commentId) {
    return this._setDeletedComment(commentId)
      .then(() => this._deleteCommentOnDatabase(commentId))
      .then(() => this._loadComments());
  }

  onLoading(cb) {
    this.eventStore.on('loading', cb);
    return () => {
      this.eventStore.removeListener('loading', cb);
    };
  }
}
