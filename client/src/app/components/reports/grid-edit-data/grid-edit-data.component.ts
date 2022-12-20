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
  NewValueParams,
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

export interface IRowEdit {
  [key: string]: any;
  _uid: string;
  _marker: TypeUpdateMarker;
}

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
  rowData: IRowEdit[] | undefined;
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
    this.getRowId = (params) => params.data._uid;
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
            .filter((field) => field.visible === 'T')
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
                onCellValueChanged: this.cellValueChanged.bind(this),
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
            this.rowData = <IRowEdit[]>this.prepareData(docData.rows);
            this.gridApi?.setRowData(this.rowData);
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
      return { ...row, _uid: nanoid(), _marker: TypeUpdateMarker.None };
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

      const uid = nanoid();
      const row = <IRowEdit>{
        ...objRow,
        _uid: uid,
        _marker: TypeUpdateMarker.Add,
      };

      this.gridApi.applyTransaction({
        add: [row],
      });
      if (this.rowData) this.rowData.push(row);

      const rowNode = this.gridApi.getRowNode(uid);

      this.gridApi.ensureNodeVisible(rowNode, 'bottom');
    }
  }

  onRemoveRows() {
    if (!this.gridApi || !this.rowData) {
      return;
    }
    const selectedData = this.gridApi.getSelectedRows();
    if (selectedData.length > 0) {
      const data: IRowEdit[] = this.rowData.map((row) => {
        const result = { ...row };
        if (selectedData.find((i) => i._uid === row._uid)) {
          if (row._marker === TypeUpdateMarker.Add) {
            result._uid = '0';
          } else {
            result._marker = TypeUpdateMarker.Remove;
          }
        }
        return result;
      });

      this.rowData = data.filter((row) => row._uid !== '0');

      if (this.rowData.find((row) => row._marker !== TypeUpdateMarker.None)) {
        this.tabService.setChangesData(this.tabData.uid, true);
      } else {
        this.tabService.setChangesData(this.tabData.uid, false);
      }
    } else {
      this.notification.create(
        'warning',
        'Ошибка, нет строк для удаления',
        'Выделите строки, которые нужно удалить'
      );
    }
  }

  cellValueChanged(event: NewValueParams) {
    console.log('event:', event);
    if (event.data._marker === TypeUpdateMarker.None)
      event.data._marker = TypeUpdateMarker.Update;
    this.tabService.setChangesData(this.tabData.uid, true);
  }

  onSaveData() {
    if (!this.rowData) {
      return;
    }

    this.tabService.setChangesData(this.tabData.uid, false);

    const changedData = this.rowData.filter(
      (row) =>
        row._marker === TypeUpdateMarker.Update ||
        row._marker === TypeUpdateMarker.Remove ||
        row._marker === TypeUpdateMarker.Add
    );

    console.log('save data:', changedData);
  }

  getRowData() {
    if (this.rowData)
      return this.rowData.filter(
        (row) => row._marker !== TypeUpdateMarker.Remove
      );
    else return [];
  }
}
