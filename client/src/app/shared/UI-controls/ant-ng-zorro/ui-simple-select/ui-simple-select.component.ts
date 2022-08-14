import { Component, Input } from '@angular/core';
import { UiBaseControlComponent } from '../ui-base-control.component';
import { IDescParam } from '../../../interfaces';
import { Options } from '../ui-select/ui-select.component';

@Component({
  selector: 'app-ui-simple-select',
  template: `
    <div [formGroup]="formGroup">
      <nz-select
        nzAllowClear
        nzShowSearch
        nzServerSearch
        nzPlaceHolder="input search text"
        [formControlName]="name"
        [nzOptionOverflowSize]="5"
      >
        <nz-option
          *ngFor="let o of controlOptions"
          [nzValue]="o.key"
          [nzLabel]="o.value"
        ></nz-option>
      </nz-select>
    </div>
    \`
  `,
  styles: [],
})
export class UiSimpleSelectComponent extends UiBaseControlComponent {
  @Input() options!: IDescParam | undefined;
  @Input() isLoading: boolean = false;

  controlOptions: Options[] = [];

  override ngOnInit() {
    super.ngOnInit();
  }
}
