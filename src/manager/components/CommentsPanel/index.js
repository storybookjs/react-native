import React, { Component } from 'react';
import CommentList from '../CommentList';
import CommentForm from '../CommentForm';
import style from './style';

export default class CommentsPanel extends Component {
  renderLoading() {
    return <div style={style.loading}>loading...</div>;
  }

  renderContent() {
    return [
      <CommentList key="list" {...this.props} />,
      <CommentForm key="form" {...this.props} />,
    ];
  }

  render() {
    return (
      <div style={style.wrapper}>
        {this.props.loading ? this.renderLoading() : this.renderContent()}
      </div>
    );
  }
}
