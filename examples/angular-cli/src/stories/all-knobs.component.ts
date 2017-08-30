import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'simple-knobs-component',
  template: `
    <div style="border:2px dotted {{ colour }}; padding: 8px 22px; border-radius: 8px">
      <h1>My name is {{ name }},</h1>
      <h3>today is {{ date }}</h3>
      <p>{{ stockMessage }}</p>
      <p>Also, I have:</p>
      <ul>
        <li *ngFor="let item of items">
          {{ item }}
        </li>
      </ul>
      <p>{{ salutation }}</p>
    </div>
  `
})
export class AllKnobsComponent implements OnChanges, OnInit {
  @Input() text;
  @Input() price;
  @Input() colour;
  @Input() fruit;
  @Input() name;
  @Input() items;
  @Input() today;
  @Input() stock;
  @Input() nice;
  salutation;
  stockMessage;
  date;

  ngOnInit(): void {
    this.fillLocalState();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.fillLocalState();
  }

  fillLocalState() {
    this.date = new Date(this.today).toLocaleDateString();
    this.stockMessage = this.stock
      ? `I have a stock of ${this.stock} ${this.fruit}, costing &dollar;${this.price} each.`
      : `I'm out of ${this.fruit}${this.nice ? ', Sorry!' : '.'}`;
    this.salutation = this.nice ? 'Nice to meet you!' : 'Leave me alone!';
  }
}
