import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ControlService } from '../../../shared/services/control.service';
import { IControlBase } from '../../../shared/interfaces';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html',
  styleUrls: ['dynamic-form.component.less'],
})
export class DynamicFormComponent implements OnInit {
  @Input() controls: IControlBase[] | null = [];
  @Output() Submit = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private controlService: ControlService) {}

  ngOnInit() {
    console.log('controls:', this.controls);
    this.form = this.controlService.toFormGroup(
      this.controls as IControlBase[]
    );
  }

  onSubmit() {
    console.log('form:', this.form);
    this.Submit.emit(this.form.getRawValue());
  }
}
