import PropTypes from 'prop-types';
import React, { Component } from 'react';
import addons from '@storybook/addons';
import CommentsPanel from '../../components/CommentsPanel/';
import DataStore from './dataStore';

export default class Container extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = {
      user: null,
      comments: [],
      loading: true,
    };
  }

  componentDidMount() {
    const db = addons.getDatabase();
    this.store = new DataStore(db);
    this.stopListeningToComments = this.store.onComments(comments => {
      this.setState({ comments });
    });

    // Clear the current notes on every story change.
    this.stopListeningOnStory = this.props.api.onStory((kind, story) => {
      // set the current selection
      this.store.setCurrentStory(kind, story);
    });

    this.stopListingStoreLoading = this.store.onLoading(loading => {
      this.setState({ loading });
    });

    this.init();
  }

  componentWillUnmount() {
    this.stopListeningToComments();
    this.stopListeningOnStory();
    this.stopListingStoreLoading();
  }

  getAppInfo(persister) {
    return persister
      .getAppInfo()
      .then(appInfo => Promise.resolve(appInfo), () => Promise.resolve(null));
  }

  init() {
    const db = addons.getDatabase();

    if (typeof db.persister.getUser !== 'function') {
      throw new Error('unable to get user info');
    }

    this.setState({ loading: true });
    db.persister
      .getUser()
      .then(u => Promise.resolve(u), () => Promise.resolve(null))
      .then(user => {
        if (user) {
          this.store.setCurrentUser(user);
          this.setState({ user });
        } else {
          this.setState({ user: null });
        }
        return this.getAppInfo(db.persister);
      })
      .then(appInfo => {
        const updatedState = { loading: false };
        if (!appInfo) {
          updatedState.appNotAvailable = true;
        }
        this.setState(updatedState);
      });
  }

  addComment(text) {
    const time = Date.now();
    const { user } = this.state;

    const comment = {
      text,
      time,
      userId: user.id,
    };

    this.store.addComment(comment);
  }

  deleteComment(commentId) {
    this.store.deleteComment(commentId);
  }

  render() {
    const props = {
      user: this.state.user,
      comments: this.state.comments,
      loading: this.state.loading,
      appNotAvailable: this.state.appNotAvailable,
      deleteComment: commentId => this.deleteComment(commentId),
      addComment: text => this.addComment(text),
    };

    return <CommentsPanel {...props} />;
  }
}

Container.propTypes = {
  api: PropTypes.shape({
    onStory: PropTypes.func.isRequired,
  }).isRequired,
};
