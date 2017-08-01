import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'knobs-component',
  template: `
    <div style="border:2px dotted {{ color }}; padding: 8px 22px; border-radius: 8px">
      <h1>My name is {{ name }},</h1>
      <h3>today is {{ new Date(today).toLocaleDateString() }}</h3>
      <p>{{ stockMessage }}</p>
      <p>Also, I have:</p>
      <p>{{ salutation }}</p>
    </div>
  `
})
export class KnobsComponent {
    @Input() text;
    @Input() color;
    @Input() name;
    @Input() salutation;
    @Input() items;
    @Input() today;
    @Input() stockMessage;
    @Output() onClick = new EventEmitter<any>();
}

@Component({
  selector: 'simple-knobs-component',
  template: `
    <div>{{ content }}</div>
  `
})
export class SimpleKnobsComponent {
    @Input() content;
}
