let papers = {};
const currentBlocks = [];

export function resetPapers() {
  console.log('RESET');
  papers = {};
}

export function paper(paperName, m) {
  console.log('XXX', arguments);
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
  console.log('GET');
  return papers;
}
