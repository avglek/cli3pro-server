import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup} from '@angular/forms';

@Component({
  selector: 'app-base-control',
  template: ``,
  styles: [``],
})
export class UiBaseControlComponent implements OnInit {
  @Input() name!: string;
  @Input() formGroup!: UntypedFormGroup;
  @Input() defaultValue = '';
  @Input() disabled: boolean = false;

  ngOnInit(): void {
    const value = this.defaultValue || '';
    const formControl = new UntypedFormControl(value);

    if (this.formGroup) {
      this.formGroup.addControl(this.name, formControl);
    }
  }
}
