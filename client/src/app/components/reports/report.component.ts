import { Component, Input, OnInit } from '@angular/core';
import { ITabData, TypeReport } from '../../shared/interfaces';
import { DataServerService } from '../../shared/services/data-server.service';
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

  constructor(
    private dataService: DataServerService,
    private tabService: TabDataService
  ) {}

  ngOnInit(): void {
    console.log(this.tabData);

    if (!this.tabData.isLoading) {
      this.reportType = this.tabData.reportType || TypeReport.Table;
      //     this.tabData.isLoading = true;
      //     //this.tabService.update(this.tabData)
      //     if (this.tabData.uid) {
      //       this.dataService
      //         .procExecute(
      //           this.tabData.procName!,
      //           this.tabData.params!,
      //           this.tabData.uid,
      //           this.tabData.docId!
      //         )
      //         .subscribe((data) => {
      //           this.tabData.isLoading = false;
      //           console.log(this.tabData.reportType);
      //
      //           console.log('report data:', data);
      //         });
      //     }
    }
  }
}
