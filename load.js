import React from 'react';
import ReactDOM from 'react-dom';
import ReadBox from 'redbox-react';
import {Flex, Box} from 'reflexbox';
import {PaperControls} from './paper_controls';

const rootEl = document.getElementById('root');
const data = {};

const Area = ({main, error}) => (
  <Flex align="center" justify="space-between" c={12}>
    <Box p={4}>
      <PaperControls
        papers={data.papers}
        selectedPaper={data.selectedPaper}
        selectedBlock={data.selectedBlock}
        onPaper={loadPaper}
        onBlock={loadBlock}/>
    </Box>
    <Box auto={true} p={3}>
      {error? <ReadBox error={error}/> : main}
    </Box>
  </Flex>
);

function renderArea() {
  const main = data.papers[data.selectedPaper][data.selectedBlock]();
  const area = <Area main={main} error={data.error}/>;
  ReactDOM.render(
    area,
    rootEl
  )
}

function loadPaper(paper) {
  data.selectedPaper = paper;
  data.selectedBlock = Object.keys(data.papers[paper])[0];
  renderArea();
}

function loadBlock(block) {
  data.selectedBlock = block;
  renderArea();
}

export function renderMain(papers) {
  const firstPaper = Object.keys(papers)[0];
  const firstBlock = Object.keys(papers[firstPaper])[0];
  data.papers = papers;
  data.selectedPaper = firstPaper;
  data.selectedBlock = firstBlock;

  data.error = null;
  renderArea();
};

export const renderError = (e) => {
  data.error = e;
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
