import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IControlBase } from '../../../shared/interfaces';

@Component({
  selector: 'app-dynamic-control',
  templateUrl: 'dynamic-control.component.html',
  styleUrls: ['dynamic-control.component.less'],
})
export class DynamicControlComponent {
  @Input() control!: IControlBase;
  @Input() form!: FormGroup;
  get isValid() {
    return this.form.controls[this.control.key].valid;
  }
}
