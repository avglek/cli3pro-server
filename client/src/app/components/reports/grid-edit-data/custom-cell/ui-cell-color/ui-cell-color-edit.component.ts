import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';
import { ColorEvent } from 'ngx-color';
import { packColor, parseColor } from '../../../../../shared/utils/grid-utils';

@Component({
  selector: 'ui-cell-select-edit',
  template: `
    <div *ngIf="open">
      <div class="toolbar"><button (click)="onOk()">X</button></div>
      <color-chrome
        [color]="state"
        (onChangeComplete)="changeComplete($event)"
        [disableAlpha]="true"
      ></color-chrome>
    </div>
  `,
  styles: [
    `
      .toolbar {
        display: flex;
        justify-content: flex-end;
      }
    `,
  ],
})
export class UiCellColorEditComponent implements ICellEditorAngularComp {
  open = true;
  state: string = '#000000';
  width = 20;
  params: ICellEditorParams | undefined;

  agInit(params: ICellEditorParams): void {
    this.params = params;
    this.state = parseColor(params.value);
    console.log(this.state);
  }

  getValue(): any {
    return packColor(this.state);
  }

  changeComplete($event: ColorEvent) {
    console.log('color:', $event.color.hex);
    this.state = $event.color.hex;
    // const c = packColor(this.state);
    // if (this.params) {
    //   console.log(this.state, c);
    //   this.params.parseValue(c);
    // }
  }

  isPopup(): boolean {
    return true;
  }
  getPopupPosition(): string {
    return 'under';
  }
  onOk() {
    this.open = false;
    this.params?.stopEditing();
  }
}
