import { Component, OnInit } from '@angular/core';
import { TabDataService } from '../../shared/services/tab-data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less'],
})
export class FooterComponent implements OnInit {
  rowCount: string = '';
  procedure: string = '';
  currentOwner: string = '';

  constructor(private tabService: TabDataService) {}

  ngOnInit(): void {
    this.tabService.getCurrentTab().subscribe((tab) => {
      if (tab) {
        if (tab.isLoading) {
          return;
        }
        this.currentOwner = tab.owner || '';
        this.procedure = tab.procName || '';
      }
    });
  }
}
