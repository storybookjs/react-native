/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  HostListener,
  HostBinding,
  ElementRef,
} from '@angular/core';

export const exportedConstant = 'An exported constant';

export type ButtonSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface ISomeInterface {
  one: string;
  two: boolean;
  three: any[];
}

/**
 * Short description about the component.
 *
 * Long description about the component - this also supports [markdown](https://en.wikipedia.org/wiki/Markdown)!
 *
 * **Lorem ipsum dolor sit amet**, consectetur adipiscing elit. Nullam sit amet lectus condimentum, _posuere velit id,
 * ornare risus_. In vitae ex eu lacus hendrerit elementum non ut massa. ~~Orci varius natoque penatibus et magnis dis
 * parturient montes~~, nascetur ridiculus mus. `Nullam vehicula lacus felis, ac aliquam nisl malesuada ac`.
 *
 * > Cras varius aliquam tortor in efficitur. Proin in egestas libero, ac ullamcoer est.
 *
 * <abbr title="Hypertext Markup Language">HTML</abbr> tags work just as they would in markup.
 *
 * @string Hello world
 * @link [Example](http://example.com)
 * @code `ThingThing`
 * @html <span class="badge">aaa</span>
 */
@Component({
  selector: 'my-button',
  templateUrl: './doc-button.component.html',
  styleUrls: ['./doc-button.component.scss'],
})
export class ButtonComponent<T> {
  @ViewChild('buttonRef', { static: false }) buttonRef: ElementRef;

  /** Appearance style of the button. */
  @Input()
  public appearance: 'primary' | 'secondary' = 'secondary';

  /** Sets the button to a disabled state. */
  @Input()
  public isDisabled = false;

  /**
   * The inner text of the button.
   *
   * @required
   */
  @Input()
  public label: string;

  /** Size of the button. */
  @Input()
  public size?: ButtonSize = 'medium';

  /**
   * Some input you shouldn't use.
   *
   * @deprecated
   */
  @Input()
  public somethingYouShouldNotUse = false;

  /**
   * Handler to be called when the button is clicked by a user.
   *
   * Will also block the emission of the event if `isDisabled` is true.
   */
  @Output()
  public onClick = new EventEmitter<Event>();

  /**
   * This is an internal method that we don't want to document and have added the `ignore` annoation to.
   *
   * @ignore
   */
  public handleClick(event: Event) {
    event.stopPropagation();

    if (!this.isDisabled) {
      this.onClick.emit(event);
    }
  }

  private _inputValue = 'some value';

  /** Setter for `inputValue` that is also an `@Input`. */
  @Input()
  public set inputValue(value: string) {
    this._inputValue = value;
  }

  /** Getter for `inputValue`. */
  public get inputValue() {
    return this._inputValue;
  }

  @HostListener('click', ['$event.target'])
  onClickListener(btn) {
    console.log('button', btn);
  }

  @HostBinding('class.focused') focus = false;

  /**
   * Returns all the CSS classes for the button.
   *
   * @ignore
   */
  public get classes(): string[] {
    return [this.appearance, this.size].filter(_class => !!_class).map(_class => `btn-${_class}`);
  }

  /**
   * @ignore
   */
  public ignoredProperty = 'Ignore me';

  /** Public value. */
  public internalProperty = 'Public hello';

  /** Private value. */
  private _value = 'Private hello';

  /** Set the private value. */
  public set value(value: string | number) {
    this._value = `${value}`;
  }

  /** Get the private value. */
  public get value(): string | number {
    return this._value;
  }

  /**
   * An internal calculation method which adds `x` and `y` together.
   *
   * @param x Some number you'd like to use.
   * @param y Some other number or string you'd like to use, will have `parseInt()` applied before calculation.
   */
  public calc(x: number, y: string | number): number {
    return x + parseInt(`${y}`, 10);
  }

  /** A public method using an interface. */
  public publicMethod(things: ISomeInterface) {
    console.log(things);
  }

  /**
   * A protected method.
   *
   * @param id Some `id`.
   */
  protected protectedMethod(id?: number) {
    console.log(id);
  }

  /**
   * A private method.
   *
   * @param password Some `password`.
   */
  private privateMethod(password: string) {
    console.log(password);
  }

  @Input('showKeyAlias')
  public showKey: keyof T;

  @Input()
  public set item(item: T[]) {
    this.processedItem = item;
  }

  public processedItem: T[];
}
