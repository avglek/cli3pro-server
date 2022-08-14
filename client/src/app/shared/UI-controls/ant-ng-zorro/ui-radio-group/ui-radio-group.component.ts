import { Component } from '@angular/core';
import { UiBaseControlComponent } from '../ui-base-control.component';

@Component({
  selector: 'app-ui-radio-group',
  template: ` <div [formGroup]="formGroup">
    <nz-radio-group [id]="name" [formControlName]="name">
      <label nz-radio nzValue="A">Option A</label>
      <label nz-radio nzValue="B">Option B</label>
      <label nz-radio nzValue="C">Option C</label>
    </nz-radio-group>
  </div>`,
  styles: [``],
})
export class UiRadioGroupComponent extends UiBaseControlComponent {}
