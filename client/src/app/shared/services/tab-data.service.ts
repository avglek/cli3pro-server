import { Injectable } from '@angular/core';
import { ITabData } from '../interfaces';
import { customAlphabet } from 'nanoid';
import { BehaviorSubject, Observable } from 'rxjs';

const nanoid = customAlphabet('ABCDEF0987654321', 8);

@Injectable({
  providedIn: 'root',
})
export class TabDataService {
  tabs: ITabData[] = [];
  currentIndex: number = -1;

  subject = new BehaviorSubject(0);

  add(tab: ITabData): string {
    tab.uid = nanoid();
    this.tabs.push(tab);
    this.currentIndex++;
    this.subject.next(this.currentIndex);
    return tab.uid;
  }

  getAll(): ITabData[] {
    return this.tabs;
  }

  removeByIndex(index: number): boolean {
    if (index < 0 || index > this.tabs.length - 1) {
      return false;
    }
    this.tabs.splice(index, 1);
    if (this.currentIndex >= this.tabs.length) {
      this.currentIndex = this.tabs.length - 1;
    }
    return true;
  }

  update(tab: ITabData) {
    if (this.tabs.length > 0) {
      const index = this.tabs.findIndex((i) => i.uid === tab.uid);
      if (index >= 0) {
        const item = { ...this.tabs[index], ...tab };
        this.tabs.splice(index, 1, item);
      }
      this.subject.next(this.currentIndex);
    }
  }

  setCurrentIndex(index: number) {
    this.currentIndex = index;
    this.subject.next(index);
  }

  getCurrentTab(): Observable<ITabData> {
    return new Observable((subscriber) => {
      this.subject.subscribe({
        next: (index) => {
          subscriber.next(this.tabs[index]);
        },
        error: (err) => {
          subscriber.error(err);
        },
      });
    });
  }

  setDisplayRowCount(rowCount: string, uid: string) {
    const tab = this.tabs.find((tab) => tab.uid === uid);
    if (tab) {
      tab.statusRowCount = rowCount;
      this.refresh();
    }
  }

  refresh() {
    this.subject.next(this.currentIndex);
  }
}
