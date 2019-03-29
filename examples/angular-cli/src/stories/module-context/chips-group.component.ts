import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'storybook-chips-group',
  template: `
    <storybook-chip
      *ngFor="let chip of chips"
      [text]="chip.text"
      (removeClicked)="removeAllChipsClick.emit(chip.id)"
    ></storybook-chip>
    <span (click)="removeAllChipsClick.emit()">Remove All</span>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsGroupComponent {
  @Input() chips: Array<{
    id: number;
    text: string;
  }>;
  @Output() removeChipClick = new EventEmitter<number>();
  @Output() removeAllChipsClick = new EventEmitter();
}
