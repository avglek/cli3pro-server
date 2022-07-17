import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import { ITabData } from '../../../shared/interfaces';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
//import { CellContextMenuEvent } from 'ag-grid-community';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';

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

  constructor(
    private nzContextMenuService: NzContextMenuService,
    private el: ElementRef
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
    console.log('event:', $event);
    $event.preventDefault();
    this.nzContextMenuService.create($event, menu);
  }

  // contextMenu($event: CellContextMenuEvent) {
  //   console.log('cell:', $event.value);
  //   this.clipboardContext = $event.value;
  // }

  ngAfterViewInit(): void {
    console.log(
      'size:',
      this.el.nativeElement,
      this.el.nativeElement.offsetWidth
    );
  }
}
