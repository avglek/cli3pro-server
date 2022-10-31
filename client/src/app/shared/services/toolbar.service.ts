import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { TabDataService } from './tab-data.service';
import { ITabData } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  btnFilter = new BehaviorSubject<boolean>(false);
  btnExportTo = new Subject<string>();

  currentTabs!: ITabData;

  constructor(private tabService: TabDataService) {
    tabService.getCurrent().subscribe((tab) => {
      this.currentTabs = tab;
    });
  }

  toExport(format: string) {
    if (this.currentTabs && this.currentTabs.toExport) {
      this.currentTabs.toExport(format);
    }
  }

  toPrint() {
    if (this.currentTabs && this.currentTabs.toPrint) {
      this.currentTabs.toPrint();
    }
  }

  resetAllFilters() {
    if (this.currentTabs && this.currentTabs.resetAllFilters) {
      this.currentTabs.resetAllFilters();
    }
  }

  onSaveData() {
    if (this.currentTabs && this.currentTabs.onSaveData) {
      this.currentTabs.onSaveData();
    }
  }

  onAddRow() {
    if (this.currentTabs && this.currentTabs.onAddRow) {
      this.currentTabs.onAddRow();
    }
  }

  onRemoveRows() {
    if (this.currentTabs && this.currentTabs.onRemoveRows) {
      this.currentTabs.onRemoveRows();
    }
  }
}
