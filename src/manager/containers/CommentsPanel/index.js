import React, { Component } from 'react';
import addons from '@kadira/storybook-addons';
import CommentsPanel from '../../components/CommentsPanel/';

export default class Container extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = {
      user: null,
      users: [],
      comments: [],
      loading: true,
    };
    // bind functions so it can be passed later
    this.addComment = this.addComment.bind(this);
    this.syncDatabase = this.syncDatabase.bind(this);
  }

  componentDidMount() {
    // Clear the current notes on every story change.
    this.stopListeningOnStory = this.props.api.onStory((kind, story) => {
      this.selection = { sbKind: kind, sbStory: story };
      Promise.resolve(null)
        .then(() => this.syncDatabase())
        .then(() => this.getCurrentUser())
        .then(() => this.setState({ loading: false }));
    });
  }

  componentWillUnmount() {
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }
  }

  getCurrentUser() {
    // NOTE getUser method is not a standard method
    // as a matter of fact, the persister itself is
    // not meant to be used directly. We are bad!
    const db = addons.getDatabase();
    if (typeof db.persister.getUser === 'function') {
      return db.persister.getUser()
        .then(user => this.setState({ user }));
    }
    return new Promise((resolve, reject) => {
      reject(new Error('unable to get user info'));
    });
  }

  loadUsersCollection() {
    const db = addons.getDatabase();
    const query = {};
    const options = {limit: 1e6};
    return db.getCollection('users').get(query, options)
      .then(users => this.setState({ users }));
  }

  loadCommentsCollection() {
    const db = addons.getDatabase();
    const query = { ...this.selection };
    const options = {limit: 1e6};
    return db.getCollection('comments').get(query, options)
      .then(comments => this.setState({ comments }));
  }

  addPendingComment(_comment) {
    const comment = Object.assign({}, _comment, { loading: true });
    const comments = this.state.comments.concat(comment);
    this.setState({ comments });
    return Promise.resolve(null);
  }

  ensureAuthorExists() {
    if (this.state.users.find(u => u.id === this.state.user.id)) {
      return Promise.resolve(null);
    }
    const db = addons.getDatabase();
    return db.getCollection('users').set(this.state.user);
  }

  addCommentToDatabase(comment) {
    const db = addons.getDatabase();
    const doc = { ...comment, ...this.selection };
    return db.getCollection('comments').set(doc);
  }

  syncDatabase() {
    return Promise.resolve(null)
      .then(() => this.loadUsersCollection())
      .then(() => this.loadCommentsCollection())
      .catch(err => console.error('failed to sync data:', err));
  }

  addComment(comment) {
    return Promise.resolve(null)
      .then(() => this.addPendingComment(comment))
      .then(() => this.ensureAuthorExists())
      .then(() => this.addCommentToDatabase(comment))
      .then(() => this.syncDatabase());
  }

  render() {
    const props = {
      user: this.state.user,
      users: this.state.users,
      comments: this.state.comments,
      loading: this.state.loading,
      loggedIn: this.state.loggedIn,
      addComment: this.addComment,
    };
    return <CommentsPanel {...props} />;
  }
}
