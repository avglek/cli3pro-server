import { Component, Input } from '@angular/core';
import { UiBaseControlComponent } from '../ui-base-control.component';

@Component({
  selector: 'app-ui-data-picker',
  template: `<div [formGroup]="formGroup">
    <nz-date-picker
      [id]="name"
      [formControlName]="name"
      [nzFormat]="format"
      [nzMode]="'date'"
      [(ngModel)]="currentDate"
      (ngModelChange)="onChange($event)"
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
  currentDate!: Date;

  onChange($event: Date) {
    if ($event) {
      //$event.setHours(0, 0, 0, 0);
      this.currentDate = new Date($event.toDateString()); //.getTime());
    }
  }
}
