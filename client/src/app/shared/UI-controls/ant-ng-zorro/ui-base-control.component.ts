import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-base-control',
  template: ``,
  styles: [``],
})
export class UiBaseControlComponent implements OnInit {
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
  @Input() defaultValue = '';
  @Input() disabled: boolean = false;

  ngOnInit(): void {
    const value = this.defaultValue || '';
    const formControl = new FormControl(value);

    if (this.formGroup) {
      this.formGroup.addControl(this.name, formControl);
    }
  }
}
