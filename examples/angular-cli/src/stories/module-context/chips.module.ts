import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipComponent } from './chip.component';
import { ChipsGroupComponent } from './chips-group.component';
import { ChipTextPipe } from './chip-text.pipe';
import { CHIP_COLOR } from './chip-color.token';

@NgModule({
  imports: [CommonModule],
  exports: [ChipsGroupComponent],
  declarations: [ChipsGroupComponent, ChipComponent, ChipTextPipe],
  providers: [
    {
      provide: CHIP_COLOR,
      useValue: '#eeeeee',
    },
  ],
})
export class ChipsModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ChipsModule,
      providers: [
        {
          provide: CHIP_COLOR,
          useValue: '#eeeeee',
        },
      ],
    };
  }
}
