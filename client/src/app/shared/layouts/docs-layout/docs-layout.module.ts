import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsLayoutComponent } from './docs-layout.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GridDataComponent } from '../../../components/reports/grid-data/grid-data.component';
import { PlainTextComponent } from '../../../components/reports/plain-text/plain-text.component';
import { ReportComponent } from '../../../components/reports/report.component';
import { TableComponent } from '../../../components/reports/table/table.component';
import { AgGridModule } from 'ag-grid-angular';
import { UiFormModule } from '../../../components/form/ui-form.module';
import { ReplaceSpacePipe } from '../../pipes/replace-space.pipe';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { ContextMenuComponent } from '../../../components/reports/context-menu/context-menu.component';
import { TwoDataGridComponent } from '../../../components/reports/two-data-grid/two-data-grid.component';
import { ErrorTabComponent } from '../../../components/reports/error-tab/error-tab.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzResizableModule } from 'ng-zorro-antd/resizable';
import { OneDataGridComponent } from '../../../components/reports/one-data-grid/one-data-grid.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { GridLoadingComponent } from '../../../components/reports/grid-data/grid-loading.component';
import { GridNoRowsComponent } from '../../../components/reports/grid-data/grid-no-rows.component';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@NgModule({
  declarations: [
    GridNoRowsComponent,
    GridLoadingComponent,
    OneDataGridComponent,
    ErrorTabComponent,
    TwoDataGridComponent,
    ContextMenuComponent,
    TableComponent,
    DocsLayoutComponent,
    GridDataComponent,
    PlainTextComponent,
    ReportComponent,
    ReplaceSpacePipe,
  ],
  imports: [
    CommonModule,
    NzTabsModule,
    NzIconModule,
    AgGridModule,
    UiFormModule,
    NzDropDownModule,
    NzLayoutModule,
    NzResizableModule,
    NzSpinModule,
    NzEmptyModule,
  ],
})
export class DocsLayoutModule {}
