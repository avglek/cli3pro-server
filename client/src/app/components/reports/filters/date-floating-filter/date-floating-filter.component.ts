import { Component } from '@angular/core';
import { IFloatingFilterAngularComp } from 'ag-grid-angular';
import {
  FilterChangedEvent,
  IFloatingFilterParams,
  ISimpleFilter,
} from 'ag-grid-community';
import dayjs from 'dayjs';

@Component({
  selector: 'date-floating-filter',
  templateUrl: 'date-floating-filter.component.html',
  styleUrls: ['date-floating-filter.component.less'],
})
export class DateFloatingFilterComponent implements IFloatingFilterAngularComp {
  params!: IFloatingFilterParams<ISimpleFilter>;

  currentValue: any;
  timeDefaultValue = dayjs(new Date()).hour(0).toDate();
  disabledRangeTime: any;
  disabledDate: any;

  agInit(params: IFloatingFilterParams<any>): void {
    this.params = params;
  }

  onParentModelChanged(
    parentModel: any,
    filterChangedEvent?: FilterChangedEvent | null
  ): void {
    if (!parentModel) {
      this.currentValue = null;
    } else {
      this.currentValue = parentModel;
    }
  }

  onChange(result: Date): void {}

  onOk(result: Date | Date[] | null): void {
    this.params.parentFilterInstance((instance) => {
      instance.onFloatingFilterChanged('inRange', result);
    });
  }

  onCalendarChange(result: Array<Date | null>): void {}
}
