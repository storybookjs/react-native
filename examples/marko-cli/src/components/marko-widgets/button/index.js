const markoWidgets = require('marko-widgets');
const template = require('./template.marko');

function getInitialState(input) {
  return {
    disabled: Boolean(input.disabled),
  };
}

function getTemplateData(state, input) {
  const priority = input.priority || 'primary';
  const classes = ['btn'];

  if (priority === 'primary' || priority === 'danger') {
    classes.push(`btn--${priority}`);
  }

  return {
    tag: 'button',
    classes,
    disabled: state.disabled,
    htmlAttributes: input,
  };
}

function handleClick() {
  if (!this.state.disabled) {
    // eslint-disable-next-line no-undef,no-alert
    alert('button-click');
  }
}

function getInitialBody(input) {
  return input.body;
}

module.exports = markoWidgets.defineComponent({
  template,
  getInitialState,
  getTemplateData,
  getInitialBody,
  handleClick,
});
