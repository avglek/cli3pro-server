import { Component, Input, OnInit } from '@angular/core';
import { ITabData } from '../../../shared/interfaces';

@Component({
  selector: 'app-one-data-grid',
  templateUrl: './one-data-grid.component.html',
  styleUrls: ['./one-data-grid.component.less'],
})
export class OneDataGridComponent implements OnInit {
  @Input() tabData!: ITabData;
  cursorName!: string;

  constructor() {
    this.cursorName = 'P_DOC';
  }

  ngOnInit(): void {}
}
