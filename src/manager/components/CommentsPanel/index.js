/* eslint no-undef: 0 */

import React, { Component } from 'react';
import CommentList from '../CommentList';
import CommentForm from '../CommentForm';
import style from './style';

export default class CommentsPanel extends Component {
  render() {
    if (this.props.loading) {
      return (
        <div style={style.wrapper}>
          <div style={style.message}>loading...</div>
        </div>
      );
    }

    if (!this.props.user) {
      const signInUrl = `https://hub.getstorybook.io/sign-in?redirectUrl=${encodeURIComponent(location.href)}`;
      return (
        <div style={style.wrapper}>
          <div style={style.message}>
            <a style={style.button} href={signInUrl}>SignIn with Storybook Hub</a>
          </div>
        </div>
      );
    }

    if (this.props.appNotAvailable) {
      const appsUrl = 'https://hub.getstorybook.io/apps';
      return (
        <div style={style.wrapper}>
          <div style={style.message}>
            <a style={style.button} href={appsUrl}>Create an app for this repo on Storybook Hub</a>
          </div>
        </div>
      );
    }

    return (
      <div style={style.wrapper}>
        <CommentList key="list" {...this.props} />
        <CommentForm key="form" {...this.props} />
      </div>
    );
  }
}

CommentsPanel.propTypes = {
  loading: React.PropTypes.bool,
  user: React.PropTypes.object,
  appNotAvailable: React.PropTypes.object,
};
