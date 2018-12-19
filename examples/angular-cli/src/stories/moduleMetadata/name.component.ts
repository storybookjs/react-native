import { Component, Input } from '@angular/core';

@Component({
  selector: 'storybook-name',
  template: `
    <h1>{{ field | customPipe }}</h1>
  `,
})
export class NameComponent {
  @Input()
  field;
}
