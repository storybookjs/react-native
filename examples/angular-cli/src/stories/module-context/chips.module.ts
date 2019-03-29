import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipComponent } from './chip.component';
import { ChipsGroupComponent } from './chips-group.component';

@NgModule({
  imports: [CommonModule],
  exports: [ChipsGroupComponent],
  declarations: [ChipsGroupComponent, ChipComponent],
  providers: [],
})
export class ChipsModule {}
