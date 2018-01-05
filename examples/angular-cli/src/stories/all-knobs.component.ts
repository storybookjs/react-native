import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'simple-knobs-component',
  template: `
    <div [ngStyle]="{ 'border': '2px dotted ' + border, 'padding.px': '8 22', 'border-radius.px': '8'}">
      <h1>My name is {{ name }},</h1>
      <h3>today is {{ today | date }}</h3>
      <p *ngIf="stock">I have a stock of {{ stock }} {{ fruit }}, costing $ {{ price }} each.</p>
      <p *ngIf="!stock">I'm out of {{ fruit }}.</p> <p *ngIf="stock && nice">Sorry.</p>
      <p>Also, I have:</p>
      <ul>
        <li *ngFor="let item of items">
          {{ item }}
        </li>
      </ul>
      <p *ngIf="nice">Nice to meet you!</p>
      <p *ngIf="!nice">Leave me alone!</p>
    </div>
  `
})
export class AllKnobsComponent implements OnChanges, OnInit {
  ngOnInit(): void {
    console.log('on init, user component');
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
  @Input() price;
  @Input() border;
  @Input() fruit;
  @Input() name;
  @Input() items;
  @Input() today;
  @Input() stock;
  @Input() nice;

  constructor() {
    console.log('constructor');
  }
}
