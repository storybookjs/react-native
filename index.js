const papers = {};
window.__papers = papers;
const currentBlocks = [];

export function paper(paperName) {
  papers[paperName] = [];
  function block(name, fn) {
    papers[paperName].push({name, fn});
    return {block};
  }

  return {block};
}

export function getPapers() {
  return papers;
}
