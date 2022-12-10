import { Component, OnInit } from '@angular/core';
import { UiBaseControlComponent } from '../ui-base-control.component';

@Component({
  selector: 'app-ui-number-input',
  template: ` <div [formGroup]="formGroup">
    <nz-input-number
      [id]="name"
      [formControlName]="name"
      [nzStep]="1"
    ></nz-input-number>
  </div>`,
  styles: [``],
})
export class UiNumberInputComponent
  extends UiBaseControlComponent
  implements OnInit
{
  override ngOnInit() {
    super.ngOnInit();
    this.formGroup.controls[this.name].setValue(this.defaultValue);
  }
}
