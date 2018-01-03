import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
} from '@angular/core';
import { STORY } from './app.token';
import { NgStory } from './types';
import { setProps } from './setPropsToComponent';

@Component({
  selector: 'app-root',
  template: '<ng-template #target></ng-template>'
})
export class AppComponent implements OnInit {
  @ViewChild('target', { read: ViewContainerRef })
  target: ViewContainerRef;
  constructor(
    private cfr: ComponentFactoryResolver,
    @Inject(STORY) private data: NgStory
  ) {}

  /*
  * We need to use here the ngOnInit instead of ngAfterViewInit,
  * otherwise there will be ExpressionChangedAfterItHasBeenCheckedError in tests
   */
  ngOnInit(): void {
    this.putInMyHtml();
  }

  private putInMyHtml(): void {
    this.target.clear();
    const compFactory = this.cfr.resolveComponentFactory(this.data.component);
    const instance = this.target.createComponent(compFactory).instance;

    setProps(instance, this.data);
  }
}
