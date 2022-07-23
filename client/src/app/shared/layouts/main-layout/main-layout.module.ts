import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout.component';
import { SidebarModule } from 'ng-sidebar';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ToolBoxModule } from '../../../components/tool-box/tool-box.module';
import { TreeComponent } from '../../../components/tree/tree.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AppRoutingModule } from '../../../app-routing.module';
import { HomePageComponent } from '../../../pages/home-page/home-page.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  declarations: [
    MainLayoutComponent,
    TreeComponent,
    FooterComponent,
    HomePageComponent,
  ],
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    SidebarModule.forRoot(),
    ToolBoxModule,
    NzToolTipModule,
    NzIconModule,
    AppRoutingModule,
    NzSpinModule,
  ],
  exports: [],
})
export class MainLayoutModule {}
