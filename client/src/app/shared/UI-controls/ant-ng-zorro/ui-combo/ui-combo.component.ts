import { Component, Input, OnInit } from '@angular/core';
import { UiBaseControlComponent } from '../ui-base-control.component';
import {
  ControlType,
  IControlBase,
  IDescParam,
  IOption,
} from '../../../interfaces';
import { FormGroup } from '@angular/forms';
import { DataServerService } from '../../../services/data-server.service';
import { toCamelCase } from '../../../utils/str-utils';

interface IExtOption extends IOption {
  type?: ControlType;
  option?: IDescParam;
}

@Component({
  selector: 'app-ui-combo',
  templateUrl: 'ui-combo.component.html',
  styleUrls: ['ui-combo.component.less'],
})
export class UiComboComponent extends UiBaseControlComponent implements OnInit {
  @Input() group!: IControlBase[];

  controls: IExtOption[] = [];
  isSelect: boolean = false;
  value: string = '';
  insideGroup!: FormGroup;

  controlOptions: IOption[] = [];
  rowPoint = 0;
  countRow = 10;

  table!: string | null | undefined;
  order!: string | null | undefined;
  keyName!: string;
  valueName!: string;

  allRows!: number;
  searchValue: string = '';
  selectedValue: any;
  isLoading: boolean = false;
  isSelectDisabled: boolean = false;
  options!: IDescParam;

  constructor(private dataService: DataServerService) {
    super();
  }

  override ngOnInit() {
    super.ngOnInit();

    this.isSelectDisabled = true;
    this.controls = this.group.map((con) => {
      return {
        label: con.label || '',
        value: con.key,
        type: con.controlNumber,
        option: con.options,
      };
    });

    this.value = this.controls[0].value;

    console.log('init:', this.name, this.formGroup);

    this.formGroup.controls[this.name].setValue(this.controls[0].label);
  }

  onChange($event: any) {
    console.log('value:', this.value, $event);
    const selectControl = this.group.find((control) => {
      console.log(control);
      return control.key === $event;
    });
    console.log('c:', selectControl);
    if (selectControl?.controlNumber === 3) {
      this.isSelectDisabled = false;
      if (selectControl.options) {
        this.options = selectControl.options;
        this.table = this.options.lookupTable;
        this.order = this.options.lookupTableorder
          ? selectControl.options.lookupTableorder
          : selectControl.options.lookupKeyfields!;

        this.keyName = toCamelCase(this.options.lookupKeyfields!);
        this.valueName = this.options.lookupDisplayfields
          ? toCamelCase(this.options.lookupDisplayfields)
          : toCamelCase(this.options.lookupKeyfields!);
        this.getOptions();
      }
    }
    if (selectControl?.controlNumber === 11) {
      this.formGroup.controls[this.name].setValue(selectControl.label);
    }
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

  onSelectChange($event: any) {
    console.log('select change:', $event, this.selectedValue);
    this.formGroup.controls[this.name].setValue($event);
  }
}
