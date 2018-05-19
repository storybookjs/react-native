module.exports = require('marko-widgets').defineComponent({
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
