import { Injectable } from '@angular/core';
import { ITabData } from '../interfaces';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('ABCDEF0987654321', 8);

@Injectable({
  providedIn: 'root',
})
export class TabDataService {
  tabs: ITabData[] = [];

  add(tab: ITabData): string {
    console.log('add:', tab);
    tab.uid = nanoid();
    this.tabs.push(tab);
    return tab.uid;
  }

  getAll(): ITabData[] {
    return this.tabs;
  }

  removeById(uid: string): boolean {
    const index = this.tabs.findIndex((i) => i.uid === uid);
    if (index < 0) {
      return false;
    }
    this.tabs.splice(index, 1);
    return true;
  }

  removeByIndex(index: number): boolean {
    if (index < 0 || index > this.tabs.length - 1) {
      return false;
    }
    this.tabs.splice(index, 1);
    return true;
  }
}
