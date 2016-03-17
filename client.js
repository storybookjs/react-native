import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import Cookies from 'js-cookie';
import {getPapers, paper} from './';

const rootEl = document.getElementById('root');

let render = () => {
  require('/Volumes/data/sandbox/async/components/papers/index');
  const App = window.__papers['First Paper'][0].fn();
  ReactDOM.render(
    App,
    rootEl
  )
}

if (module.hot) {
  // Support hot reloading of components
  // and display an overlay for runtime errors
  const renderApp = render
  const renderError = (error) => {
    const RedBox = require('redbox-react')
    ReactDOM.render(
      <RedBox error={error} />,
      rootEl
    )
  }
  render = () => {
    try {
      renderApp()
    } catch (error) {
      renderError(error)
    }
  }
  module.hot.accept('/Volumes/data/sandbox/async/components/papers/index', () => {
    setTimeout(render)
  })
}

render()
