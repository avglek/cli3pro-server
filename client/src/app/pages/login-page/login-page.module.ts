import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    NzInputModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzSelectModule,
    FormsModule,
    NzFormModule,
    NzIconModule,
  ],
})
export class LoginPageModule {}
