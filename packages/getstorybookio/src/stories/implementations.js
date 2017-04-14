import React from 'react';
import Homepage from '../components/Homepage';
import Header from '../components/Homepage/Header';
import Heading from '../components/Homepage/Heading';
import Demo from '../components/Homepage/Demo';
import Platforms from '../components/Homepage/Platforms';
import MainLinks from '../components/Homepage/MainLinks';
import Featured from '../components/Homepage/Featured';
import Footer from '../components/Homepage/Footer';
import Docs from '../components/Docs';
import DocsContainer from '../components/Docs/Container';
import DocsContent from '../components/Docs/Content';
import DocsNav from '../components/Docs/Nav';

import { docsData } from './data';

const content = `
  React Storybook is a UI development environment for your React components.

  With it, you can visualize different states of your UI components and develop them interactively. React Storybook runs  outside of your app. So you can develop UI components in isolation without worrying about app specific dependencies and requirements.

  React Storybook also comes with a lot of [addons](/docs/addons/introduction) and a great API to customize as you wish. You can also build a [static version](/docs/basics/exporting-storybook) of your storybook and deploy it anywhere you want.

  Here are some featured storybooks that you can reference to see how Storybook works:
  
  * [React Button](http://kadira-samples.github.io/react-button) - [source](https://github.com/kadira-samples/react-button)
  * [Demo of React Dates](http://airbnb.io/react-dates/) - [source](https://github.com/airbnb/react-dates)
  * [Demo of React Native Web](http://necolas.github.io/react-native-web/storybook/) - [source](https://github.com/necolas/react-native-web)
`;

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
