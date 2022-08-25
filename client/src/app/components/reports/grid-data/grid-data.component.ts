import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  CellContextMenuEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  RowClickedEvent,
  ValueFormatterParams,
} from 'ag-grid-community';
import {
  IProcParam,
  ITabData,
  TypeOut,
  ICursorData,
  IStringData,
  FilterModelItem,
} from '../../../shared/interfaces';
import { DataServerService } from '../../../shared/services/data-server.service';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { GridLoadingComponent } from './grid-loading.component';
import { GridNoRowsComponent } from './grid-no-rows.component';

@Component({
  selector: 'app-grid-data',
  templateUrl: './grid-data.component.html',
  styleUrls: ['./grid-data.component.less'],
})
export class GridDataComponent implements OnInit, OnChanges {
  @Input() tabData!: ITabData;
  @Input() cursorName!: string;
  @Input() filter!: FilterModelItem[];
  @Output() docLink: EventEmitter<string> = new EventEmitter<string>();
  @Output() rowClick: EventEmitter<RowClickedEvent> =
    new EventEmitter<RowClickedEvent>();

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
      if (!this.tabData.owner) {
        return;
      }

      this.isLoading = true;
      this.girdApi.showLoadingOverlay();
      this.procParams.forEach((param) => {
        if (param.name === this.cursorName) {
          param.start = params.startRow;
          param.end = params.endRow;
          if (params.sortModel) {
            param.sorting = params.sortModel;
          }
          if (this.filter && this.filter.length > 0) {
            param.filter = this.filter;
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
      this.dataService
        .procExecute(
          this.tabData.owner!,
          this.tabData.procName!,
          this.procParams,
          this.tabData.uid!,
          this.tabData.docId!
        )
        .subscribe((data) => {
          this.isLoading = false;
          this.girdApi.hideOverlay();
          const link = <IStringData>data.data['P_LINKS'];
          if (link) {
            this.docLink.emit(link.data);
          }
          if (data.data) {
            //     const keys = Object.keys(data.data);
            const docData = <ICursorData>data.data[this.cursorName];
            if (docData.rows.length === 0) {
              this.girdApi.showNoRowsOverlay();
            }
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
                      dataFormatter(params, col.displayFormat, col.dbTypeName),
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
  loadingOverlayComponent: any = GridLoadingComponent;
  loadingOverlayComponentParams: any = {
    loadingMessage: 'One moment please...',
  };
  noRowsOverlayComponent: any = GridNoRowsComponent;
  noRowsOverlayComponentParams: any = {
    noRowsMessageFunc: () => 'Sorry - no rows! at: ' + new Date(),
  };

  onGridReady(params: GridReadyEvent) {
    params.api.setDatasource(this.dataSource);
    this.girdApi = params.api;
  }

  changeDefaultContext($event: MouseEvent, menu: NzDropdownMenuComponent) {
    $event.preventDefault();
    this.nzContextMenuService.create($event, menu);
  }

  contextMenu($event: CellContextMenuEvent) {
    this.clipboardContext = $event.value;
  }

  onRowClick($event: RowClickedEvent) {
    this.rowClick.emit($event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter'] && !this.tabData.isLoading) {
      if (this.girdApi) {
        this.girdApi.setDatasource(this.dataSource);
      }
    }
  }
}

function dataFormatter(
  params: ValueFormatterParams,
  format: string | null | undefined,
  type: string | undefined
): string {
  let value = params.value;

  if (!type) {
    return value;
  }

  switch (type) {
    case 'NUMBER':
      if (!value) return '0';
      if (format) {
        return formatStringToFixFloat(value.toString(), format).toString();
      }
      return Number.parseInt(value.toString()).toString();
    case 'DATE':
      if (dayjs(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid()) {
        const currYear = value.slice(0, value.indexOf('-'));
        const nowYear = dayjs().year();
        if (currYear === '0000') {
          value = nowYear + '-' + value.slice(value.indexOf('-') + 1);
        }
        if (format) {
          format = format
            .toUpperCase()
            .replace('YY', 'YYYY')
            .replace('NN', 'mm');
          return dayjs(value).format(format);
        } else {
          return dayjs(value).format('DD.MM.YYYY');
        }
      }
      return value;
  }

  return value;
}

function formatStringToFixFloat(value: string, format: string): number {
  const a = format;
  const b = value;
  const f =
    b.indexOf('.') + 1 === 0
      ? b
      : b.slice(0, b.indexOf('.') + 1 + a.slice(a.indexOf('.') + 1).length);

  return Number.parseFloat(f);
}
