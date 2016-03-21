import * as load from './load';
let papers = {};
const currentBlocks = [];

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

export const renderMain = load.renderMain;
export const renderError = load.renderError;
