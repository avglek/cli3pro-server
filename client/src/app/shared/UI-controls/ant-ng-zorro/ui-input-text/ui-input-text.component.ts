import { Component} from '@angular/core';
import { UiBaseControlComponent } from '../ui-base-control.component';

@Component({
  selector: 'app-ui-text-input',
  template: ` <div [formGroup]="formGroup">
    <input nz-input [id]="name" [formControlName]="name" placeholder="name" />
  </div>`,
  styles: [``],
})
export class UiInputTextComponent extends UiBaseControlComponent {}
