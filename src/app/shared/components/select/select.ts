import { Component, forwardRef, input, model } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroChevronDown } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-select',
  imports: [NgIcon],
  viewProviders: [provideIcons({ heroChevronDown })],
  templateUrl: './select.html',
  styleUrl: './select.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true
    }
  ]
})
export class Select implements ControlValueAccessor {
  label = input<string>('');
  options = input<any[]>([]);
  value = model<any>('');
  required = input<boolean>(false);
  disabled = false;
  showLabel = input<boolean>(true);
  variant = input<'surface' | 'primary'>('primary')

  onChange: any = () => { };
  onTouch: any = () => { };

  selectVariant: Record<string, string> = {
    surface: 'bg-brand-surface',
    primary: 'bg-brand-bg'
  }

  get selectVariantClass() {
    return this.selectVariant[this.variant()];
  }

  writeValue(val: any): void {
    if (val !== undefined) {
      this.value.set(val);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    let newVal: any = target.value;
    if (newVal === 'true') newVal = true;
    if (newVal === 'false') newVal = false;

    this.value.set(newVal);
    this.onChange(newVal);
    this.onTouch();
  }
}

