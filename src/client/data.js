import createPageBus from 'page-bus';
import UUID from 'uuid';
import QS from 'query-string';

const parsedQs = QS.parse(window.location.search);
// We need to check whether we are inside a iframe or not.
// This is used by here and as well as in the UI
const iframeMode = Boolean(parsedQs.dataId);

// We need to create a unique Id for each page. We need to communicate
// using this id as a namespace. Otherwise, each every iframe will get the
// data.
//  We create a new UUID if this is main page. Then, this is used by UI to
//  create queryString param when creating the iframe.
//  If we are in the iframe, we'll get it from the queryString.
const dataId = iframeMode? parsedQs.dataId : window.dataId;
let data = {iframeMode, dataId};

const handlers = [];
const bus = createPageBus();

export function setData(fields) {
  Object
    .keys(fields)
    .forEach(key => {
      data[key] = fields[key]
    });

  // In page-bus, we must send non-identical data.
  // Otherwise, it'll cache and won't trigger.
  // That's why we are setting the __lastUpdated value here.
  const __lastUpdated = Date.now();
  const newData = {...data, __lastUpdated};
  bus.emit(getDataKey(), JSON.stringify(newData));
  handlers.forEach(handler => handler(getData()));
};

export function watchData(fn) {
  handlers.push(fn);
  return () => {
    const index = handlers.indexOf(fn);
    handlers.splice(index, 1);
  }
}

export function getData() {
  return {...data};
}

export function getDataKey() {
  return `data-${data.dataId}`;
}

export function getRequestKey() {
  return `data-request-${data.dataId}`;
}

bus.on(getDataKey(), function(dataString) {
  const d = JSON.parse(dataString);
  data = {...d, iframeMode};

  handlers.forEach(handler => {
    handler(getData());
  });
});

// do initial render
handlers.forEach(handler => handler(getData()));
