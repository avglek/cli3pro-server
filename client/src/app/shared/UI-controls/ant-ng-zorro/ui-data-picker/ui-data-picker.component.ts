import { Component, Input } from '@angular/core';
import { UiBaseControlComponent } from '../ui-base-control.component';

@Component({
  selector: 'app-ui-data-picker',
  template: `<div [formGroup]="formGroup">
    <nz-date-picker
      [id]="name"
      [formControlName]="name"
      [nzFormat]="format"
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
export class UiDataPickerComponent extends UiBaseControlComponent {
  @Input() format: string = 'dd-MM-YYYY';
}
