import { Component, Input, OnInit } from '@angular/core';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  IServerSideRowModel,
} from 'ag-grid-community';
import {
  IProcParam,
  ITabData,
  TypeData,
  TypeOut,
  ICursorData,
} from '../../../shared/interfaces';
import { DataServerService } from '../../../shared/services/data-server.service';

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

  defaultColDef = {
    resizable: true,
    cellStyle: { borderRight: '1px solid #dfdfdf' },
    sortable: true,
  };

  constructor(private dataService: DataServerService) {}

  ngOnInit(): void {
    console.log('tabs loading:', this.tabData.isLoading);
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
      console.log('get rows:', params);
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
          console.log('data:', data.data);
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
    console.log('grid ready:', params);
    params.api.setDatasource(this.dataSource);
    this.girdApi = params.api;
  }
}
