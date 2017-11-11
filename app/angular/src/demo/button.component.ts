import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'button-component',
  template: `
      <button (click)="onClick($event);">{{ text }}</button>
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
    @Output() onClick = new EventEmitter<any>();
}