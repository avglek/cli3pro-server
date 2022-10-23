import { Component, Input, OnInit } from '@angular/core';
import { ITabData, TypeReport } from '../../shared/interfaces';

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

  ngOnInit(): void {
    if (!this.tabData.isLoading) {
      console.log('report:', this.tabData);
      this.reportType = this.tabData.reportType || TypeReport.Table;
      this.isEdit = this.tabData.isEdit || false;
    }
  }
}
