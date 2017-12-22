import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DummyService } from './dummy.service';

@Component({
  selector: 'simple-service-component',
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

  constructor(private dummy: DummyService) {}

  async ngOnInit() {
    this.items = await this.dummy.getItems();
  }
}
