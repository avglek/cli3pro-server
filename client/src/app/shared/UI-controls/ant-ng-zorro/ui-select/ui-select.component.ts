import { Component, Input } from '@angular/core';
import { UiBaseControlComponent } from '../ui-base-control.component';
import { IDescParam, IOption } from '../../../interfaces';
import { DataServerService } from '../../../services/data-server.service';
import { toCamelCase } from '../../../utils/str-utils';

@Component({
  selector: 'app-ui-select',
  template: `<div [formGroup]="formGroup">
    <nz-select
      nzAllowClear
      nzShowSearch
      nzServerSearch
      nzPlaceHolder="Выберите значение"
      [formControlName]="name"
      (nzScrollToBottom)="loadMore()"
      [nzDropdownRender]="renderTemplate"
      [nzOptionOverflowSize]="5"
      (nzOnSearch)="search($event)"
    >
      <nz-option
        *ngFor="let o of controlOptions"
        [nzValue]="o.value"
        [nzLabel]="o.label"
      ></nz-option>
    </nz-select>
    <ng-template #renderTemplate>
      <nz-spin *ngIf="isLoading"></nz-spin>
    </ng-template>
  </div>`,
  styleUrls: ['ui-select.component.less'],
})
export class UiSelectComponent extends UiBaseControlComponent {
  @Input() options!: IDescParam | undefined;
  @Input() isLoading: boolean = false;

  controlOptions: IOption[] = [];
  rowPoint = 0;
  countRow = 10;

  table!: string | null | undefined;
  order!: string | null | undefined;
  keyName!: string;
  valueName!: string;

  allRows!: number;
  searchValue: string = '';

  constructor(private dataService: DataServerService) {
    super();
  }

  override ngOnInit() {
    console.log('select option:', this.options);
    if (this.options) {
      this.table = this.options.lookupTable;
      this.order = this.options.lookupTableorder
        ? this.options.lookupTableorder
        : this.options.lookupKeyfields!;
      this.keyName = toCamelCase(this.options.lookupKeyfields!);
      this.valueName = this.options.lookupDisplayfields
        ? toCamelCase(this.options.lookupDisplayfields)
        : toCamelCase(this.options.lookupKeyfields!);
      this.getOptions();
    } else {
    }

    console.log(
      'table:',
      this.table,
      ' key:',
      this.keyName,
      ' value:',
      this.valueName
    );

    super.ngOnInit();
  }

  loadMore() {
    this.getOptions();
  }

  getOptions() {
    console.log('select get option:', this.table, this.order, this.options);
    if (this.table && this.order && this.options && this.options.objectOwner) {
      this.isLoading = true;
      const arrayValues = this.valueName.split(';');

      this.dataService
        .getLookTable(
          this.options.objectOwner,
          this.table,
          this.order,
          this.rowPoint,
          this.countRow,
          arrayValues[0],
          this.searchValue
        )
        .subscribe({
          next: (data: any) => {
            console.log('get data:', data);
            this.allRows = data.count;
            this.rowPoint += this.countRow;

            const loadList = <IOption[]>data.data.map((item: any) => {
              const value = arrayValues.reduce((acc, v) => {
                return acc + ' ' + item[v];
              }, '');

              return {
                value: item[this.keyName],
                label: value.slice(1),
              };
            });

            this.controlOptions = [...this.controlOptions, ...loadList];

            this.isLoading = false;
          },
          error: (err) => {
            console.log('Error:', err);
            return [];
          },
        });
    }
  }

  search($event: string) {
    this.rowPoint = 0;
    this.searchValue = $event;
    this.controlOptions = [];
    this.getOptions();
  }
}
