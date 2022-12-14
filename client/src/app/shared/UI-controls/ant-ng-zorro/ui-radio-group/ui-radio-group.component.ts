import { Component, Input, OnInit } from '@angular/core';
import { UiBaseControlComponent } from '../ui-base-control.component';
import { parseSimpleParams } from '../../../utils/str-utils';

@Component({
  selector: 'app-ui-radio-group',
  template: ` <div [formGroup]="formGroup">
    <nz-radio-group [id]="name" [formControlName]="name">
      <label *ngFor="let option of options" nz-radio [nzValue]="option.value">{{
        option.label
      }}</label>
    </nz-radio-group>
  </div>`,
  styles: [
    `
      [nz-radio] {
        display: block;
        height: 32px;
        line-height: 14px;
      }
    `,
  ],
})
export class UiRadioGroupComponent
  extends UiBaseControlComponent
  implements OnInit
{
  @Input() items: string | undefined;
  options: { label: string; value: any }[] = [];

  override ngOnInit() {
    super.ngOnInit();

    if (this.items) {
      this.options = parseSimpleParams(this.items) || [];
    }

    if (this.defaultValue) {
      this.formGroup.controls[this.name].setValue(
        this.defaultValue.replace(/"/g, '')
      );
    } else {
      this.formGroup.controls[this.name].setValue(this.options[0].value);
    }
  }
}
