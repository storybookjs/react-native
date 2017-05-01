import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import Header from 'components/Header'
import Breakpoint from 'components/Breakpoint'
import find from 'lodash/find'
import { flatten, values } from 'lodash'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config'

import typography from 'utils/typography'
const { rhythm } = typography

class DocPage extends Component {
  handleTopicChange (e) {
    return this.context.router.push(e.target.value)
  }

  render () {
    const { route, location } = this.props
    const childPages = flatten(values(config.docSections)).map((p) => {
      const page = find(route.pages, (_p) => _p.path === p)
      return {
        title: page.data.title,
        path: page.path,
      }
    })
    const docOptions = childPages.map((child) =>
      <option
        key={prefixLink(child.path)}
        value={prefixLink(child.path)}
      >
        {child.title}
      </option>
    )
    const docPages = childPages.map((child) => {
      const isActive = prefixLink(child.path) === location.pathname
      return (
        <li
          key={child.path}
          style={{
            marginBottom: rhythm(1/2),
          }}
        >
          <Link
            to={prefixLink(child.path)}
            style={{
              textDecoration: 'none',
            }}
          >
            {isActive ? <strong>{child.title}</strong> : child.title}
          </Link>
        </li>
      )
    })
    return (
      <div>
        <Breakpoint
          mobile
        >
          <div
            style={{
              overflowY: 'auto',
              paddingRight: `calc(${rhythm(1/2)} - 1px)`,
              position: 'absolute',
              width: `calc(${rhythm(8)} - 1px)`,
              borderRight: '1px solid lightgrey',
            }}
          >
            <ul
              style={{
                listStyle: 'none',
                marginLeft: 0,
                marginTop: rhythm(1/2),
              }}
            >
              {docPages}
            </ul>
          </div>
          <div
            style={{
              padding: `0 ${rhythm(1)}`,
              paddingLeft: `calc(${rhythm(8)} + ${rhythm(1)})`,
            }}
          >
            {this.props.children}
          </div>
        </Breakpoint>
        <Breakpoint>
          <strong>Topics:</strong>
          {' '}
          <select
            defaultValue={this.props.location.pathname}
            onChange={this.handleTopicChange}
          >
            {docOptions}
          </select>
          <br />
          <br />
          {this.props.children}
        </Breakpoint>
      </div>
    )
  }
}
DocPage.propTypes = {
  location: PropTypes.object,
  route: PropTypes.object,
}
DocPage.contextTypes = {
  router: PropTypes.object.isRequired,
}
export default DocPage
