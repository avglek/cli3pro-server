import { NgModule } from '@angular/core';
import {
  UiDataPickerComponent,
  UiSelectComponent,
  UiTextAreaComponent,
  UiInputTextComponent,
  UiBaseControlComponent,
  UiNumberInputComponent,
  UiSimpleSelectComponent,
  UiRadioGroupComponent,
  UiComboComponent,
} from '../../shared/UI-controls';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiFormComponent } from './ui-form.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicControlComponent } from './dynamic-control/dynamic-control.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { DisableControlDirective } from '../../shared/directive/disable-control.directive';

@NgModule({
  declarations: [
    UiRadioGroupComponent,
    UiSimpleSelectComponent,
    DynamicFormComponent,
    DynamicControlComponent,
    UiSelectComponent,
    UiDataPickerComponent,
    UiInputTextComponent,
    UiFormComponent,
    UiTextAreaComponent,
    UiBaseControlComponent,
    UiNumberInputComponent,
    UiComboComponent,
    DisableControlDirective,
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
    NzInputNumberModule,
    NzRadioModule,
    FormsModule,
  ],
  exports: [UiFormComponent],
})
export class UiFormModule {}
