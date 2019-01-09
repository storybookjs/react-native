import { ControlValueAccessor } from '@angular/forms';
export declare class CustomCvaComponent implements ControlValueAccessor {
    disabled: boolean;
    protected onChange: (value: any) => void;
    protected onTouch: () => void;
    protected internalValue: any;
    value: any;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    setDisabledState(isDisabled: boolean): void;
}
