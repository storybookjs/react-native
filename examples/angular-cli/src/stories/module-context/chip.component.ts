import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject,
  HostBinding,
} from '@angular/core';
import { CHIP_COLOR } from './chip-color.token';

@Component({
  selector: 'storybook-chip',
  template: `
    <span class="text">{{ displayText | chipText }}</span>
    <div class="remove" (click)="removeClicked.emit()">
      <span class="x">✕</span>
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        cursor: default;
        align-items: center;
        justify-content: center;
        padding: 0.2rem 0.5rem;
        border-radius: 1rem;
        border: solid 0.1rem transparent;
      }
      :host:hover {
        border-color: black;
      }
      .text {
        font-family: inherit;
      }
      .remove {
        margin-left: 1rem;
        background-color: lightgrey;
        border-radius: 50%;
        width: 1rem;
        height: 1rem;
        text-align: center;
      }
      .remove:hover {
        background-color: palevioletred;
      }
      .x {
        display: inline-block;
        color: #eeeeee;
        text-align: center;
        vertical-align: baseline;
        line-height: 1rem;
      }
    `,
  ],
})
export class ChipComponent {
  @Input() displayText: string;

  @Output() removeClicked = new EventEmitter();

  @HostBinding('style.background-color') backgroundColor: string;

  constructor(@Inject(CHIP_COLOR) chipColor: string) {
    this.backgroundColor = chipColor;
  }
}
