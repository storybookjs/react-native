import React, { Component } from 'react';
import moment from 'moment';
import renderHTML from 'react-render-html';
import style from './style';
import './style.css';

export default class CommentList extends Component {

  componentDidMount() {
    const wrapper = this.refs.wrapper;
    wrapper.scrollTop = wrapper.scrollHeight;
  }

  componentDidUpdate(prev) {
    if (this.props.comments.length !== prev.comments.length) {
      const wrapper = this.refs.wrapper;
      wrapper.scrollTop = wrapper.scrollHeight;
    }
  }

  formatTime(ts) {
    return moment(new Date(ts), "YYYYMMDD").fromNow();
  }

  renderComment(comment, key) {
    if (!comment.user) return null;

    let commentStyle = style.commentItem;
    if (comment.loading) {
      commentStyle = style.commentItemloading;
    }

    return (
      <div style={commentStyle} key={key}>
        <div style={style.commentAside}>
          <img style={style.commentAvatar} src={comment.user.avatar} />
        </div>
        <div className="comment-content" style={style.commentContent}>
          <div style={style.commentHead}>
            <span style={style.commentUser}>{comment.user.name}</span>
            <span style={style.commentTime}>{this.formatTime(comment.time)}</span>
          </div>
          <span style={style.commentText}>{ renderHTML(`<span>${comment.text}</span>`) }</span>
        </div>
      </div>
    );
  }

  render() {
    const { comments } = this.props;

    if (comments.length === 0) {
      return (
        <div ref="wrapper" style={style.wrapper}>
          <div style={style.noComments}>No Comments Yet!</div>
        </div>
      );
    }

    return (
      <div ref="wrapper" style={style.wrapper}>
        {comments.map((c, idx) => this.renderComment(c, idx))}
      </div>
    );
  }
}
