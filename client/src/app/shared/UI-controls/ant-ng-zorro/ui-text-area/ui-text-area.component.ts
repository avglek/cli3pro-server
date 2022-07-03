import { Component } from '@angular/core';
import { UiBaseControlComponent } from '../ui-base-control.component';

@Component({
  selector: 'app-ui-text-area',
  template: `
    <div [formGroup]="formGroup">
      <textarea
        nz-input
        placeholder="Autosize height with minimum and maximum number of lines"
        [nzAutosize]="{ minRows: 3, maxRows: 7 }"
        [formControlName]="name"
        (change)="onChange()"
      ></textarea>
    </div>
  `,
})
export class UiTextAreaComponent extends UiBaseControlComponent {
  override ngOnInit() {
    super.ngOnInit();
  }

  onChange() {
    let value = <string>this.formGroup.get(this.name)?.value;
    if (value) {
      value = value.split('\n').join(';').slice(0, -1);
    }
    this.formGroup.setValue({ [this.name]: value });
  }
}
