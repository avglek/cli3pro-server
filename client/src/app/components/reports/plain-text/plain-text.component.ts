import { Component, Input, OnInit } from '@angular/core';
import {
  IClobData,
  IProcParam,
  ITabData,
  TypeOut,
} from '../../../shared/interfaces';
import { DataServerService } from '../../../shared/services/data-server.service';
import { TabDataService } from '../../../shared/services/tab-data.service';

@Component({
  selector: 'app-plain-text',
  templateUrl: './plain-text.component.html',
  styleUrls: ['./plain-text.component.less'],
})
export class PlainTextComponent implements OnInit {
  @Input() tabData!: ITabData;
  procParams: IProcParam[] = [];
  text!: string[];

  constructor(
    private dataService: DataServerService,
    private tabService: TabDataService
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
    console.log('print:', this.text);
  }

  exportData(format: string) {
    console.log('export:', format, this.text);
  }
}
