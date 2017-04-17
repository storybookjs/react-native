import React from 'react';
import ReactDOM from 'react-dom';
import Homepage from './components/Homepage';
import Docs from './containers/Docs';
import { Router, Route, browserHistory, applyRouterMiddleware } from 'react-router';
import { useScroll } from 'react-router-scroll';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import './lib/autolinker';
import 'airbnb-js-shims';

ReactDOM.render(
  <Router history={browserHistory} render={applyRouterMiddleware(useScroll())}>
    <Route path="/" component={Homepage} />
    <Route path="/docs(/:catId(/:sectionId/(:itemId)))" component={Docs} />

  </Router>,
  document.getElementById('root'),
);
