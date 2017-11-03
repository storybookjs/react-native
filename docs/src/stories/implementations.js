import React from 'react';
import { values } from 'lodash';

import Homepage from '../components/Homepage';
import Header from '../components/Header';
import Heading from '../components/Homepage/Heading';
import Demo from '../components/Homepage/Demo';
import Platforms from '../components/Homepage/Platforms';
import MainLinks from '../components/Homepage/MainLinks';
import Featured from '../components/Homepage/Featured';
import UsedBy from '../components/Homepage/UsedBy';
import Footer from '../components/Footer';
import Docs from '../components/Docs';
import DocsContainer from '../components/Docs/Container';
import DocsContent from '../components/Docs/Content';
import DocsNav from '../components/Docs/Nav';
import GridItem from '../components/Grid/GridItem';
import Grid from '../components/Grid/Grid';
import Examples from '../components/Grid/Examples';

import { docsData } from './data';
import users from './_users.yml';
import exampleData from './_examples.yml';

export default {
  'Homepage.page': (
    <Homepage featuredStorybooks={docsData.featuredStorybooks} users={values(users)} />
  ),
  'Homepage.header': <Header />,
  'Homepage.heading': <Heading />,
  'Homepage.demo': <Demo />,
  'Homepage.built-for': <Platforms />,
  'Homepage.main-links': <MainLinks />,
  'Homepage.featured-storybooks': <Featured featuredStorybooks={docsData.featuredStorybooks} />,
  'Homepage.used-by': <UsedBy users={values(users)} />,
  'Homepage.footer': <Footer />,
  'Docs.page': (
    <Docs
      sections={docsData.sections}
      selectedItem={docsData.selectedItem}
      categories={docsData.categories}
      selectedCatId="cat-2"
    />
  ),
  'Docs.docs-container': (
    <DocsContainer
      sections={docsData.sections}
      selectedItem={docsData.selectedItem}
      categories={docsData.categories}
      selectedCatId="cat-2"
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
  'Grid.grid-item': <GridItem {...values(exampleData)[0]} />,
  'Grid.grid': <Grid items={values(exampleData)} columnWidth={300} />,
  'Grid.examples': <Examples items={values(exampleData)} />,
};
