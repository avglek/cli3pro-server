import { Component, OnInit } from '@angular/core';
import { TabDataService } from '../../services/tab-data.service';
import { ITabData } from '../../interfaces';

@Component({
  selector: 'app-docs-layout',
  templateUrl: './docs-layout.component.html',
  styleUrls: ['./docs-layout.component.less'],
})
export class DocsLayoutComponent implements OnInit {
  tabs: ITabData[] = [];
  selectedIndex = 0;

  constructor(private dataService: TabDataService) {}

  ngOnInit(): void {
    console.log(this.dataService);
    this.tabs = this.dataService.getAll();
  }

  closeTab(event: { index: number }) {
    console.log('close', event.index);
    this.dataService.removeByIndex(event.index);
  }
}
