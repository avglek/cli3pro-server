import { Component, OnInit } from '@angular/core';
import { TabDataService } from '../../services/tab-data.service';
import { ITabData } from '../../interfaces';
import { Location } from '@angular/common';

@Component({
  selector: 'app-docs-layout',
  templateUrl: './docs-layout.component.html',
  styleUrls: ['./docs-layout.component.less'],
})
export class DocsLayoutComponent implements OnInit {
  tabs: ITabData[] = [];
  selectedIndex = 0;

  constructor(
    private dataService: TabDataService,
    private location: Location
  ) {}

  ngOnInit(): void {
    console.log(this.dataService);
    this.tabs = this.dataService.getAll();
    this.selectedIndex = this.tabs.length;
  }

  closeTab(event: { index: number }) {
    console.log('close', event.index, this.tabs.length);
    this.dataService.removeByIndex(event.index);
    if (this.tabs.length === 0) {
      this.location.back();
    }
  }
}
