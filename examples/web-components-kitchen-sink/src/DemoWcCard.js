/* eslint-disable no-underscore-dangle, import/extensions */
import { Event } from 'global';
import { LitElement, html } from 'lit-element';
import { demoWcCardStyle } from './demoWcCardStyle.css.js';

export class DemoWcCard extends LitElement {
  static get properties() {
    return {
      backSide: { type: Boolean, reflect: true, attribute: 'back-side' },
      header: { type: String },
      rows: { type: Object },
    };
  }

  /**
   * A card setter can have side A or B
   *
   * @param {("A"|"B")} value
   */
  set side(value) {
    this.__side = value;
    this.dispatchEvent(new Event('side-changed'));
    this.requestUpdate();
  }

  /**
   * @returns {("A"|"B")}
   */
  get side() {
    return this.__side;
  }

  static get styles() {
    return demoWcCardStyle;
  }

  constructor() {
    super();
    this.backSide = false;
    this.header = 'Your Message';
    this.rows = [];
  }

  toggle() {
    this.backSide = !this.backSide;
  }

  render() {
    return html`
      <div id="front">
        <div class="header">
          ${this.header}
        </div>
        <div class="content">
          <slot></slot>
        </div>
        <div class="footer">
          <div class="note">A</div>
          <button @click=${this.toggle}>></button>
        </div>
      </div>
      <div id="back">
        <div class="header">
          ${this.header}
        </div>

        <div class="content">
          ${this.rows.length === 0
            ? html``
            : html`
                <dl>
                  ${this.rows.map(
                    row => html`
                      <dt>${row.header}</dt>
                      <dd>${row.value}</dd>
                    `
                  )}
                </dl>
              `}
        </div>
        <div class="footer">
          <div class="note">B</div>
          <button @click=${this.toggle}>></button>
        </div>
      </div>
    `;
  }
}
