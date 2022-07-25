import { Component } from '@angular/core';
import { INoRowsOverlayAngularComp } from 'ag-grid-angular';
import { INoRowsOverlayParams } from 'ag-grid-community';

@Component({
  selector: 'app-grid-lading',
  template: `<nz-empty nzNotFoundImage="simple"></nz-empty>`,
})
export class GridNoRowsComponent implements INoRowsOverlayAngularComp {
  params!: INoRowsOverlayParams;
  agInit(params: INoRowsOverlayParams): void {
    this.params = params;
  }
}
