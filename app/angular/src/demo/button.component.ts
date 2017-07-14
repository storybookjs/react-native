import { Component, Input } from '@angular/core';

@Component({
  selector: 'button-component',
  template: `
      <button>{{ text }}</button>
  `,
  styles: [
      `
        button {
          border: 1px solid #eee;
          border-radius: 3px;
          background-color: #FFFFFF;
          cursor: pointer;
          font-size: 15px;
          padding: 3px 10px;
          margin: 10px;
        }
      `
  ]
})
export default class ButtonComponent {
    @Input() text = '';
}