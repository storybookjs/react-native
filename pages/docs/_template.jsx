import React from 'react';
import PropTypes from 'prop-types'
import find from 'lodash/find'
import capitalize from 'lodash/capitalize'

import Docs from 'components/Docs';
import { config } from 'config'

const categories = [{
  id: 'react-storybook',
  title: 'React Storybook',
}]

const getSections = (catId, config, pages) => {
  // FIXME: use catId
  const sections = Object.keys(config.docSections)
  return sections.map(key => ({
    id: key,
    heading: capitalize(key),
    items: config.docSections[key].map((path) => {
      const page = pages.find(p => p.path === path)
      return page.data
    })
  }))
}

const getSelectedItem = (children, sectionId) => {
  const { data } = children.props.route.page
  return {
    id: data.id,
    section: sectionId,
    title: data.title,
    content: data.body
  }
}

const parsePath = (path) => {
  const comps = path.split('/')
  const [empty, itemId, sectionId, catId, ...rest] = comps.reverse()
  return { catId, sectionId, itemId }
}

class DocsContainer extends React.Component {
  render() {
    const { pages, path } = this.props.route
    const { children } = this.props
    const { catId, sectionId, itemId } = parsePath(children.props.route.path)

    const props = {
      categories,
      selectedCatId: catId,
      sections: getSections(catId, config, pages),
      selectedItem: getSelectedItem(children, sectionId),
      selectedSectionId: sectionId,
      selectedItemId: itemId,
    }
    console.log('props', props)

    return <Docs {...props} />
  }
}

DocsContainer.propTypes = {
  location: PropTypes.object,
  route: PropTypes.object,
}
DocsContainer.contextTypes = {
  router: PropTypes.object.isRequired,
}

export default DocsContainer;
