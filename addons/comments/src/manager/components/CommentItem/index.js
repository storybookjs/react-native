import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { window } from 'global';
import moment from 'moment';
import renderHTML from 'react-render-html';
import insertCss from 'insert-css';
import style from './style';
import commentCSS from './style.css';

insertCss(commentCSS);

export default class CommentItem extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.state = { hovered: false };
    this.mouseEnter = this.mouseEnter.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  mouseEnter() {
    this.setState({ hovered: true });
  }

  mouseLeave() {
    this.setState({ hovered: false });
  }

  deleteComment() {
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
    if (confirmDelete === true) {
      this.props.deleteComment();
    }
  }

  renderDelete() {
    return (
      <a style={style.commentDelete} onClick={this.deleteComment} role="button" tabIndex="0">
        delete
      </a>
    );
  }

  render() {
    const comment = this.props.comment;
    let commentStyle = style.commentItem;
    if (comment.loading) {
      commentStyle = style.commentItemloading;
    }

    const time = moment(new Date(comment.time), 'YYYYMMDD').fromNow();
    const body = renderHTML(`<span>${comment.text}</span>`);
    const showDelete = this.state.hovered && this.props.ownComment;

    return (
      <div style={commentStyle} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave}>
        <div style={style.commentAside}>
          <img alt={comment.user.name} style={style.commentAvatar} src={comment.user.avatar} />
        </div>
        <div className="comment-content" style={style.commentContent}>
          <div style={style.commentHead}>
            <span style={style.commentUser}>{comment.user.name}</span>
            <span style={style.commentTime}>{time}</span>
          </div>
          <span style={style.commentText}>{body}</span>
          {showDelete ? this.renderDelete() : null}
        </div>
      </div>
    );
  }
}

CommentItem.defaultProps = {
  comment: {},
  deleteComment: () => {},
  ownComment: false,
};

CommentItem.propTypes = {
  deleteComment: PropTypes.func,
  comment: PropTypes.shape({
    user: PropTypes.object,
    text: PropTypes.string,
    time: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    loading: PropTypes.bool,
  }),
  ownComment: PropTypes.bool,
};
