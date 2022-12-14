import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ControlType,
  IControlBase,
  IDescParam,
  ITabData,
} from '../../shared/interfaces';
import { ControlService } from '../../shared/services/control.service';
import dayjs from 'dayjs';
import { DataServerService } from '../../shared/services/data-server.service';
import { parseTemplate } from '../../shared/utils/str-utils';
import { paramsToObject } from '../../shared/utils/data-utils';

@Component({
  selector: 'app-form',
  templateUrl: './ui-form.component.html',
  styleUrls: ['./ui-form.component.less'],
  providers: [ControlService],
})
export class UiFormComponent implements OnInit, OnDestroy {
  @Input() tabData!: ITabData;

  data!: IControlBase[];
  title!: string;
  isLoading: boolean = false;

  constructor(private dataService: DataServerService) {}

  ngOnInit(): void {
    this.title = this.tabData.title ? this.tabData.title : '';
    const params = this.tabData.params?.filter((param) => param.inOut === 'IN');
    if (params) {
      const result: IControlBase[] = [];
      params.forEach((param, index) => {
        if (
          param.argumentName &&
          (param.controlType || param.controlType === 0)
        ) {
          const item: IControlBase = {
            key: param.argumentName,
            order: index,
            controlType: ControlType[param.controlType],
            controlNumber: param.controlType,
            defaultValue: param.value ? param.value : param.defaultValue,
            disabled: !!param.value,
            label: param.displayLabel
              ? param.displayLabel.replace('_', ' ').trim()
              : '',
            itemList: param.itemList
              ? param.itemList.replace('_', ' ').trim()
              : '',
          };

          if (param.controlType === 10) {
            this.isLoading = true;
            if (param.groupedFields) {
              this.dataService
                .getControls(
                  this.tabData.owner!,
                  this.tabData.docId!,
                  param.groupedFields
                )
                .subscribe((res) => {
                  if (res) {
                    item.group = res.map((p, index) => ({
                      key: p.fieldName,
                      order: index,
                      controlType: ControlType[p.controlType!],
                      controlNumber: p.controlType,
                      defaultValue: p.defaultValue,
                      options: { ...p, objectOwner: param.objectOwner },
                      label: p.displayLabel
                        ? p.displayLabel.replace('_', ' ').trim()
                        : '',
                      itemList: p.itemList
                        ? p.itemList.replace('_', ' ').trim()
                        : '',
                    }));
                  }
                  this.isLoading = false;
                });
            } else {
              this.isLoading = false;
            }
          }

          if (param.controlType === ControlType.selectBox) {
            item.options = param;
          }
          result.push(item);
        }
      });
      this.data = result;
    }
  }

  ngOnDestroy(): void {}

  onSubmit($event: any): void {
    this.tabData.params?.map((param) => {
      if (param.inOut === 'IN') {
        if (param.argumentName) {
          param.value = this.valueAdapter($event[param.argumentName], param);
        }
      }
    });

    const params = paramsToObject(this.tabData.params || []);
    const title = parseTemplate(this.tabData.template, params);
    if (title) this.tabData.title = title;
    this.tabData.isForm = false;
  }

  valueAdapter(value: any, param: IDescParam): any {
    switch (param.dataType) {
      case 'DATE':
        return dayjs(value).format('MM-DD-YYYY');
      default:
        return value;
    }
  }
}
