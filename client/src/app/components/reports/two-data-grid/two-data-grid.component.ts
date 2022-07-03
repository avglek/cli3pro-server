import { Component, Input, OnInit } from '@angular/core';
import { ITabData } from '../../../shared/interfaces';

@Component({
  selector: 'app-two-data-grid',
  templateUrl: './two-data-grid.component.html',
  styleUrls: ['./two-data-grid.component.less'],
})
export class TwoDataGridComponent implements OnInit {
  @Input() tabData!: ITabData;
  constructor() {}

  ngOnInit(): void {
    console.log('tab data:', this.tabData);
  }
}
