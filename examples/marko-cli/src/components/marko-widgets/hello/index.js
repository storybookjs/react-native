module.exports = require('marko-widgets').defineComponent({
  // eslint-disable-next-line global-require
  template: require('./template.marko'),

  getTemplateData(state, input) {
    return {
      name: input.name,
    };
  },

  handleClick() {
    this.el.style.backgroundColor = 'yellow';
  },
});
