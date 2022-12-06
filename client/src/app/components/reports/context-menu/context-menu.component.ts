import { Component, OnInit } from '@angular/core';
import { ContextMenuAction, FilterModelItem } from '../../../shared/interfaces';
import { ClipboardService } from 'ngx-clipboard';
import { CellContextMenuEvent } from 'ag-grid-community';
import { CommonService } from '../../../shared/services/common.service';
import { ToolbarService } from '../../../shared/services/toolbar.service';
import { TabDataService } from '../../../shared/services/tab-data.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: 'context-menu.component.html',
  styleUrls: ['context-menu.component.less'],
})
export class ContextMenuComponent implements OnInit {
  contextValue: any;
  contextEvent: CellContextMenuEvent | undefined;

  actionType = ContextMenuAction;
  isFilterOn: boolean = false;

  constructor(
    private clipboardService: ClipboardService,
    private commonService: CommonService,
    private toolbarService: ToolbarService,
    private tabService: TabDataService
  ) {}

  ngOnInit() {
    this.commonService.getContextMenuEvent().subscribe((event) => {
      console.log('context event:', event);
      this.contextEvent = event.event;
      this.contextValue = event.event.value;
    });
  }

  clickContext(action: ContextMenuAction) {
    switch (action) {
      case ContextMenuAction.Copy:
        this.clipboardService.copy(this.contextValue);
        break;
      case ContextMenuAction.ExportExel:
        this.toolbarService.toExport('excel');
        break;
      case ContextMenuAction.Filter:
        if (this.contextEvent) {
          const filter: FilterModelItem = {
            colId: this.contextEvent.column.getColId(),
            value: this.contextEvent.value,
          };
          this.commonService.setContextFilter(filter);
          this.isFilterOn = true;
        }
        break;
      case ContextMenuAction.FilterOff:
        if (this.contextEvent) {
          const filter: FilterModelItem = {
            colId: this.contextEvent.column.getColId(),
            value: '',
          };
          this.commonService.setContextFilter(filter);
          this.isFilterOn = false;
        }
        break;
    }
  }
}
