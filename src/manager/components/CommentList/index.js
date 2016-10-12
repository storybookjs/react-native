import React, { Component } from 'react';
import style from './style';
import CommentItem from '../CommentItem';

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
        {comments.map((comment, idx) => (
          <CommentItem
            key={`comment_${idx}`}
            comment={comment}
            ownComment={comment.userId === this.props.user.id}
            deleteComment={() => this.props.deleteComment(comment.id)}
          />
        ))}
      </div>
    );
  }
}

CommentList.propTypes = {
  comments: React.PropTypes.array,
  user: React.PropTypes.object,
  deleteComment: React.PropTypes.func,
};
