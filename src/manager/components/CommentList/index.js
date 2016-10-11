import React, { Component } from 'react';
import moment from 'moment';
import renderHTML from 'react-render-html';
import insertCss from 'insert-css';
import style from './style';

const customStyle = `
  .comment-content p {
    margin: 0;
    padding: 0;
  }

  .comment-content pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    padding: 5px;
    color: #000;
    font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
    font-size: 0.94em;
    border-radius: 3px;
    background-color: #F8F8F8;
    border: 1px solid #CCC;
  }

  .comment-content pre code {
    border: 0px !important;
    background: transparent !important;
    line-height: 1.3em;
  }

  .comment-content code {
    padding: 0 3px 0 3px;
    color: #000;
    font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
    font-size: 0.94em;
    border-radius: 3px;
    background-color: #F8F8F8;
    border: 1px solid #CCC;
  }

  .comment-content blockquote {
    color: #666666;
    margin: 3px 0;
    padding-left: 12px;
    border-left: 0.5em #EEE solid;
  }

  .comment-content ul, .comment-content ol {
    margin: 1em 0;
    padding: 0 0 0 2em;
  }

  .comment-content a {
    color: #0645ad;
    text-decoration: none;
  }
`;

insertCss(customStyle);

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
