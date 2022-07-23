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
    private tabDataService: TabDataService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.tabs = this.tabDataService.getAll();
    this.selectedIndex = this.tabs.length;
  }

  closeTab(event: { index: number }) {
    this.tabDataService.removeByIndex(event.index);
    if (this.tabs.length === 0) {
      this.location.back();
    }
  }

  onChangeIndex($event: number) {
    this.tabDataService.setCurrentIndex($event);
  }
}
