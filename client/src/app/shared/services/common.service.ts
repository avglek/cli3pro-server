import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonService {
  currentOwner: string = '';
  owner = new BehaviorSubject<string>('');

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
}
