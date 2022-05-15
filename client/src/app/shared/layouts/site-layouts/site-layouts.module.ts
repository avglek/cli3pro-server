import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { HelloPageComponent } from '../../../pages/hello-page/hello-page.component';
import { OverviewPageComponent } from '../../../pages/overview-page/overview-page.component';
import { WelcomeComponent } from '../../../pages/welcome/welcome.component';
import { SiteLayoutsComponent } from './site-layouts.component';
import { IconsProviderModule } from '../../../icons-provider.module';
import { AppRoutingModule } from '../../../app-routing.module';
import { TreeComponent } from '../../../components/tree/tree.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [
    SiteLayoutsComponent,
    HelloPageComponent,
    OverviewPageComponent,
    WelcomeComponent,
    TreeComponent,
  ],
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    IconsProviderModule,
    AppRoutingModule,
    NzToolTipModule,
  ],
})
export class SiteLayoutsModule {}
