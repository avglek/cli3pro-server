import { Component, Input } from '@angular/core';
import { UiBaseControlComponent } from '../ui-base-control.component';
import { IDescParam, IOption } from '../../../interfaces';
import { parseSimpleParams } from '../../../utils/str-utils';

@Component({
  selector: 'app-ui-simple-select',
  template: `
    <div [formGroup]="formGroup">
      <nz-select [formControlName]="name" [nzOptionOverflowSize]="5">
        <nz-option
          *ngFor="let o of controlOptions"
          [nzValue]="o.value"
          [nzLabel]="o.label"
        ></nz-option>
      </nz-select>
    </div>
  `,
  styles: [],
})
export class UiSimpleSelectComponent extends UiBaseControlComponent {
  @Input() options!: IDescParam | undefined;
  @Input() isLoading: boolean = false;
  @Input() items: string | undefined;

  controlOptions: IOption[] = [];

  override ngOnInit() {
    super.ngOnInit();

    if (this.items) {
      this.controlOptions = parseSimpleParams(this.items) || [];
    }
    console.log('options:', this.controlOptions, this.defaultValue);

    if (this.defaultValue) {
      this.formGroup.controls[this.name].setValue(
        this.controlOptions.find((f) => f.value === this.defaultValue)?.value
      );
    } else {
      this.formGroup.controls[this.name].setValue(this.controlOptions[0].value);
    }
  }
}
