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
  ColumnApi,
  DateFilter,
  GridApi,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  RowClickedEvent,
  TextFilter,
  ValueFormatterParams,
} from 'ag-grid-community';
import {
  FilterModelItem,
  ICursorData,
  IField,
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
import { ToolbarService } from '../../../shared/services/toolbar.service';
import { AG_GRID_LOCALE_RU } from '../../../shared/locale/locale-ru';
import { PrintService } from '../../../shared/services/print.service';

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

  gridApi!: GridApi;
  gridColumnApi!: ColumnApi;
  gridId = 'dataGrid';
  procParams: IProcParam[] = [];
  rowSelection = 'single';
  rowModelType: any = 'infinite';
  cacheBlockSize = 50;
  cacheOverflowSize = 3;
  isLoading = false;
  docSub: Subscription | undefined;
  onFloatingFilter: Subscription | undefined;
  locale = AG_GRID_LOCALE_RU;

  clipboardContext!: any;
  contextEvent: CellContextMenuEvent | undefined = undefined;

  defaultColDef = {
    resizable: true,
    cellStyle: { borderRight: '1px solid #dfdfdf' },
    sortable: true,
    floatingFilter: false,
    wrapHeaderText: true,
    autoHeaderHeight: true,
  };

  constructor(
    private dataService: DataServerService,
    private nzContextMenuService: NzContextMenuService,
    private commonService: CommonService,
    private toolBarService: ToolbarService,
    private printService: PrintService
  ) {
    dayjs.extend(customParseFormat);
  }

  ngOnDestroy(): void {
    if (this.docSub) {
      this.docSub.unsubscribe();
      this.docSub = undefined;
    }
    if (this.onFloatingFilter) {
      this.onFloatingFilter.unsubscribe();
      this.onFloatingFilter = undefined;
    }
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
        if (this.tabData.isOnFilter) {
          this.defaultColDef.floatingFilter = this.tabData.isOnFilter;
        }
      }
    }

    this.commonService.getContextFilter().subscribe((filter) => {
      if (this.gridApi) {
        if (filter) {
          const filterInstance = this.gridApi.getFilterInstance(filter.colId);
          if (filterInstance instanceof TextFilter) {
            if (filter.value === '') {
              filterInstance.setModel(null);
            } else {
              filterInstance.setModel({
                filterType: 'text',
                type: 'equals',
                filter: <string>filter.value,
              });
            }
          }
          if (filterInstance instanceof DateFilter) {
            console.log(
              filter.value,
              dayjs(filter.value).add(1, 'day').format('YYYY-MM-DD')
            );
            filterInstance.setModel({
              filterType: 'date',
              type: 'inRange',
              dateFrom: dayjs(filter.value).format('YYYY-MM-DD'),
              dateTo: dayjs(filter.value).add(1, 'day').format('YYYY-MM-DD'),
            });
          }

          this.gridApi.onFilterChanged();
        } else {
        }
      }
    });

    this.initToolbarSubject();
    this.toolBarService.btnFilter.next(false);
  }

  dataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      const allFilter: FilterModelItem[] = [];
      if (Object.keys(params.filterModel).length > 0) {
        allFilter.push(...prepareFilter(params.filterModel));
        //console.log('filter:', params.filterModel, allFilter);
      }
      if (this.filter.length > 0) {
        allFilter.push(...this.filter);
      }

      if (this.tabData.isLoading) {
        return;
      }
      if (!this.tabData.owner) {
        return;
      }

      this.isLoading = true;
      this.gridApi.showLoadingOverlay();
      this.procParams.forEach((param) => {
        if (param.name === this.cursorName) {
          param.start = params.startRow;
          param.end = params.endRow;
          if (params.sortModel) {
            param.sorting = params.sortModel;
          }

          param.filter = allFilter;
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
          this.gridApi.hideOverlay();
          const link = <IStringData>data.data['P_LINKS'];
          if (link) {
            this.docLink.emit(link.data);
          }
          if (data.data) {
            //     const keys = Object.keys(data.data);
            const docData = <ICursorData>data.data[this.cursorName];
            this.rowCount.emit(docData.count);
            if (docData.rows.length === 0) {
              this.gridApi.showNoRowsOverlay();
            }
            params.successCallback(docData.rows, docData.count);
            if (docData.fields) {
              const columns = <ColDef[]>docData.fields
                .sort((a, b) => a.order - b.order)
                .filter((col) => col.visible === 'T')
                .map((col) => {
                  const refColumnDef = {
                    field: col.fieldName,
                    headerName: col.displayLabel,
                    headerTooltip: col.displayLabel,
                    width: col.displaySize
                      ? col.displaySize * 10 + 20
                      : undefined,
                    valueFormatter: (params: any) =>
                      dataFormatter(params, col.displayFormat, col.dbTypeName),
                  };
                  this.setColumFilter(refColumnDef, col);

                  return refColumnDef;
                });
              if (this.gridApi) {
                this.gridApi.setColumnDefs(columns);
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
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  changeDefaultContext($event: MouseEvent, menu: NzDropdownMenuComponent) {
    $event.preventDefault();
    this.nzContextMenuService.create($event, menu);
  }

  contextMenu($event: CellContextMenuEvent) {
    this.clipboardContext = $event.value;
    this.contextEvent = $event;
    this.commonService.setContextMenuEvent($event);
  }

  onRowClick($event: RowClickedEvent) {
    this.rowClick.emit($event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log('changes:',changes)
    if (changes['filter'] && !this.tabData.isLoading) {
      if (this.gridApi) {
        this.gridApi.setDatasource(this.dataSource);
      }
    }
  }

  private setColumFilter(def: ColDef, col: IField) {
    if (!col.dbTypeName) return;

    switch (col.dbTypeName.toUpperCase()) {
      case 'DATE':
        Object.assign(def, {
          //floatingFilterComponent: DateFloatingFilterComponent,
          filter: 'agDateColumnFilter',
          filterParams: {
            buttons: ['apply', 'clear', 'reset', 'cancel'],
            closeOnApply: true,
            inRangeFloatingFilterDateFormat: 'DD.MM.YYYY',
            //filterOptions: ['contains', 'startsWith', 'endsWith', 'inRange'],
            //defaultOption: 'startsWith',
          },
        });
        break;
      case 'NUMBER':
        Object.assign(def, {
          filter: 'agNumberColumnFilter',
        });
        break;
      default:
        Object.assign(def, { filter: 'agTextColumnFilter' });
        break;
    }

    // Object.assign(def, {
    //   floatingFilterComponentParams: {
    //     suppressFilterButton: true,
    //   },
    // });
  }

  initToolbarSubject() {
    this.onFloatingFilter = this.toolBarService.btnFilter.subscribe(
      (onFilter) => {
        console.log('filter:', onFilter);
        if (this.gridApi) {
          this.defaultColDef.floatingFilter = onFilter;
          this.gridApi.setDefaultColDef(this.defaultColDef);

          this.gridApi.refreshHeader();
        }
      }
    );

    this.tabData.toPrint = this.printGridData.bind(this);

    this.tabData.toExport = this.exportGridData.bind(this);
    this.tabData.resetAllFilters = this.resetAllFilters.bind(this);
  }

  private printGridData() {
    const gridRef = <HTMLElement>document.getElementById(this.gridId);
    gridRef.style.width = '';
    gridRef.style.height = '';
    this.gridApi.setDomLayout('print');
    this.printService.printElement(gridRef).subscribe(() => {
      gridRef.style.width = '100%';
      gridRef.style.height = '100%';
      this.gridApi.setDomLayout();
    });
  }

  private exportGridData(format: string) {
    console.log('tabData', format);
  }

  private resetAllFilters() {
    if (this.gridApi) {
      this.gridApi.setFilterModel(null);
    }
  }
}

function prepareFilter(params: any): FilterModelItem[] {
  const keys = Object.keys(params);
  return keys.map((key) => {
    return {
      colId: key,
      value: params[key].filter,
      valueTo: params[key].filterTo,
      type: params[key].type,
      filterType: params[key].filterType,
      dateFrom: params[key].dateFrom,
      dateTo: params[key].dateTo,
    };
  });
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
