import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  IProcParam,
  ITabData,
  TypeUpdateMarker,
  UICellEditType,
  UICellRenderType,
} from '../../../shared/interfaces';
import { Subscription } from 'rxjs';
import { DataServerService } from '../../../shared/services/data-server.service';
import {
  CellContextMenuEvent,
  ColDef,
  ColumnApi,
  GetRowIdFunc,
  GridApi,
  GridReadyEvent,
  RowClickedEvent,
} from 'ag-grid-community';
import { AG_GRID_LOCALE_RU } from '../../../shared/locale/locale-ru';
import { GridLoadingComponent } from '../grid-data/grid-loading.component';
import { GridNoRowsComponent } from '../grid-data/grid-no-rows.component';
import { TabDataService } from '../../../shared/services/tab-data.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { customAlphabet } from 'nanoid';
import {
  UiCellCheckEditComponent,
  UiCellCheckRenderComponent,
} from './custom-cell';
import { UiCellSelectRenderComponent } from './custom-cell/ui-cell-select/ui-cell-select-render.component';
import { EditDataService } from '../../../shared/services/edit-data.service';
import { parseAndCamelCase } from '../../../shared/utils/str-utils';
import { UiCellSimpleSelectRenderComponent } from './custom-cell/ui-cell-simple-select/ui-cell-simple-select-render.component';
import { UiCellSelectEditComponent } from './custom-cell/ui-cell-select/ui-cell-select-edit.component';
import { UiCellSimpleSelectEditComponent } from './custom-cell/ui-cell-simple-select/ui-cell-simple-select-edit.component';
import { dataFormatter } from '../../../shared/utils/grid-utils';
import { UiCellInputRenderComponent } from './custom-cell/ui-cell-input/ui-cell-input-render.component';

const nanoid = customAlphabet('ABCDEF0987654321', 16);

@Component({
  selector: 'app-grid-edit-data',
  templateUrl: './grid-edit-data.component.html',
  styleUrls: ['./grid-edit-data.component.less'],
})
export class GridEditDataComponent implements OnInit, OnDestroy {
  @Input() tabData!: ITabData;

  @Output() rowCount: EventEmitter<number> = new EventEmitter<number>();

  private docSub: Subscription | undefined;
  private procParams: IProcParam[] = [];
  //  private cursorName: string = 'P_DOC';
  //  private updateTableName: string | undefined;

  private gridApi: GridApi | undefined;
  private gridColumnApi: ColumnApi | undefined;

  defaultColDef = {
    resizable: true,
    cellStyle: { borderRight: '1px solid #dfdfdf' },
    cellClass: 'cell-render',
    sortable: true,
    floatingFilter: false,
    editable: true,
  };
  gridId: any;
  locale = AG_GRID_LOCALE_RU;

  loadingOverlayComponent: any = GridLoadingComponent;
  loadingOverlayComponentParams: any = {
    loadingMessage: 'One moment please...',
  };
  noRowsOverlayComponent: any = GridNoRowsComponent;
  noRowsOverlayComponentParams: any = {
    noRowsMessageFunc: () => 'Sorry - no rows! at: ' + new Date(),
  };

  columnDefs: ColDef[] = [];
  rowData: any;
  private isLoading: boolean = false;
  getRowId: GetRowIdFunc;

  components: any = {
    UICellCheckBoxRender: UiCellCheckRenderComponent,
    UICellCheckBoxEdit: UiCellCheckEditComponent,
    UICellSelectRender: UiCellSelectRenderComponent,
    UICellSimpleSelectRender: UiCellSimpleSelectRenderComponent,
    UICellSelectEdit: UiCellSelectEditComponent,
    UICellSimpleSelectEdit: UiCellSimpleSelectEditComponent,
    UICellInputRender: UiCellInputRenderComponent,
  };

  constructor(
    private dataService: DataServerService,
    private tabService: TabDataService,
    private notification: NzNotificationService,
    private editDataService: EditDataService
  ) {
    this.getRowId = (params) => params.data.uid;
  }

  ngOnInit(): void {
    if (!this.tabData.isLoading) {
      this.loadData();
    }
    this.initToolBoxAction();
  }

  initToolBoxAction() {
    this.tabData.onAddRow = this.onAddRow.bind(this);
    this.tabData.onRemoveRows = this.onRemoveRows.bind(this);
    this.tabData.onSaveData = this.onSaveData.bind(this);
  }

