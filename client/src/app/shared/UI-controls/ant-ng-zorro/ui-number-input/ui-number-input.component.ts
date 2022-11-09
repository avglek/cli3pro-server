import { Component, Input, OnInit } from '@angular/core';
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
  //  @Input() override defaultValue!: string;

  override ngOnInit() {
    super.ngOnInit();
    console.log('default:', this.defaultValue);
    this.formGroup.controls[this.name].setValue(this.defaultValue);
  }
}
