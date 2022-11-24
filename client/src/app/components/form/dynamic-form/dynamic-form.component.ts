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
    this.form = this.controlService.toFormGroup(
      this.controls as IControlBase[]
    );
  }

  onSubmit() {
    this.Submit.emit(this.form.getRawValue());
  }
}
