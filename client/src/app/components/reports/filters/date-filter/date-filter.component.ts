import { Component } from '@angular/core';
import { IFilterAngularComp } from 'ag-grid-angular';
import {
  AgPromise,
  IDoesFilterPassParams,
  IFilterParams,
} from 'ag-grid-community';

@Component({
  selector: 'date-filter',
  templateUrl: 'date-filter.component.html',
  styleUrls: ['date-filter.component.less'],
})
export class DateFilterComponent implements IFilterAngularComp {
  radioValue: string = 'A';
  agInit(params: IFilterParams): void {}

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    return false;
  }

  getModel(): any {}

  isFilterActive(): boolean {
    return false;
  }

  setModel(model: any): void | AgPromise<void> {
    return undefined;
  }
}
