import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'simple-knobs-component',
  template: `
    <div>I am {{ name }} and I'm {{ age }} years old.</div>
    <div>Phone Number: {{ phoneNumber }}</div>
  `
})
export class SimpleKnobsComponent {
    @Input() name;
    @Input() age;
    @Input() phoneNumber;
}
