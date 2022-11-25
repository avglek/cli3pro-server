import { Component, Input, OnInit } from '@angular/core';
import {
  IClobData,
  IProcParam,
  ITabData,
  TypeOut,
} from '../../../shared/interfaces';
import { DataServerService } from '../../../shared/services/data-server.service';
import { TabDataService } from '../../../shared/services/tab-data.service';
import { PdfService } from '../../../shared/services/pdf.service';

@Component({
  selector: 'app-plain-text',
  templateUrl: './plain-text.component.html',
  styleUrls: ['./plain-text.component.less'],
})
export class PlainTextComponent implements OnInit {
  @Input() tabData!: ITabData;
  procParams: IProcParam[] = [];
  text!: string[];

  private vagNumber: string | undefined;

  constructor(
    private dataService: DataServerService,
    private tabService: TabDataService,
    private pdfService: PdfService
  ) {}

  ngOnInit(): void {
    this.tabData.isLoading = true;

    this.tabData.toPrint = this.printData.bind(this);
    this.tabData.toExport = this.exportData.bind(this);

    if (
      this.tabData.procName &&
      this.tabData.uid &&
      this.tabData.docId &&
      this.tabData.owner
    ) {
      this.tabData.params?.forEach((param) => {
        const procParam: IProcParam = {
          name: param.argumentName,
          inOut: param.inOut,
          value: param.value,
          position: param.position,
          type: param.dataType,
        };
        this.procParams.push(procParam);
      });

      if (this.procParams) {
        const inParam = this.procParams.find((i) => i.inOut === 'IN');
        const name = inParam?.name || '';
        if (name.toUpperCase().includes('NV')) {
          this.vagNumber = <string>inParam?.value;
        }
      }

      this.tabService.setLoadData(this.tabData.uid, true);
      this.dataService
        .procExecute(
          this.tabData.owner,
          this.tabData.procName,
          this.procParams,
          this.tabData.uid,
          this.tabData.docId
        )
        .subscribe({
          next: (data) => {
            this.tabData.isLoading = false;
            this.tabService.setLoadData(this.tabData.uid, false);
            this.tabService.setTimeQuery(this.tabData.uid);
            const params = this.tabData.params?.filter(
              (param) => param.inOut === TypeOut.Out
            );
            if (params) {
              params.forEach((key) => {
                if (key.argumentName) {
                  const clob: IClobData = <IClobData>(
                    data.data[key.argumentName]
                  );
                  this.text = clob.data.split('\r');
                }
              });
            }
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  printData() {
    this.pdfService.printPdf(this.text);
  }

  exportData(format: string) {
    if(format === 'pdf') {
      this.pdfService.downloadPdf(this.text, this.formatTitle() || 'file');
    }
  }

  formatTitle() {
    let title = this.tabData.title;
    if (this.vagNumber) {
      title = title + ' № ' + this.vagNumber;
    }

    return title;
  }
}
