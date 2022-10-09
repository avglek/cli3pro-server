import { Component, OnInit } from '@angular/core';
import { ContextMenuAction, FilterModelItem } from '../../../shared/interfaces';
import { ClipboardService } from 'ngx-clipboard';
import { CellContextMenuEvent } from 'ag-grid-community';
import { CommonService } from '../../../shared/services/common.service';

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
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.commonService.getContextMenuEvent().subscribe((event) => {
      this.contextEvent = event;
      this.contextValue = event.value;
      console.log('context subject:', event);
    });
  }

  clickContext(action: ContextMenuAction) {
    switch (action) {
      case ContextMenuAction.Copy:
        this.clipboardService.copy(this.contextValue);
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
