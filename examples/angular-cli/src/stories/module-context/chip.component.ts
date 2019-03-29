import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'storybook-chip',
  template: `
    <span>{{ text }}</span>
    <span (click)="removeClicked.emit()">X</span>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipComponent {
  @Input() text: string;
  @Output() removeClicked = new EventEmitter();
}
