import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base-control',
  template: ``,
  styles: [``],
})
export class UiBaseControlComponent implements OnInit {
  @Input() name!: string;
  @Input() formGroup!: FormGroup;
  @Input() defaultValue = '';

  ngOnInit(): void {
    if (this.formGroup) {
      this.formGroup.addControl(this.name, new FormControl(this.defaultValue));
    }
  }
}
