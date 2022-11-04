import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';

interface Options {
  label: string;
  value: string;
}

type LookData = {
  fieldName: string;
  lookData: { count: number; data: any[] };
  lookupKeyfields: string;
  lookupResultfield: string;
  lookupDisplayfields: string;
};

@Component({
  selector: 'ui-cell-select-edit',
  template: `<div class="cell-select">
    <nz-select nzShowSearch [(ngModel)]="value">
      <nz-option
        *ngFor="let item of option"
        [nzValue]="item.value"
        [nzLabel]="item.label"
      ></nz-option>
    </nz-select>
  </div>`,
  styles: [
    `
      .cell-select {
        width: 100%;
      }
      nz-select {
        margin: 0;
        width: 100%;
        font-size: 12px;
      }
      ::ng-deep .ant-select-item {
        font-size: 12px;
      }
    `,
  ],
})
export class UiCellSelectEditComponent implements ICellEditorAngularComp {
  value: string = '';
  option: Options[] = [];

  agInit(params: ICellEditorParams & LookData): void {
    this.value = params.value;
    if (params.lookData) {
      this.option = params.lookData.data.map((item) => {
        return {
          label: item[params.lookupResultfield],
          value: item[params.lookupKeyfields],
        };
      });
    }
  }

  getValue(): any {
    return this.value;
  }
}
