import { NgModule } from '@angular/core';
import {
  UiDataPickerComponent,
  UiSelectComponent,
  UiTextAreaComponent,
  UiInputTextComponent,
  UiBaseControlComponent,
} from '../../shared/UI-controls';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiFormComponent } from './ui-form.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicControlComponent } from './dynamic-control/dynamic-control.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  declarations: [
    DynamicFormComponent,
    DynamicControlComponent,
    UiSelectComponent,
    UiDataPickerComponent,
    UiInputTextComponent,
    UiFormComponent,
    UiTextAreaComponent,
    UiBaseControlComponent,
  ],
  imports: [
    NzButtonModule,
    NzFormModule,
    NzDatePickerModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
    CommonModule,
    NzSpinModule,
  ],
  exports: [UiFormComponent],
})
export class UiFormModule {}