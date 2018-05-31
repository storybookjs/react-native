module.exports = require('marko-widgets').defineComponent({
  template: require('./template.marko'),

  getTemplateData: function(state, input) {
    return {
      name: input.name,
    };
  },

  handleClick: function() {
    this.el.style.backgroundColor = 'yellow';
  },
});
