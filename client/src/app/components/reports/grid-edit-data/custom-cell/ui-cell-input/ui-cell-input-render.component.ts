import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'ui-cell-check',
  template: `<div class="cell-render">
    {{ value }}
  </div>`,
  styles: [
    `
      .cell-render {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
      }
    `,
  ],
})
export class UiCellInputRenderComponent implements ICellRendererAngularComp {
  value: string = '';

  agInit(params: ICellRendererParams): void {
    this.value = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
