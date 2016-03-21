import React from 'react';
import ReactDOM from 'react-dom';
import ReadBox from 'redbox-react';
import PaperControls from './controls';
import Layout from './layout';
import {setData, getData} from '../data';
import papers from '../papers';

const rootEl = document.getElementById('root');

export default function renderUI(data) {
  if (data.error) {
    return renderError(data, data.error);
  }

  // default main
  let main = (<p>There is no blocks yet!</p>);

  const paper = papers[data.selectedPaper];
  if (paper) {
    const block = papers[data.selectedPaper][data.selectedBlock];
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
      papers={papers}
      selectedPaper={data.selectedPaper}
      selectedBlock={data.selectedBlock}
      onPaper={setSelectedPaper}
      onBlock={setSelectedBlock}/>
  );
}

export function getIframe(data) {
  const iframeStyle = {
    width: '100%',
    height: '100%',
    border: '0'
  };

  // We need to send iframe=true and dataId via queryString
  // That's how our data layer can start communicate via the iframe.
  const queryString = `iframe=true&dataId=${data.dataId}`;

  return (
    <iframe
      style={iframeStyle}
      src={`/?${queryString}`}/>
  );
}

export function renderError(data, error) {
  // We always need to render redbox in the mainPage if we get an error.
  // Since this is an error, this affects to the main page as well.
  const redBox = (<ReadBox error={error}/>);
  const controls = getControls(data);
  const root = (<Layout controls={controls} content={redBox} />);
  ReactDOM.render(root, rootEl);
}

export function renderMain(data, main) {
  // Inside iframe, we simply render the main component.
  if (data.iframeMode) {
    return ReactDOM.render(main, rootEl);
  }

  // Inside the main page, we simply render iframe.
  const controls = getControls(data);
  const root = (<Layout controls={controls} content={getIframe(data)}/>);
  ReactDOM.render(root, rootEl);
}

// Event handlers
function setSelectedPaper(paper) {
  const data = getData();
  data.selectedPaper = paper;
  data.selectedBlock = Object.keys(papers[paper])[0];
  setData(data);
}

function setSelectedBlock(block) {
  const data = getData();
  data.selectedBlock = block;
  setData(data);
}
