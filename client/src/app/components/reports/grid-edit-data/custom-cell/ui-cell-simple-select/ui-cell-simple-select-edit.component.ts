import { Component, ViewEncapsulation } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';

interface Options {
  label: string;
  value: string;
}

type LookData = {
  itemList: string;
};

@Component({
  selector: 'ui-cell-select-edit',
  template: `<div class="cell-select">
    <nz-select [(ngModel)]="value" [nzSize]="'small'">
      <nz-option
        *ngFor="let item of option"
        [nzValue]="item.value"
        [nzLabel]="item.label"
      ></nz-option>
    </nz-select>
  </div>`,
  styleUrls: ['ui-cell-simple-select.component.less'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class UiCellSimpleSelectEditComponent implements ICellEditorAngularComp {
  value: string = '';
  option: Options[] = [];

  agInit(params: ICellEditorParams & LookData): void {
    this.value = params.value;
    this.option = params.itemList
      .trim()
      .split('\n')
      .map((item) => {
        const arrayValues = item.split('=');
        return {
          value: arrayValues[1],
          label: arrayValues[0],
        };
      });
  }

  getValue(): any {
    return this.value;
  }
}
