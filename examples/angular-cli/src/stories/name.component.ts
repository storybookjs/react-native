import { Component } from '@angular/core';

@Component({
  selector: 'name',
  template: `<h1>{{ 'foobar' | customPipe }}</h1>`
})
export class NameComponent {}
