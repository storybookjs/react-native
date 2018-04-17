export class StringTemplateButton extends Polymer.Element {
  static get is() {
    return 'string-template-button';
  }

  static get properties() {
    return {
      title: {
        type: String,
        value: 'Wow, I am inline',
      },
      counter: {
        type: Number,
        value: 0,
      },
    };
  }

  static get template() {
    return '<button on-click="handleTap">[[title]]: [[counter]]</button>';
  }

  handleTap() {
    this.counter += 1;
  }
}

customElements.define(StringTemplateButton.is, StringTemplateButton);
