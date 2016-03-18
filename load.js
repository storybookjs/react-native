import React from 'react';
import ReactDOM from 'react-dom';
import ReadBox from 'redbox-react';

const rootEl = document.getElementById('root');

let main = (<div />);
let error = null;

const Area = ({main, error}) => (
  <div>
    {error? <ReadBox error={error}/> : main}
  </div>
);

function renderArea() {
  const area = <Area main={main} error={error}/>;
  ReactDOM.render(
    area,
    rootEl
  )
}

export function renderMain(papers) {
  main = papers['First Paper'][0].fn();
  error = null;
  renderArea();
};

export const renderError = (e) => {
  error = e;
  renderArea();
};

export function getRoot() {
  return rootEl;
}

export function renderContent(comp) {
  ReactDOM.render(
    comp,
    rootEl
  )
}
