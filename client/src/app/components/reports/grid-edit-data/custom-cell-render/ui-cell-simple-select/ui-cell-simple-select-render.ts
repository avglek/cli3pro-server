import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { DataServerService } from '../../../../../shared/services/data-server.service';

type LookData = {
  itemList: string;
};

@Component({
  selector: 'ui-cell-simple-selector',
  template: `<p>{{ value }}</p>`,
  styles: [``],
})
export class UiCellSimpleSelectRender implements ICellRendererAngularComp {
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
    if (!this.params.value) {
      this.value = '';
      return;
    }

    if (!this.params.itemList) {
      this.value = this.params.value;
      return;
    }

    const arr = this.params.itemList.split('\n').map((item) => {
      const arrayValues = item.split('=');
      return {
        key: arrayValues[1],
        value: arrayValues[0],
      };
    });

    const find = arr.find((i) => i.key === this.params.value);
    if (find) {
      this.value = find.value;
    } else {
      this.value = this.params.value;
    }
  }
}
