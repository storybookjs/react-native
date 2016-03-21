const data = {};
const handlers = [];

export function setData(fields) {
  Object
    .keys(fields)
    .forEach(key => {
      data[key] = fields[key]
    });

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
