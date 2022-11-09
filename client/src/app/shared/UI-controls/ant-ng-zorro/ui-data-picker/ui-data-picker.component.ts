import { Component, Input, OnInit } from '@angular/core';
import { UiBaseControlComponent } from '../ui-base-control.component';
import { CompatibleDate } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'app-ui-data-picker',
  template: `<div [formGroup]="formGroup">
    <nz-date-picker
      [id]="name"
      [formControlName]="name"
      [nzFormat]="format"
      [nzMode]="'date'"
    ></nz-date-picker>
  </div>`,
  styles: [
    `
      .ant-picker {
        width: 100%;
      }
    `,
  ],
})
//      [nzSize]="'large'"
export class UiDataPickerComponent
  extends UiBaseControlComponent
  implements OnInit
{
  @Input() format: string = 'dd-MM-YYYY';
  @Input() override name: any;
  currentDate!: Date;

  override ngOnInit() {
    super.ngOnInit();

    this.formGroup.controls[this.name].setValue(new Date());
  }
}
