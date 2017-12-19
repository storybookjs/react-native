import { Component, Input } from '@angular/core';

@Component({
  selector: 'name',
  template: `<h1>{{ field | customPipe }}</h1>`
})
export class NameComponent {
  @Input() field;
}
