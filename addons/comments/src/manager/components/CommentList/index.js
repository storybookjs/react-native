import PropTypes from 'prop-types';
import React, { Component } from 'react';
import style from './style';
import CommentItem from '../CommentItem';

export default class CommentList extends Component {
  componentDidMount() {
    this.wrapper.scrollTop = this.wrapper.scrollHeight;
  }

  componentDidUpdate(prev) {
    if (this.props.comments.length !== prev.comments.length) {
      this.wrapper.scrollTop = this.wrapper.scrollHeight;
    }
  }

  render() {
    const { comments } = this.props;

    if (comments.length === 0) {
      return (
        <div
          ref={el => {
            this.wrapper = el;
          }}
          style={style.wrapper}
        >
          <div style={style.noComments}>No Comments Yet!</div>
        </div>
      );
    }

    return (
      <div
        ref={el => {
          this.wrapper = el;
        }}
        style={style.wrapper}
      >
        {comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            ownComment={comment.userId === (this.props.user && this.props.user.id)}
            deleteComment={() => this.props.deleteComment(comment.id)}
          />
        ))}
      </div>
    );
  }
}

CommentList.defaultProps = {
  comments: [],
  user: null,
  deleteComment: () => {},
};

CommentList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object),
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
  deleteComment: PropTypes.func,
};
