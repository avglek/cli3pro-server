import { Component, OnInit } from '@angular/core';
import { UiBaseControlComponent } from '../ui-base-control.component';

@Component({
  selector: 'app-ui-text-input',
  template: ` <div [formGroup]="formGroup">
    <input
      nz-input
      [id]="name"
      [formControlName]="name"
      placeholder="name"
      [ngClass]="disabled ? 'input-disable' : ''"
    />
  </div>`,
  styles: [
    `
      .input-disable {
        background: #e7e7e7;
        pointer-events: none;
        color: #5f5f5f;
      }
    `,
  ],
})
export class UiInputTextComponent
  extends UiBaseControlComponent
  implements OnInit
{
  override ngOnInit() {
    super.ngOnInit();
    this.formGroup.controls[this.name].setValue(this.defaultValue);
  }
}
