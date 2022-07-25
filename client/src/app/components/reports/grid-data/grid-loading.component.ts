import { Component } from '@angular/core';
import { ILoadingOverlayAngularComp } from 'ag-grid-angular';
import { ILoadingOverlayParams } from 'ag-grid-community';

@Component({
  selector: 'app-grid-lading',
  template: `<div class="loading">
    <nz-spin [nzSize]="'large'" nzTip="Loading..."></nz-spin>
  </div>`,
  styles: [
    `
      .loading {
        display: inline-block;
      }
    `,
  ],
})
export class GridLoadingComponent implements ILoadingOverlayAngularComp {
  params!: ILoadingOverlayParams;
  agInit(params: ILoadingOverlayParams): void {
    this.params = params;
  }
}
