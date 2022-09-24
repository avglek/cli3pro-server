import { Component, Input } from '@angular/core';
import { ContextMenuAction, FilterModelItem } from '../../../shared/interfaces';
import { ClipboardService } from 'ngx-clipboard';
import { CellContextMenuEvent } from 'ag-grid-community';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: 'context-menu.component.html',
  styleUrls: ['context-menu.component.less'],
})
export class ContextMenuComponent {
  @Input() contextValue: any;
  @Input() contextEvent: CellContextMenuEvent | undefined;

  actionType = ContextMenuAction;

  constructor(
    private clipboardService: ClipboardService,
    private commonService: CommonService
  ) {}

  clickContext(action: ContextMenuAction) {
    switch (action) {
      case ContextMenuAction.Copy:
        this.clipboardService.copy(this.contextValue);
        break;
      case ContextMenuAction.Filter:
        console.log('filter on: ', this.contextEvent);
        if (this.contextEvent) {
          const filter: FilterModelItem = {
            colId: this.contextEvent.column.getColId(),
            value: this.contextEvent.value,
          };
          this.commonService.setContextFilter(filter);
        }
        break;
    }
  }
}
