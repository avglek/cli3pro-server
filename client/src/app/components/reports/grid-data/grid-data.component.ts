import { Component, Input, OnInit } from '@angular/core';
import {
  CellContextMenuEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  ValueFormatterParams,
} from 'ag-grid-community';
import {
  IProcParam,
  ITabData,
  TypeOut,
  ICursorData,
} from '../../../shared/interfaces';
import { DataServerService } from '../../../shared/services/data-server.service';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

@Component({
  selector: 'app-grid-data',
  templateUrl: './grid-data.component.html',
  styleUrls: ['./grid-data.component.less'],
})
export class GridDataComponent implements OnInit {
  @Input() tabData!: ITabData;
  @Input() cursorName!: string;

  girdApi!: GridApi;
  procParams: IProcParam[] = [];
  rowSelection = 'single';
  rowModelType: any = 'infinite';
  cacheBlockSize = 50;
  cacheOverflowSize = 3;
  isLoading = false;

  clipboardContext!: any;

  defaultColDef = {
    resizable: true,
    cellStyle: { borderRight: '1px solid #dfdfdf' },
    sortable: true,
  };

  constructor(
    private dataService: DataServerService,
    private nzContextMenuService: NzContextMenuService
  ) {
    dayjs.extend(customParseFormat);
  }

  ngOnInit(): void {
    console.log('tabData:', this.tabData);
    console.log('cursor name', this.cursorName);

    if (!this.tabData.isLoading) {
      if (this.tabData.params) {
        this.procParams = this.tabData.params.map((param) => {
          return {
            name: param.argumentName,
            type: param.dataType,
            position: param.position,
            inOut: param.inOut,
          };
        });
      }
    }
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      console.log('get rows:', this.cursorName, this.tabData);
      if (this.tabData.isLoading) {
        return;
      }
      console.log('1:', this.cursorName);

      if (params.sortModel) {
      }
      this.isLoading = true;
      console.log('2:', this.cursorName);
      this.procParams.forEach((param) => {
        if (param.name === this.cursorName) {
          param.start = params.startRow;
          param.end = params.endRow;
          if (params.sortModel) {
            param.sorting = params.sortModel;
          }
        }
        if (param.inOut === TypeOut.In) {
          const tabParams = this.tabData.params?.find((p) => {
            return p.argumentName === param.name;
          });
          if (tabParams) {
            param.value = tabParams.value;
          }
        }
      });
      console.log('send:', this.tabData.procName, this.procParams);
      this.dataService
        .procExecute(
          this.tabData.procName!,
          this.procParams,
          this.tabData.uid!,
          this.tabData.docId!
        )
        .subscribe((data) => {
          this.isLoading = false;
          if (data.data) {
            console.log('data:', this.cursorName, data);
            const keys = Object.keys(data.data);
            console.log('keys:', this.cursorName, keys);
            const docData = <ICursorData>data.data[this.cursorName];
            params.successCallback(docData.rows, docData.count);
            if (docData.fields) {
              const columns = <ColDef[]>docData.fields
                .sort((a, b) => a.order - b.order)
                .filter((col) => col.visible === 'T')
                .map((col) => {
                  return {
                    field: col.fieldName,
                    headerName: col.displayLabel,
                    width: col.displaySize
                      ? col.displaySize * 10 + 20
                      : undefined,
                    valueFormatter: (params) =>
                      dataFormatter(params, col.displayFormat),
                  };
                });
              if (this.girdApi) {
                this.girdApi.setColumnDefs(columns);
              }
            }
          }
        });
    },
  };

  onGridReady(params: GridReadyEvent) {
    params.api.setDatasource(this.dataSource);
    this.girdApi = params.api;
  }

  changeDefaultContext($event: MouseEvent, menu: NzDropdownMenuComponent) {
    console.log('event:', $event);
    $event.preventDefault();
    this.nzContextMenuService.create($event, menu);
  }

  contextMenu($event: CellContextMenuEvent) {
    console.log('cell:', $event.value);
    this.clipboardContext = $event.value;
  }
}

function dataFormatter(
  params: ValueFormatterParams,
  format: string | null | undefined
): string {
  let value = params.value;

  if (dayjs(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid()) {
    if (format) {
      format = format.toUpperCase().replace('YY', 'YYYY').replace('NN', 'mm');
      value = dayjs(value).format(format);
    } else {
      value = dayjs(value).format('DD.MM.YYYY');
    }
  }
  return value;
}
