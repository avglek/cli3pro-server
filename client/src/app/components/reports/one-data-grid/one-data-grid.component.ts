import { Component, Input, OnInit } from '@angular/core';
import { ITabData } from '../../../shared/interfaces';
import { TabDataService } from '../../../shared/services/tab-data.service';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-one-data-grid',
  templateUrl: './one-data-grid.component.html',
  styleUrls: ['./one-data-grid.component.less'],
})
export class OneDataGridComponent implements OnInit {
  @Input() tabData!: ITabData;
  @Input() isEdit!: boolean;

  cursorName!: string;

  constructor(
    private tabService: TabDataService,
    private nzContextMenuService: NzContextMenuService
  ) {
    this.cursorName = 'P_DOC';
  }

  ngOnInit(): void {}

  onRowCount($event: number) {
    if (this.tabData.uid)
      this.tabService.setDisplayRowCount(`${$event}`, this.tabData.uid);
  }

  changeDefaultContext($event: MouseEvent, menu: NzDropdownMenuComponent) {
    $event.preventDefault();
    this.nzContextMenuService.create($event, menu);
  }
}
