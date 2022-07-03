import { Component, Input } from '@angular/core';
import { ContextMenuAction } from '../../../shared/interfaces';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-context-menu',
  templateUrl: 'context-menu.component.html',
  styleUrls: ['context-menu.component.less'],
})
export class ContextMenuComponent {
  @Input() contextValue: any;
  actionType = ContextMenuAction;

  constructor(private clipboardService: ClipboardService) {}

  clickContext(action: ContextMenuAction) {
    console.log(action);
    switch (action) {
      case ContextMenuAction.Copy:
        console.log('copy:', this.contextValue);
        this.clipboardService.copy(this.contextValue);
        break;
    }
  }
}
