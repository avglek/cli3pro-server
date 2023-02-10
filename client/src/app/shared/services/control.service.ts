import { Injectable } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IControlBase } from '../interfaces';

@Injectable()
export class ControlService {
  constructor() {}

  toFormGroup(controls: IControlBase[]) {
    const group: any = {};

    controls.forEach((control) => {
      group[control.key] = control.required
        ? new UntypedFormControl(control.value || '', Validators.required)
        : new UntypedFormControl(control.value || '');
    });

    return new UntypedFormGroup(group);
  }
}
