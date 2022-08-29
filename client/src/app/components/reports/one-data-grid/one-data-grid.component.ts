import { Component, Input, OnInit } from '@angular/core';
import { ITabData } from '../../../shared/interfaces';
import { TabDataService } from '../../../shared/services/tab-data.service';

@Component({
  selector: 'app-one-data-grid',
  templateUrl: './one-data-grid.component.html',
  styleUrls: ['./one-data-grid.component.less'],
})
export class OneDataGridComponent implements OnInit {
  @Input() tabData!: ITabData;

  cursorName!: string;

  constructor(private tabService: TabDataService) {
    this.cursorName = 'P_DOC';
  }

  ngOnInit(): void {}

  onRowCount($event: number) {
    if (this.tabData.uid)
      this.tabService.setDisplayRowCount(`${$event}`, this.tabData.uid);
  }
}
