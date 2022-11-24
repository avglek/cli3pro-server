import { Component, Input, OnInit } from '@angular/core';
import { ITabData, TypeReport } from '../../shared/interfaces';
import { TabDataService } from '../../shared/services/tab-data.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.less'],
})
export class ReportComponent implements OnInit {
  @Input() tabData!: ITabData;

  reportType: TypeReport = TypeReport.Table;
  types = TypeReport;
  isEdit: boolean = false;

  constructor(private tabService: TabDataService) {}

  ngOnInit(): void {
    if (!this.tabData.isLoading) {
      this.tabService.setTimeQuery(this.tabData.uid);
      this.reportType = this.tabData.reportType || TypeReport.Table;
      this.isEdit = this.tabData.isEdit || false;
    }
  }
}
