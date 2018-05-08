import deprecate from 'util-deprecate';

// Create a decorator that can be used both in the (deprecated) old "hoc" style:
//   .add('story', decorator(options)(() => <Story />));
//
// And in the new, "parameterized" style:
//   .addDecorator(decorator)
//   .add('story', () => <Story />, { name: { parameters } });

export const makeTransitionalDecorator = ({ name, parameterName, wrapper }) => {
  const decorator = options => (getStory, context) => {
    const parameters = context.parameters && context.parameters[parameterName];

    return wrapper(getStory, context, {
      options,
      parameters,
    });
  };

  const hoc = deprecate(
    options => story => context => decorator(options)(story, context),
    `Passing stories directly into ${name}() is deprecated, instead use addDecorator(${name}) and pass options with the '${parameterName}' parameter`
  );

  return (...args) => {
    // Used without options as .addDecorator(decorator)
    if (typeof args[0] === 'function') {
      return decorator()(...args);
    }

    // Input are options, ala .add('name', decorator('note')(() => <Story/>))
    return hoc(args[0]);
  };
};
