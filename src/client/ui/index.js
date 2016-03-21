import React from 'react';
import ReactDOM from 'react-dom';
import ReadBox from 'redbox-react';
import PaperControls from './controls';
import Layout from './layout';
import {setData, getData} from '../data';

const rootEl = document.getElementById('root');

export default function renderUI(data) {
  if (data.error) {
    return renderError(data, data.error);
  }

  // default main
  let main = (<p>There is no blocks yet!</p>);

  const paper = data.papers[data.selectedPaper];
  if (paper) {
    const block = data.papers[data.selectedPaper][data.selectedBlock];
    if (block) {
      try {
        main = block();
      } catch(error) {
        return setData({error});
      }
    }
  }

  return renderMain(data, main);
}

export function getControls(data) {
  return (
    <PaperControls
      papers={data.papers}
      selectedPaper={data.selectedPaper}
      selectedBlock={data.selectedBlock}
      onPaper={setSelectedPaper}
      onBlock={setSelectedBlock}/>
  );
}

export function renderError(data, error) {
  const controls = getControls(data);
  const redBox = (<ReadBox error={error}/>);
  const root = (<Layout controls={controls} content={redBox}/>);
  ReactDOM.render(root, rootEl);
}

export function renderMain(data, main) {
  const controls = getControls(data);
  const root = (<Layout controls={controls} content={main}/>);
  ReactDOM.render(root, rootEl);
}

// Event handlers
function setSelectedPaper(paper) {
  const data = getData();
  data.selectedPaper = paper;
  data.selectedBlock = Object.keys(data.papers[paper])[0];
  setData(data);
}

function setSelectedBlock(block) {
  const data = getData();
  data.selectedBlock = block;
  setData(data);
}
