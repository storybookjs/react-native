import React, { Component } from 'react';
import style from './style';

export default class CommentList extends Component {
  constructor(props, ...args) {
    super(props, ...args);
    this.usersMap = {};
    this.updateUsersMap();
  }

  updateUsersMap() {
    this.usersMap = this.props.users.reduce((map, user) => {
       map[user.id] = user;
       return map;
    }, {});
  }

  componentDidMount() {
    const wrapper = this.refs.wrapper;
    wrapper.scrollTop = wrapper.scrollHeight;
  }

  componentDidUpdate(prev) {
    this.updateUsersMap();
    if (this.props.comments.length !== prev.comments.length) {
      const wrapper = this.refs.wrapper;
      wrapper.scrollTop = wrapper.scrollHeight;
    }
  }

  formatTime(ts) {
    return new Date(ts).toLocaleString();
  }

  renderComment(comment, key) {
    let user = this.usersMap[comment.userId];
    if (!user) {
      return null;
    }
    let commentStyle = style.commentItem;
    if (comment.loading) {
      commentStyle = style.commentItemloading;
    }
    return (
      <div style={commentStyle} key={key}>
        <div style={style.commentAside}>
          <img style={style.commentAvatar} src={user.avatar} />
        </div>
        <div style={style.commentContent}>
          <div style={style.commentHead}>
            <span style={style.commentUser}>{user.name}</span>
            <span style={style.commentTime}>{this.formatTime(comment.time)}</span>
          </div>
          <span style={style.commentText}>{comment.text}</span>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div ref="wrapper" style={style.wrapper}>
        {this.props.comments.map((c, idx) => this.renderComment(c, idx))}
      </div>
    );
  }
}
