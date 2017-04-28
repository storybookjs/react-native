import React, { PropTypes } from 'react'
import DocumentTitle from 'react-document-title'
import { config } from 'config'

const Markdown = ({ route }) => {
  const post = route.page.data

  return (
    <DocumentTitle title={`${post.title} | ${config.siteTitle}`}>
      <div className="markdown">
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    </DocumentTitle>
  )
}

Markdown.propTypes = {
  route: PropTypes.object,
}

export default Markdown
