import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button from '../index';
import CommentForm from '../manager/components/CommentForm';
import CommentList from '../manager/components/CommentList';
import CommentsPanel from '../manager/components/CommentsPanel';

const userObj = {
  avatar: 'http://www.gravatar.com/avatar/?d=identicon',
  name: 'User A',
};

const commentsList = [
  {
    loading: false,
    user: {
      avatar: 'http://www.gravatar.com/avatar/?d=identicon',
      name: 'User A',
    },
    time: 'Wed Oct 12 2016 13:36:59 GMT+0530 (IST)',
    text: 'Lorem ipsum dolor sit amet, <pre><code>Ut odio massa, rutrum et purus id.</code></pre>',
  },
  {
    loading: false,
    user: {
      avatar: 'http://www.gravatar.com/avatar/?d=identicon',
      name: 'User B',
    },
    time: 'Wed Oct 12 2016 13:38:46 GMT+0530 (IST)',
    text:
      'Vivamus tortor nisi, <b>efficitur</b> in rutrum <em>ac</em>, tempor <code>et mauris</code>. In et rutrum enim',
  },
  {
    loading: true,
    user: {
      avatar: 'http://www.gravatar.com/avatar/?d=identicon',
      name: 'User C',
    },
    time: 'Wed Oct 12 2016 13:38:55 GMT+0530 (IST)',
    text: 'sample comment 3',
  },
];

storiesOf('Button', module)
  .add('default view', () => <Button onClick={action('button clicked')}>Hello</Button>)
  .add('some emojies as the text', () => <Button>😀 😎 👍 💯</Button>)
  .add('custom styles', () => {
    const style = {
      fontSize: 20,
      textTransform: 'uppercase',
      color: '#FF8833',
    };
    return <Button style={style}>Hello</Button>;
  });

storiesOf('Components', module)
  .add('CommentForm', () => <CommentForm addComment={action('addComment')} />)
  .add('CommentList - No Comments', () => <CommentList comments={[]} />)
  .add('CommentList - with comments', () =>
    <CommentList user={userObj} comments={commentsList} deleteComment={action('deleteComment')} />
  )
  .add('CommentPanel - not loggedIn', () => <CommentsPanel />)
  .add('CommentPanel - app not available', () =>
    <CommentsPanel user={userObj} appNotAvailable={{}} />
  )
  .add('CommentPanel - loggedIn with no comments', () =>
    <CommentsPanel
      user={userObj}
      loading={false}
      comments={[]}
      addComment={action('addComment')}
      deleteComment={action('deleteComment')}
    />
  )
  .add('CommentPanel - loggedIn with has comments', () =>
    <CommentsPanel
      user={userObj}
      loading={false}
      comments={commentsList}
      addComment={action('addComment')}
      deleteComment={action('deleteComment')}
    />
  );
