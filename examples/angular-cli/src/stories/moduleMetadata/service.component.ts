import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DummyService } from './dummy.service';

@Component({
  selector: 'simple-knobs-component',
  template: `
    <p>{{ name }}:</p>
    <ul>
      <li *ngFor="let item of items">
        {{ item }}
      </li>
    </ul>
  `
})
export class ServiceComponent {
  items;
  @Input() name;

  constructor(private dummy: DummyService) {
    console.log(DummyService);
    console.log(this.dummy);
  }

  async ngOnInit() {
    this.items = await this.dummy.getItems();
  }
}
