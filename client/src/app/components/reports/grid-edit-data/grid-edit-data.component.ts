import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  ICursorData,
  IProcParam,
  IStringData,
  ITabData,
} from '../../../shared/interfaces';
import { Subscription } from 'rxjs';
import { DataServerService } from '../../../shared/services/data-server.service';
import {
  CellContextMenuEvent,
  ColDef,
  GridReadyEvent,
  RowClickedEvent,
} from 'ag-grid-community';
import { AG_GRID_LOCALE_RU } from '../../../shared/locale/locale-ru';
import { GridLoadingComponent } from '../grid-data/grid-loading.component';
import { GridNoRowsComponent } from '../grid-data/grid-no-rows.component';

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
  private cursorName: string = 'P_DOC';
  private updateTableName: string | undefined;

  defaultColDef = {
    resizable: true,
    cellStyle: { borderRight: '1px solid #dfdfdf' },
    sortable: true,
    floatingFilter: false,
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
  private gridApi: any;

  constructor(private dataService: DataServerService) {}

  ngOnInit(): void {
    console.log('tab data:', this.tabData);
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
      this.isLoading = true;
      this.docSub = this.dataService
        .procExecute(
          this.tabData.owner!,
          this.tabData.procName!,
          this.procParams,
          this.tabData.uid!,
          this.tabData.docId!
        )
        .subscribe((data) => {
          console.log('data:', data);
          this.isLoading = false;
          if (this.gridApi) this.gridApi.hideOverlay();

          if (data.data) {
            //     const keys = Object.keys(data.data);
            const stringDbData = <IStringData>data.data['P_UPDATE_TABLE'];
            this.updateTableName = stringDbData.data;
            const docData = <ICursorData>data.data[this.cursorName];
            console.log('doc data:', docData);
            this.columnDefs = docData.fields
              .sort((a, b) => a.order - b.order)
              .map((field) => {
                const col: ColDef = {
                  headerName: field.displayLabel,
                  field: field.fieldName,
                  width: field.displaySize
                    ? field.displaySize * 10 + 20
                    : undefined,
                };
                return col;
              });
            this.rowCount.emit(docData.count);
            if (docData.rows.length === 0) {
              this.gridApi.showNoRowsOverlay();
            } else {
              this.rowData = docData.rows;
            }
          }

          //this.columnDefs = data.data
        });
    }
  }

  ngOnDestroy(): void {
    if (this.docSub) {
      this.docSub.unsubscribe();
      this.docSub = undefined;
    }
  }

  onGridReady(param: GridReadyEvent) {
    this.gridApi = param.api;
  }

  contextMenu($event: CellContextMenuEvent) {}

  onRowClick($event: RowClickedEvent) {}

  onAddRow() {
    console.log('add rows');
  }
}
