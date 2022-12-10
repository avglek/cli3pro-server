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
  CellClassParams,
  CellContextMenuEvent,
  CellStyle,
  ColDef,
  ColGroupDef,
  ColumnApi,
  DateFilter,
  GridApi,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  NumberFilter,
  RowClickedEvent,
  TextFilter,
} from 'ag-grid-community';
import {
  FilterModelItem,
  IContextData,
  ICursorData,
  IField,
  IProcParam,
  IStringData,
  IStyle,
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
import { TabDataService } from '../../../shared/services/tab-data.service';
import {
  addFontStyle,
  dataFormatter,
  parseColor,
  prepareFilter,
} from '../../../shared/utils/grid-utils';
import { ExportService } from '../../../shared/services/export.service';

@Component({
  selector: 'app-grid-data',
  templateUrl: './grid-data.component.html',
  styleUrls: ['./grid-data.component.less'],
})
export class GridDataComponent implements OnInit, OnChanges, OnDestroy {
  @Input() tabData!: ITabData;
  @Input() cursorName!: string;
  @Input() linkFilter: FilterModelItem[] = [];
  @Output() docLink: EventEmitter<string> = new EventEmitter<string>();
  @Output() setRowCount: EventEmitter<number> = new EventEmitter<number>();
  @Output() rowClick: EventEmitter<RowClickedEvent> =
    new EventEmitter<RowClickedEvent>();

  gridApi: GridApi | undefined;
  gridColumnApi: ColumnApi | undefined;
  gridId = 'dataGrid';
  procParams: IProcParam[] = [];
  rowSelection = 'single';
  rowModelType: any = 'infinite';
  cacheBlockSize = 50;
  cacheOverflowSize = 3;
  isLoading = false;
  docSub: Subscription | undefined;
  filesSub: Subscription | undefined;
  onFloatingFilter: Subscription | undefined;
  locale = AG_GRID_LOCALE_RU;
  rowCount: number = 0;

  clipboardContext!: any;
  contextEvent: CellContextMenuEvent | undefined = undefined;
  context: IContextData[] | undefined;

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    floatingFilter: false,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    filterParams: {
      suppressAndOrCondition: true,
    },
  };

  constructor(
    private dataService: DataServerService,
    private nzContextMenuService: NzContextMenuService,
    private commonService: CommonService,
    private toolBarService: ToolbarService,
    private printService: PrintService,
    private tabService: TabDataService,
    private exportService: ExportService
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
    if (this.filesSub) {
      this.filesSub.unsubscribe();
      this.filesSub = undefined;
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
          if (filterInstance instanceof NumberFilter) {
            filterInstance.setModel({
              filterType: 'number',
              type: 'equals',
              filter: <number>filter.value,
            });
          }
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
      }
      if (this.linkFilter.length > 0) {
        allFilter.push(...this.linkFilter);
      }

      if (this.tabData.isLoading) {
        return;
      }
      if (!this.tabData.owner) {
        return;
      }

      this.isLoading = true;
      this.gridApi?.showLoadingOverlay();
      this.tabService.setLoadData(this.tabData.uid, true);
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
          this.gridApi?.hideOverlay();
          this.tabService.setLoadData(this.tabData.uid, false);
          const link = <IStringData>data.data['P_LINKS'];
          if (link) {
            this.docLink.emit(link.data);
          }
          if (data.data) {
            //     const keys = Object.keys(data.data);
            const docData = <ICursorData>data.data[this.cursorName];
            this.context = docData.context;
            this.rowCount = docData.count;
            this.setRowCount.emit(docData.count);
            if (docData.rows.length === 0) {
              this.gridApi?.showNoRowsOverlay();
            }
            params.successCallback(docData.rows, docData.count);
            if (docData.fields) {
              const columns = <any[]>docData.fields
                .sort((a, b) => a.order - b.order)
                .map((col) => {
                  const refColumnDef = {
                    field: col.fieldName,
                    headerName: col.displayLabel,
                    headerTooltip: col.displayLabel,
                    fieldType: col.dbTypeName,
                    visible: col.visible,
                    hide: col.visible !== 'T',
                    width: col.displaySize
                      ? col.displaySize * 10 + 20
                      : undefined,
                    valueFormatter: (params: any) =>
                      dataFormatter(params, col.displayFormat, col.dbTypeName),
                    cellStyle: (params: CellClassParams) =>
                      this.getCellStyle(params, docData.styles),
                  };
                  this.setColumFilter(refColumnDef, col);

                  return refColumnDef;
                });

              if (this.gridApi) {
                this.gridApi.setColumnDefs(this.groupColumns(columns));
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
    this.commonService.setContextMenuEvent(
      $event,
      this.context || [],
      this.tabData.docId || 0
    );
  }

  onRowClick($event: RowClickedEvent) {
    this.rowClick.emit($event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['linkFilter'] && !this.tabData.isLoading) {
      if (this.gridApi) {
        this.gridApi.setDatasource(this.dataSource);
      }
    }
  }

  private groupColumns(columns: ColDef[]): (ColDef | ColGroupDef)[] {
    const groupColumns: (ColDef | ColGroupDef)[] = [];
    columns.forEach((col) => {
      if (col.headerName) {
        const indexGroup = col.headerName!.indexOf('|');

        if (indexGroup < 0) {
          groupColumns.push(col);
        } else {
          const nameGroup = col.headerName.slice(0, indexGroup);
          let findGroup = <ColGroupDef>(
            groupColumns.find((col) => col.headerName === nameGroup)
          );
          const child: ColDef = {
            ...col,
            headerName: col.headerName.slice(
              indexGroup + 1,
              col.headerName.length
            ),
          };

          if (findGroup) {
            findGroup.children.push(child);
          } else {
            findGroup = {
              headerName: nameGroup,
              children: [child],
            };
            groupColumns.push(findGroup);
          }
        }
      } else {
        groupColumns.push(col);
      }
    });
    return groupColumns;
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
  }

  initToolbarSubject() {
    this.onFloatingFilter = this.toolBarService.btnFilter.subscribe(
      (onFilter) => {
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
    this.exportGridData('print');
  }

  private exportGridData(format: string) {
    const exportParams = this.procParams.map((param) => {
      if (param.name === this.cursorName) {
        param.start = 0;
        param.end = this.rowCount;
      }
      return param;
    });

    this.filesSub = this.dataService
      .procExecute(
        this.tabData.owner!,
        this.tabData.procName!,
        exportParams,
        this.tabData.uid!,
        this.tabData.docId!
      )
      .subscribe((data) => {
        const keys = Object.keys(data.data);

        const keysCursorData = keys.filter((item) => {
          return data.data[item].type === 'cursor';
        });

        switch (format) {
          case 'excel':
            this.exportService
              .toExcel(
                <ICursorData>data.data[keysCursorData[0]],
                this.tabData.title
              )
              .then();
            break;
          case 'pdf':
            this.exportService.toPdf(
              <ICursorData>data.data[keysCursorData[0]],
              this.tabData.title
            );
            break;
          case 'print':
            this.exportService.printPdf(
              <ICursorData>data.data[keysCursorData[0]],
              this.tabData.title
            );
            break;
          case 'csv':
            this.exportService
              .toCsv(
                <ICursorData>data.data[keysCursorData[0]],
                this.tabData.title
              )
              .then();
            break;
        }
      });
  }

  private resetAllFilters() {
    if (this.gridApi) {
      this.gridApi.setFilterModel(null);
    }
  }

  private getCellStyle(
    params: CellClassParams,
    style: IStyle[]
  ): CellStyle | null | undefined {
    if (!params.data) {
      return null;
    }
    let styleObj: CellStyle | null = null;
    const keys = Object.keys(params.data);
    const styleCellKeys = keys.filter((key) => key.includes('style'));
    if (styleCellKeys) {
      styleCellKeys.forEach((styleCellKey) => {
        const styleCellName = params.data[styleCellKey];
        if (styleCellName) {
          const currentStyle = style.find((s) => s.styleName === styleCellName);
          if (currentStyle && styleCellKey === 'style') {
            styleObj = {
              color: parseColor(currentStyle.color),
              background: parseColor(currentStyle.bkColor),
            };
            Object.assign(styleObj, addFontStyle(currentStyle.options));
          }
          if (
            currentStyle &&
            params.column.getColId().toUpperCase() ===
              styleCellKey.slice(5).toUpperCase()
          ) {
            styleObj = {
              color: parseColor(currentStyle.color),
              background: parseColor(currentStyle.bkColor),
            };
            Object.assign(styleObj, addFontStyle(currentStyle.options));
          }
        }
      });
    }

    return styleObj;
  }
}
