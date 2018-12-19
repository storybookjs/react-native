import { Component, Input, OnInit } from '@angular/core';
import { DummyService } from './dummy.service';

@Component({
  selector: 'storybook-simple-service-component',
  template: `
    <p>{{ name }}:</p>
    <ul>
      <li *ngFor="let item of items">{{ item }}</li>
    </ul>
  `,
})
export class ServiceComponent implements OnInit {
  items;
  @Input()
  name;

  constructor(private dummy: DummyService) {}

  async ngOnInit() {
    this.items = await this.dummy.getItems();
  }
}
