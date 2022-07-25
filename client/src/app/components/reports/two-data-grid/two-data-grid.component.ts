import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  FilterModelItem,
  FilterProcType,
  ITabData,
} from '../../../shared/interfaces';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
//import { CellContextMenuEvent } from 'ag-grid-community';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';
import { RowClickedEvent } from 'ag-grid-community';

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
  docCursorName: string = 'P_DOC';
  detailCursorName: string = 'P_DETAIL';
  linkFilter: FilterModelItem[] = [];

  private docLinkKey!: string;
  private detailLinkKey!: string;

  constructor(
    private nzContextMenuService: NzContextMenuService,
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

  changeDefaultContext($event: MouseEvent, menu: NzDropdownMenuComponent) {
    $event.preventDefault();
    this.nzContextMenuService.create($event, menu);
  }

  ngAfterViewInit(): void {}

  //Doc.Code=Detail.Code
  getDocLick($event: string) {
    const a1 = $event.split('=');
    this.docLinkKey = a1[0].trim().slice(a1[0].indexOf('.') + 1, a1[0].length);
    this.detailLinkKey = a1[1]
      .trim()
      .slice(a1[1].indexOf('.') + 1, a1[1].length);

    const key = 'code';
    const value = '0040';
    const type = FilterProcType.equals;
    const testFilter: FilterModelItem = {
      colId: key,
      value,
      type,
    };

    this.linkFilter.push(testFilter);
  }

  docRowClick($event: RowClickedEvent) {
    if ($event.data) {
      const keys = Object.keys($event.data);
      const searchField = keys.find(
        (f) => f.toUpperCase() === this.docLinkKey.toUpperCase()
      );
      if (searchField) {
        const docFilter: FilterModelItem = {
          colId: searchField,
          value: $event.data[searchField],
          type: FilterProcType.equals,
        };
        this.linkFilter = [docFilter];
      }
    }
  }
}
