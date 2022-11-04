import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';

@Component({
  selector: 'ui-cell-check-edit',
  template: `<div class="check-label">
    <label nz-checkbox ngDefaultControl [(ngModel)]="checked"></label>
  </div>`,
  styleUrls: ['ui-cell-check.component.less'],
})
export class UiCellCheckEditComponent implements ICellEditorAngularComp {
  checked: boolean = false;
  agInit(params: ICellEditorParams): void {
    this.checked = params.value === 'T';
  }

  getValue(): any {
    return this.checked ? 'T' : 'F';
  }
}
