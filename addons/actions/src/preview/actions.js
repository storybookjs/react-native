import action from './action';

export default function actions(...args) {
  let options = {};
  const names = args;
  // last argument can be options
  if (names.length !== 1 && typeof args[args.length - 1] !== 'string') {
    options = names.pop();
  }

  let namesObject = names[0];
  if (names.length !== 1 || typeof namesObject === 'string') {
    namesObject = {};
    names.forEach(name => {
      namesObject[name] = name;
    });
  }

  const actionsObject = {};
  Object.keys(namesObject).forEach(name => {
    actionsObject[name] = action(namesObject[name], options);
  });
  return actionsObject;
}
