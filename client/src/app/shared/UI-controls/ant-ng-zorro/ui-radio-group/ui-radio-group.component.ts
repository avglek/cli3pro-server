import { Component, Input, OnInit } from '@angular/core';
import { UiBaseControlComponent } from '../ui-base-control.component';
import { IDescParam } from '../../../interfaces';
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
        line-height: 32px;
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
    if (this.items) {
      this.options = parseSimpleParams(this.items) || [];
    }

    console.log('option:', this.options);

    super.ngOnInit();
  }
}
