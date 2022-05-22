import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout.component';
import { SidebarModule } from 'ng-sidebar';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ToolBoxModule } from '../../../components/tool-box/tool-box.module';
import { TreeComponent } from '../../../components/tree/tree.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MainLayoutComponent, TreeComponent, FooterComponent],
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    SidebarModule.forRoot(),
    ToolBoxModule,
    RouterModule,
  ],
})
export class MainLayoutModule {}
