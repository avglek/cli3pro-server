import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Common {
  owner!: string;

  constructor() {
    this.owner = 'sevstal_ch';
  }
}
