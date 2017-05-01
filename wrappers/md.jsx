import React, { PropTypes } from 'react'
import DocumentTitle from 'react-document-title'
import { config } from 'config'

const Markdown = ({ route }) => {
  const post = route.page.data
  const editUrl = `https://github.com/storybooks/storybooks.github.io/tree/source/pages${route.path.replace(/\/$/g, '.md')}`
  return (
    <DocumentTitle title={`${post.title} | ${config.siteTitle}`}>
      <div className="markdown">
        <h1>{post.title}</h1>
        <p>
          <a class="edit-link" href={editUrl} target="_blank">
            Edit this page
          </a>
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    </DocumentTitle>
  )
}

Markdown.propTypes = {
  route: PropTypes.object,
}

export default Markdown