  loadData() {
    this.tabService.setLoadData(this.tabData.uid, true);
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
    this.isLoading = true;

    this.docSub = this.editDataService
      .getWithLookTable(
        this.tabData.owner!,
        this.tabData.procName!,
        this.procParams,
        this.tabData.uid!,
        this.tabData.docId!
      )
      .subscribe((lookData) => {
        this.isLoading = false;
        this.tabService.setLoadData(this.tabData.uid, false);
        if (this.gridApi) this.gridApi.hideOverlay();

        const docData = this.editDataService.data;

        if (docData) {
          this.columnDefs = docData.fields
            .sort((a, b) => a.order - b.order)
            .map((field) => {
              const col: ColDef = {
                headerName: field.displayLabel,
                field: field.fieldName,
                width: field.displaySize
                  ? field.displaySize * 10 + 20
                  : undefined,
                cellRenderer: UICellRenderType[field.controlType!],
                cellEditor: UICellEditType[field.controlType!],
                valueFormatter: (params: any) =>
                  dataFormatter(params, field.displayFormat, field.dbTypeName),
              };

              if (field.controlType === 3) {
                Object.assign(col, {
                  cellEditorParams: {
                    fieldName: field.fieldName,
                    lookData: lookData[field.fieldName!],
                    lookupKeyfields: parseAndCamelCase(field.lookupKeyfields),
                    lookupResultfield: parseAndCamelCase(
                      field.lookupResultfield
                    ),
                    lookupDisplayfields: parseAndCamelCase(
                      field.lookupDisplayfields
                    ),
                  },
                  cellRendererParams: {
                    fieldName: field.fieldName,
                    lookData: lookData[field.fieldName!],
                    lookupKeyfields: parseAndCamelCase(field.lookupKeyfields),
                    lookupResultfield: parseAndCamelCase(
                      field.lookupResultfield
                    ),
                    lookupDisplayfields: parseAndCamelCase(
                      field.lookupDisplayfields
                    ),
                  },
                });
              }
              if (field.controlType === 2) {
                Object.assign(col, {
                  cellRendererParams: {
                    itemList: field.itemList,
                  },
                  cellEditorParams: {
                    itemList: field.itemList,
                  },
                });
              }
              return col;
            });
          this.rowCount.emit(docData.count);
          if (docData.rows.length === 0) {
            this.gridApi!.showNoRowsOverlay();
          } else {
            this.rowData = this.prepareData(docData.rows);
          }
        }
      });
  }

  getLookData(itemList: string | null | undefined): {
    count: number;
    data: any[];
  } {
    if (!itemList) {
      return {
        count: 0,
        data: [],
      };
    }

    return {
      count: 0,
      data: [],
    };
  }

  prepareData(rows: any): any {
    return rows.map((row: any) => {
      return { ...row, uid: nanoid(), marker: TypeUpdateMarker.None };
    });
  }

  ngOnDestroy(): void {
    if (this.docSub) {
      this.docSub.unsubscribe();
      this.docSub = undefined;
    }
  }

  onGridReady(param: GridReadyEvent) {
    this.gridApi = param.api;
    this.gridColumnApi = param.columnApi;
  }

  contextMenu($event: CellContextMenuEvent) {}

  onRowClick($event: RowClickedEvent) {}

  onAddRow() {
    if (!this.gridApi) {
      return;
    }
    this.tabService.setChangesData(this.tabData.uid, true);
    const colDef = this.gridApi.getColumnDefs();
    if (colDef) {
      const objRow = colDef.reduce((acc: any, col: ColDef) => {
        return Object.assign(acc, { [col.field!]: '' });
      }, {});

      this.gridApi.applyTransaction({
        add: [{ ...objRow, uid: nanoid(), marker: TypeUpdateMarker.Add }],
      });
    }
  }

  onRemoveRows() {
    if (!this.gridApi) {
      return;
    }
    const selectedData = this.gridApi.getSelectedRows();
    if (selectedData.length > 0) {
      this.gridApi.applyTransaction({ remove: selectedData });
      this.tabService.setChangesData(this.tabData.uid, true);
    } else {
      this.notification.create(
        'warning',
        'Ошибка, нет строк для удаления',
        'Выделите строки, которые нужно удалить'
      );
    }
  }

  onSaveData() {
    this.tabService.setChangesData(this.tabData.uid, false);
  }
}
