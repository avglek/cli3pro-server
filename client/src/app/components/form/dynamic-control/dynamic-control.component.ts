import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IControlBase } from '../../../shared/interfaces';

@Component({
  selector: 'app-dynamic-control',
  templateUrl: 'dynamic-control.component.html',
  styleUrls: ['dynamic-control.component.less'],
})
export class DynamicControlComponent implements OnInit {
  @Input() control!: IControlBase;
  @Input() form!: FormGroup;

  ngOnInit() {}

  get isValid() {
    if (this.form.controls[this.control.key])
      return this.form.controls[this.control.key].valid;
    else return false;
  }
}
