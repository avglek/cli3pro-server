import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { DataServerService } from '../../../../../shared/services/data-server.service';

type LookData = {
  fieldName: string;
  lookData: { count: number; data: any[] };
  lookupKeyfields: string;
  lookupResultfield: string;
  lookupDisplayfields: string;
};

@Component({
  selector: 'ui-cell-selector',
  template: `<p>{{ value }}</p>`,
  styles: [``],
})
export class UiCellSelectRender implements ICellRendererAngularComp {
  params!: ICellRendererParams & LookData;
  value: string = '';

  constructor() {}

  agInit(params: ICellRendererParams & LookData): void {
    this.params = params;
    this.updateValue();
  }

  refresh(params: ICellRendererParams & LookData): boolean {
    this.params = params;
    this.updateValue();
    return false;
  }

  updateValue() {
    if (this.params.lookData?.data) {
      const obj = this.params.lookData.data.find((item) => {
        return item[this.params.lookupKeyfields] === this.params.value;
      });
      if (obj) this.value = obj[this.params.lookupResultfield];
      else this.value = '';
    }
  }
}
