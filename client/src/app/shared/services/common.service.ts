import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { FilterModelItem } from '../interfaces';
import { CellContextMenuEvent } from 'ag-grid-community';

@Injectable({ providedIn: 'root' })
export class CommonService {
  currentOwner: string = '';
  owner = new BehaviorSubject<string>('');
  contextFilter = new Subject<FilterModelItem>();
  contextMenuEvent = new Subject<CellContextMenuEvent>();

  getCurrentOwnerFromStorage(): string | null {
    return localStorage.getItem('owner');
  }

  getCurrentOwner(): string | null {
    return this.currentOwner;
  }

  changeOwner(owner: string) {
    localStorage.setItem('owner', owner);
    this.currentOwner = owner;
    this.owner.next(owner);
  }

  initCurrentOwner() {
    const owner = this.getCurrentOwner() || this.getCurrentOwnerFromStorage();
    if (owner) {
      this.changeOwner(owner);
    }
  }

  setContextFilter(value: FilterModelItem) {
    this.contextFilter.next(value);
  }

  getContextFilter() {
    return this.contextFilter;
  }

  setContextMenuEvent(event: CellContextMenuEvent) {
    this.contextMenuEvent.next(event);
  }

  getContextMenuEvent() {
    return this.contextMenuEvent;
  }
}
