import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { parseColor } from '../../../../../shared/utils/grid-utils';

@Component({
  selector: 'ui-cell-check',
  template: `<div class="cell-render">
    <div *ngIf="visible" class="cell-item" [ngStyle]="style"></div>
  </div>`,
  styles: [
    `
      .cell-render {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .cell-item {
        height: 20px;
        width: 20px;
        border: 1px solid black;
        border-radius: 10px;
      }
    `,
  ],
})
export class UiCellColorRenderComponent implements ICellRendererAngularComp {
  color: string = '';
  style: { [p: string]: any } | null = null;
  visible: boolean = false;

  agInit(params: ICellRendererParams): void {
    if (params.value || params.value === 0) {
      this.visible = true;
      this.color = parseColor(params.value);
      this.style = { background: this.color };
    }
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
