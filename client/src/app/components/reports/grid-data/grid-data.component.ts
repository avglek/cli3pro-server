import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
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
  FilterModelItem,
  FilterProcType,
  ICursorData,
  IProcParam,
  IStringData,
  ITabData,
  TypeOut,
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
import { Subscription } from 'rxjs';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-grid-data',
  templateUrl: './grid-data.component.html',
  styleUrls: ['./grid-data.component.less'],
})
export class GridDataComponent implements OnInit, OnChanges, OnDestroy {
  @Input() tabData!: ITabData;
  @Input() cursorName!: string;
  @Input() filter: FilterModelItem[] = [];
  @Output() docLink: EventEmitter<string> = new EventEmitter<string>();
  @Output() rowCount: EventEmitter<number> = new EventEmitter<number>();
  @Output() rowClick: EventEmitter<RowClickedEvent> =
    new EventEmitter<RowClickedEvent>();

  girdApi!: GridApi;
  procParams: IProcParam[] = [];
  rowSelection = 'single';
  rowModelType: any = 'infinite';
  cacheBlockSize = 50;
  cacheOverflowSize = 3;
  isLoading = false;
  docSub: Subscription | undefined;

  clipboardContext!: any;
  contextEvent: CellContextMenuEvent | undefined = undefined;

  defaultColDef = {
    resizable: true,
    cellStyle: { borderRight: '1px solid #dfdfdf' },
    sortable: true,
    floatingFilter: true,
  };

  constructor(
    private dataService: DataServerService,
    private nzContextMenuService: NzContextMenuService,
    private commonService: CommonService
  ) {
    dayjs.extend(customParseFormat);
  }

  ngOnDestroy(): void {
    console.log('destroy');
    if (this.docSub) {
      this.docSub.unsubscribe();
      this.docSub = undefined;
    }
  }

  ngOnInit(): void {
    if (!this.tabData.isLoading) {
      console.log('init:', this.tabData);

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

    this.commonService.getContextFilter().subscribe((filter) => {
      console.log('set filter:', filter);
      this.filter.push(filter);
    });
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      console.log('ds params:', params);
      if (Object.keys(params.filterModel).length > 0) {
        this.filter = prepareFilter(params.filterModel);
        console.log('filter model:', this.filter);
      }
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
          console.log('this filter:', this.filter);
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
      console.log('proc params:', this.procParams);
      this.docSub = this.dataService
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
            this.rowCount.emit(docData.count);
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
                    filter: getFilterType(col.dbTypeName),
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
    this.contextEvent = $event;
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

function prepareFilter(params: any): FilterModelItem[] {
  const keys = Object.keys(params);
  return keys.map((key) => {
    return {
      colId: key,
      value: params[key].filter,
      type: FilterProcType.includes,
      filterType: params[key].filterType,
    };
  });
}

function getFilterType(dbType: string | undefined): string {
  if (!dbType) {
    return '';
  }
  switch (dbType.toUpperCase()) {
    case 'DATE':
      return 'agDateColumnFilter';
    default:
      return 'agTextColumnFilter';
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
