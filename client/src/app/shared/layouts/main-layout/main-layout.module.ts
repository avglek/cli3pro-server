import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout.component';
import { SidebarModule } from 'ng-sidebar';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { BurgerButtonComponent } from '../../ui/burger-button/burger-button.component';

@NgModule({
  declarations: [MainLayoutComponent, BurgerButtonComponent],
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    SidebarModule.forRoot(),
  ],
})
export class MainLayoutModule {}
