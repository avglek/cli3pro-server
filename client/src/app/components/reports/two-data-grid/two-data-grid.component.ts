import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FilterModelItem, ITabData } from '../../../shared/interfaces';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import { CellContextMenuEvent, RowClickedEvent } from 'ag-grid-community';
import { TabDataService } from '../../../shared/services/tab-data.service';
import { toCamelCase } from '../../../shared/utils/str-utils';

@Component({
  selector: 'app-two-data-grid',
  templateUrl: './two-data-grid.component.html',
  styleUrls: ['./two-data-grid.component.less'],
})
export class TwoDataGridComponent implements OnInit, AfterViewInit {
  @Input() tabData!: ITabData;
  @Input() isVertical: boolean = false;

  contentHeight = 200;
  contentWidth = 500;
  id = -1;

  clipboardContext!: any;
  contextEvent: CellContextMenuEvent | undefined;
  docCursorName: string = 'P_DOC';
  detailCursorName: string = 'P_DETAIL';
  linkFilter: FilterModelItem[] = [];

  private docLinkKey!: string;
  private detailLinkKey!: string;

  private masterRowCount: number = 0;
  private slaveRowCount: number = 0;

  constructor(
    private nzContextMenuService: NzContextMenuService,
    private tabService: TabDataService
  ) {}

  ngOnInit(): void {}

  onContentResizeHeight({ height }: NzResizeEvent) {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.contentHeight = height!;
    });
  }

  onContentResizeWidth({ width }: NzResizeEvent) {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.contentWidth = width!;
    });
  }

  changeDefaultContext($event: any, menu: NzDropdownMenuComponent) {
    $event.preventDefault();
    this.nzContextMenuService.create($event, menu);
  }

  ngAfterViewInit(): void {}

  // Doc.Code=Detail.Code
  getDocLink($event: string) {
    const a1 = $event.split('=');
    this.docLinkKey = a1[0].trim().slice(a1[0].indexOf('.') + 1, a1[0].length);
    this.detailLinkKey = a1[1]
      .trim()
      .slice(a1[1].indexOf('.') + 1, a1[1].length);

    // const key = 'code';
    // const value = '0040';
    // const type = 'equals';
    // const testFilter: FilterModelItem = {
    //   colId: key,
    //   value,
    //   type,
    // };
    //
    // this.linkFilter.push(testFilter);
  }

  docRowClick($event: RowClickedEvent) {
    if ($event.data) {
      const keys = Object.keys($event.data);

      const detailKeys = this.detailLinkKey
        .split(';')
        .map((key) => toCamelCase(key));

      const docKeys = this.docLinkKey.split(';').map((key) => toCamelCase(key));

      const searchFields = keys.filter((key) => docKeys.includes(key));

      this.linkFilter = searchFields.map((col) => {
        const colDef = <any>$event.columnApi.getColumn(col)?.getColDef();
        const type = colDef.fieldType;
        const colDocIndex = docKeys.indexOf(col);

        switch (type) {
          case 'NUMBER':
            return {
              colId: detailKeys[colDocIndex].trim(),
              value: $event.data[col],
              type: 'equals',
              filterType: 'number',
            };
          case 'DATE':
            return {
              colId: detailKeys[colDocIndex].trim(),
              value: $event.data[col],
              type: 'equals',
              filterType: 'date',
            };
          default:
            return {
              colId: detailKeys[colDocIndex].trim(),
              value: $event.data[col],
              type: 'equals',
              filterType: 'text',
            };
        }
      });
    }
  }

  onMasterRowCount($event: number) {
    this.masterRowCount = $event;
    const displayCount = `${this.masterRowCount}/${this.slaveRowCount}`;
    if (this.tabData.uid)
      this.tabService.setDisplayRowCount(displayCount, this.tabData.uid);
  }

  onSlaveRowCount($event: number) {
    this.slaveRowCount = $event;
    const displayCount = `${this.masterRowCount}/${this.slaveRowCount}`;

    if (this.tabData.uid)
      this.tabService.setDisplayRowCount(displayCount, this.tabData.uid);
  }
}
