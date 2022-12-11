import { Component, OnInit } from '@angular/core';
import {
  ContextMenu,
  ContextMenuAction,
  FilterModelItem,
} from '../../../shared/interfaces';
import { ClipboardService } from 'ngx-clipboard';
import { CellContextMenuEvent } from 'ag-grid-community';
import { CommonService } from '../../../shared/services/common.service';
import { ToolbarService } from '../../../shared/services/toolbar.service';
import { DocumentService } from '../../../shared/services/document.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: 'context-menu.component.html',
  styleUrls: ['context-menu.component.less'],
})
export class ContextMenuComponent implements OnInit {
  contextValue: any;
  contextEvent: CellContextMenuEvent | undefined;
  menu: ContextMenu[] = [];
  parentId: number | undefined;

  //actionType = ContextMenuAction;
  isFilterOn: boolean = false;

  defaultMenu: ContextMenu[] = [
    {
      title: 'Копировать',
      icon: 'copy',
      action: ContextMenuAction.Copy,
    },
    { title: 'divider' },
    {
      title: 'Фильтр по выделенному',
      icon: 'filter',
      action: ContextMenuAction.Filter,
    },
    {
      title: 'Сбросить фильтр',
      icon: 'undo',
      action: ContextMenuAction.FilterOff,
    },
  ];

  constructor(
    private clipboardService: ClipboardService,
    private commonService: CommonService,
    private toolbarService: ToolbarService,
    private documentService: DocumentService
  ) {}

  ngOnInit() {
    this.commonService.getContextMenuEvent().subscribe((event) => {
      this.menu = [];
      this.contextEvent = event.event;
      this.contextValue = event.event.value;
      this.parentId = event.parentId;
      const customMenu: ContextMenu[] = event.context
        .filter((context) => {
          return (
            context.fieldName === event.event.column.getColId().toUpperCase() &&
            context.docId !== 86
          );
        })
        .map((item) => ({
          title: item.docName,
          docId: item.docId,
          action: ContextMenuAction.Custom,
        }));

      if (customMenu.length > 0) {
        this.menu.push(
          ...this.defaultMenu,
          { title: 'divider' },
          ...(customMenu || [])
        );
      } else {
        this.menu.push(...this.defaultMenu);
      }
    });
  }

  clickContext(context: ContextMenu) {
    switch (context.action) {
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
      case ContextMenuAction.Custom:
        if (this.contextValue && context.docId && this.contextEvent) {
          const colId = this.contextEvent.column.getColId();
          this.documentService.openNew(
            context.docId,
            colId,
            this.contextEvent.data,
            this.parentId
          );
        }
        break;
    }
  }
}
