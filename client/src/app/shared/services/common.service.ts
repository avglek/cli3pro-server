import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  ContextEvent,
  ContextMenuData,
  FilterModelItem,
  IContextData,
} from '../interfaces';
import { CellContextMenuEvent } from 'ag-grid-community';
import { AuthService } from './auth.service';
import { DataServerService } from './data-server.service';

@Injectable({ providedIn: 'root' })
export class CommonService {
  currentOwner: string = '';
  owner = new BehaviorSubject<string>('');
  contextFilter = new Subject<FilterModelItem>();
  contextMenuEvent = new Subject<ContextEvent>();

  constructor(
    private auth: AuthService,
    private dataService: DataServerService
  ) {}

  // getCurrentOwnerFromStorage(): string | null {
  //   return localStorage.getItem('owner');
  // }
  //
  // getCurrentOwner(): string | null {
  //   return this.currentOwner;
  // }
  //
  // changeOwner(owner: string) {
  //   console.log('chane owner:', owner);
  //   localStorage.setItem('owner', owner);
  //   this.currentOwner = owner;
  //   this.owner.next(owner);
  // }
  //
  // initCurrentOwner() {
  //   const owner = this.getCurrentOwner() || this.getCurrentOwnerFromStorage();
  //   if (owner) {
  //     this.changeOwner(owner);
  //   }
  // }

  setContextFilter(value: FilterModelItem) {
    this.contextFilter.next(value);
  }

  getContextFilter() {
    return this.contextFilter;
  }

  setContextMenuEvent(
    event: CellContextMenuEvent,
    context: IContextData[],
    parentId: number
  ) {
    this.contextMenuEvent.next({ event, context, parentId });
  }

  getContextMenuEvent() {
    return this.contextMenuEvent;
  }

  getContext(field: string, docId: number): Observable<ContextMenuData[]> {
    const roles = this.auth.getCurrentRoles() || ['oper'];
    return this.dataService.getContext(
      this.currentOwner,
      docId,
      field.toUpperCase(),
      roles
    );
  }
}
