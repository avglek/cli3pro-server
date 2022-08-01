import { Component, Input, OnInit } from '@angular/core';
import {
  IClobData,
  IProcParam,
  ITabData,
  TypeOut,
} from '../../../shared/interfaces';
import { DataServerService } from '../../../shared/services/data-server.service';

@Component({
  selector: 'app-plain-text',
  templateUrl: './plain-text.component.html',
  styleUrls: ['./plain-text.component.less'],
})
export class PlainTextComponent implements OnInit {
  @Input() tabData!: ITabData;
  procParams: IProcParam[] = [];
  text!: string[];

  constructor(private dataService: DataServerService) {}

  ngOnInit(): void {
    this.tabData.isLoading = true;
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
}
