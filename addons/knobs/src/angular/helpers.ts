import { NgModule, Component, Input, OnDestroy, OnInit, ChangeDetectorRef, OnChanges, SimpleChange, ChangeDetectionStrategy } from '@angular/core';
declare var component: {
    new ();
};

const getComponentMetadata = ({ component, props = {} }) => {
  if (!component || typeof component !== 'function')
    throw new Error('No valid component provided');

  const componentMeta = component.__annotations__[0];
  const propsMeta = component.__prop__metadata__ || {};
  return {
    component,
    props,
    componentMeta,
    propsMeta
  }
}

const getAnnotatedComponent = (meta, component) => {
  @Component(meta)
  class NewComponent extends (component as { new(): any; }) implements OnDestroy, OnInit, OnChanges {
    @Input() channel;
    @Input() knobStore;

    constructor(private cd: ChangeDetectorRef) {
        super();
        this.resetKnobs = this.resetKnobs.bind(this);
        this.knobChanged =  this.knobChanged.bind(this);
        this.setPaneKnobs = this.setPaneKnobs.bind(this);
    }

    ngOnChanges(changes) {
      if (super.ngOnChanges) {
        super.ngOnChanges(changes);
      }
    }
  
    ngOnInit() {
      if (super.ngOnInit) {
        super.ngOnInit();
      }
      this.channel.on('addon:knobs:reset', this.resetKnobs);
      this.channel.on('addon:knobs:knobChange', this.knobChanged);
      this.knobStore.subscribe(this.setPaneKnobs);
      this.setPaneKnobs();
    }
  
    ngOnDestroy() {
      if (super.ngOnDestroy) {
        super.ngOnDestroy();
      }
      this.channel.removeListener('addon:knobs:reset', this.resetKnobs);
      this.channel.removeListener('addon:knobs:knobChange', this.knobChanged);
      this.knobStore.unsubscribe(this.setPaneKnobs);
    }

    setPaneKnobs(timestamp: any = +new Date()) {
        this.channel.emit('addon:knobs:setKnobs', { knobs: this.knobStore.getAll(), timestamp });
    }

    knobChanged(change) {
        const { name, value } = change;
        const knobOptions = this.knobStore.get(name);
        knobOptions.value = value;
        this.knobStore.markAllUnused();
        const lowercasedName = name.toLocaleLowerCase();
        this[lowercasedName] = value;
        this.ngOnChanges({
          [lowercasedName]: new SimpleChange(this[lowercasedName], value, false)
        });
        this.cd.detectChanges();
    }

    resetKnobs() {
        this.knobStore.reset();
        this.setPaneKnobs(false);
    }
  }

  return NewComponent;
}

export function prepareComponent(element, channel, knobStore) {
  const { component, componentMeta, props, propsMeta } = getComponentMetadata(element);

  if (!componentMeta)
    throw new Error('No component metadata available');
    
  const AnnotatedComponent = getAnnotatedComponent(componentMeta, component);

  props['channel'] = channel;
  props['knobStore'] = knobStore;

  return {
      component: AnnotatedComponent,
      props,
      propsMeta
  }
}