import React from 'react';
import Homepage from '../components/Homepage';
import Header from '../components/Header';
import Heading from '../components/Homepage/Heading';
import Demo from '../components/Homepage/Demo';
import Platforms from '../components/Homepage/Platforms';
import MainLinks from '../components/Homepage/MainLinks';
import Featured from '../components/Homepage/Featured';
import Footer from '../components/Footer';
import Docs from '../components/Docs';
import DocsContainer from '../components/Docs/Container';
import DocsContent from '../components/Docs/Content';
import DocsNav from '../components/Docs/Nav';

import { docsData } from './data';

export default {
  'Homepage.page': <Homepage featuredStorybooks={docsData.featuredStorybooks} />,
  'Homepage.header': <Header />,
  'Homepage.heading': <Heading />,
  'Homepage.demo': <Demo />,
  'Homepage.built-for': <Platforms />,
  'Homepage.main-links': <MainLinks />,
  'Homepage.featured-storybooks': <Featured featuredStorybooks={docsData.featuredStorybooks} />,
  'Homepage.footer': <Footer />,
  'Docs.page': (
    <Docs
      sections={docsData.sections}
      selectedItem={docsData.selectedItem}
      categories={docsData.categories}
      selectedCatId={'cat-2'}
    />
  ),
  'Docs.docs-container': (
    <DocsContainer
      sections={docsData.sections}
      selectedItem={docsData.selectedItem}
      categories={docsData.categories}
      selectedCatId={'cat-2'}
    />
  ),
  'Docs.docs-content': (
    <DocsContent title={docsData.selectedItem.title} content={docsData.selectedItem.content} />
  ),
  'Docs.docs-nav': (
    <DocsNav
      sections={docsData.sections}
      selectedSection={docsData.selectedItem.sectionId}
      selectedItem={docsData.selectedItem.id}
    />
  ),
};
