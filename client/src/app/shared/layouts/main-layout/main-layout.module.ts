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
import { PersonalAreaComponent } from '../../../pages/personal-area/personal-area.component';
import { FormsModule } from '@angular/forms';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SelectSchemaComponent } from '../../../pages/personal-area/select-schema/select-schema.component';
import { UploadOwnListComponent } from '../../../pages/personal-area/upload-own-list/upload-own-list.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { MatIconModule } from '@angular/material/icon';
import { DocsLayoutModule } from '../docs-layout/docs-layout.module';

@NgModule({
  declarations: [
    MainLayoutComponent,
    TreeComponent,
    FooterComponent,
    HomePageComponent,
    PersonalAreaComponent,
    SelectSchemaComponent,
    UploadOwnListComponent,
  ],
  imports: [
    DocsLayoutModule,
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    SidebarModule.forRoot(),
    ToolBoxModule,
    NzToolTipModule,
    NzIconModule,
    AppRoutingModule,
    //NzSpinModule,
    //NzSelectModule,
    FormsModule,
    NzUploadModule,
    NzButtonModule,
    NzDividerModule,
    MatIconModule,
  ],
  exports: [],
})
export class MainLayoutModule {}
