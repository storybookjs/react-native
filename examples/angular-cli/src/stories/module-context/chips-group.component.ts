import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'storybook-chips-group',
  template: `
    <storybook-chip
      *ngFor="let chip of chips"
      class="chip"
      [text]="chip.text"
      (removeClicked)="removeAllChipsClick.emit(chip.id)"
    ></storybook-chip>
    <div *ngIf="chips.length > 1" class="remove-all" (click)="removeAllChipsClick.emit()">
      Remove All
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-content: center;
        padding: 0.5rem;
        background-color: lightgrey;
        border-radius: 0.5rem;
        width: fit-content;
      }
      .chip:not(:first-of-type) {
        margin-left: 0.5rem;
      }
      .remove-all {
        margin-left: 0.5rem;
        padding: 0.2rem 0.5rem;
        border: solid 0.1rem #eeeeee;
      }
      .remove-all:hover {
        background-color: palevioletred;
      }
    `,
  ],
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
