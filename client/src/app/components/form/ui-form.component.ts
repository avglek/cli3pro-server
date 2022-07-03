import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlType, IControlBase, ITabData } from '../../shared/interfaces';
import { ControlService } from '../../shared/services/control.service';

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

  ngOnInit(): void {
    console.log('tab data:', this.tabData);
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
            label: param.displayLabel ? param.displayLabel : '',
          };
          if (param.controlType === ControlType.selectBox) {
            item.options = param;
          }
          result.push(item);
        }
      });
      this.data = result;
      console.log('out data:', this.data);
    }
  }

  ngOnDestroy(): void {}

  onSubmit($event: any): void {
    console.log('submit:', $event);
    console.log('tab data:', this.tabData);

    this.tabData.params?.map((param) => {
      if (param.inOut === 'IN') {
        if (param.argumentName) {
          console.log(
            'p:',
            param.argumentName,
            ' v:',
            $event[param.argumentName]
          );
          param.value = $event[param.argumentName];
        }
      }
    });
    this.tabData.isForm = false;
  }
}
