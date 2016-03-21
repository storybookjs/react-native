import renderUI from './ui';
import {
  setData,
  getData,
  watchData
} from './data';

const papers = {};

export function paper(paperName, m) {
  m.hot.dispose(() => {
    delete papers[paperName];
  });
  papers[paperName] = {};
  function block(name, fn) {
    papers[paperName][name] = fn;
    return {block};
  }

  return {block};
}

export function getPapers() {
  return papers;
}

export function renderMain(papers) {
  const data = getData();
  data.error = null;
  data.papers = papers;

  data.selectedPaper =
    (papers[data.selectedPaper])? data.selectedPaper : Object.keys(papers)[0];

  if (data.selectedPaper) {
    const paper = papers[data.selectedPaper];
    data.selectedBlock =
      (paper[data.selectedBlock])? data.selectedBlock : Object.keys(paper)[0];
  }

  setData(data);
};

export const renderError = (e) => {
  const data = getData();
  data.error = e;

  setData(data);
};
