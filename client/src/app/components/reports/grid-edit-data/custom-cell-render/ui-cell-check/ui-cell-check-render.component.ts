import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'ui-cell-check',
  template: `<div class="check-label">
    <label
      nz-checkbox
      nzDisabled
      ngDefaultControl
      [(ngModel)]="checked"
    ></label>
  </div>`,
  styles: [
    `
      .check-label {
        text-align: center;
      }
    `,
  ],
})
export class UiCellCheckRenderComponent implements ICellRendererAngularComp {
  checked: boolean = false;

  agInit(params: ICellRendererParams): void {
    this.checked = params.value === 'T';
  }

  refresh(params: ICellRendererParams<any>): boolean {
    return false;
  }
}
