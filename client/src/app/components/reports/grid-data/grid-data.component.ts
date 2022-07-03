import { Component, Input, OnInit } from '@angular/core';
import {
  CellContextMenuEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from 'ag-grid-community';
import {
  IProcParam,
  ITabData,
  TypeData,
  TypeOut,
  ICursorData,
} from '../../../shared/interfaces';
import { DataServerService } from '../../../shared/services/data-server.service';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-grid-data',
  templateUrl: './grid-data.component.html',
  styleUrls: ['./grid-data.component.less'],
})
export class GridDataComponent implements OnInit {
  @Input() tabData!: ITabData;

  girdApi!: GridApi;
  procParams: IProcParam[] = [];
  rowSelection = 'single';
  rowModelType: any = 'infinite';
  cacheBlockSize = 50;
  cacheOverflowSize = 3;

  clipboardContext!: any;

  defaultColDef = {
    resizable: true,
    cellStyle: { borderRight: '1px solid #dfdfdf' },
    sortable: true,
  };

  constructor(
    private dataService: DataServerService,
    private nzContextMenuService: NzContextMenuService
  ) {}

  ngOnInit(): void {
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
      if (this.tabData.isLoading) {
        return;
      }
      if (params.sortModel) {
      }
      this.tabData.isLoading = true;
      this.procParams.forEach((param) => {
        if (param.inOut === TypeOut.Out && param.type === TypeData.Cursor) {
          param.start = params.startRow;
          param.end = params.endRow;
          if (params.sortModel) {
            param.sorting = params.sortModel;
          }
        }
        if (param.inOut === TypeOut.In) {
          const tabParams = this.tabData.params?.find((p) => {
            console.log(p.argumentName, param.name);
            return p.argumentName === param.name;
          });
          if (tabParams) {
            param.value = tabParams.value;
          }
        }
      });
      console.log('params:', this.procParams);
      this.dataService
        .procExecute(
          this.tabData.procName!,
          this.procParams,
          this.tabData.uid!,
          this.tabData.docId!
        )
        .subscribe((data) => {
          this.tabData.isLoading = false;
          if (data.data) {
            const keys = Object.keys(data.data);
            const docData = <ICursorData>data.data[keys[0]];
            params.successCallback(docData.rows, docData.count);
            if (docData.fields) {
              const columns = <ColDef[]>docData.fields
                .sort((a, b) => a.order - b.order)
                .filter((col) => col.visible === 'T')
                .map((col) => ({
                  field: col.fieldName,
                  headerName: col.displayLabel,
                  width: col.displaySize
                    ? col.displaySize * 10 + 20
                    : undefined,
                }));

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
