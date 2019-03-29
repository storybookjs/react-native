import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipComponent } from './chip.component';
import { ChipsGroupComponent } from './chips-group.component';
import { ChipTextPipe } from './chip-text.pipe';

@NgModule({
  imports: [CommonModule],
  exports: [ChipsGroupComponent],
  declarations: [ChipsGroupComponent, ChipComponent, ChipTextPipe],
  providers: [],
})
export class ChipsModule {}
