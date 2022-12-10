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
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { DateFilterComponent } from '../../../components/reports/filters';
import { FormsModule } from '@angular/forms';
import { DateFloatingFilterComponent } from '../../../components/reports/filters';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { GridEditDataComponent } from '../../../components/reports/grid-edit-data/grid-edit-data.component';
import { PortalModule } from '@angular/cdk/portal';
import { MatIconModule } from '@angular/material/icon';
import { UiDividerComponent } from '../../UI-controls';
import { UiCellCheckRenderComponent } from '../../../components/reports/grid-edit-data/custom-cell';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { UiCellCheckEditComponent } from '../../../components/reports/grid-edit-data/custom-cell';
import { UiCellSelectRenderComponent } from '../../../components/reports/grid-edit-data/custom-cell/ui-cell-select/ui-cell-select-render.component';
import { UiCellSimpleSelectRenderComponent } from '../../../components/reports/grid-edit-data/custom-cell/ui-cell-simple-select/ui-cell-simple-select-render.component';
import { UiCellSelectEditComponent } from '../../../components/reports/grid-edit-data/custom-cell/ui-cell-select/ui-cell-select-edit.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { UiCellSimpleSelectEditComponent } from '../../../components/reports/grid-edit-data/custom-cell/ui-cell-simple-select/ui-cell-simple-select-edit.component';
import { UiCellInputRenderComponent } from '../../../components/reports/grid-edit-data/custom-cell/ui-cell-input/ui-cell-input-render.component';
import { ExportDialogComponent } from '../../../components/dialogs/export-dialog/export-dialog.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDividerModule } from 'ng-zorro-antd/divider';

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
    DateFilterComponent,
    DateFloatingFilterComponent,
    GridEditDataComponent,
    UiDividerComponent,
    UiCellCheckRenderComponent,
    UiCellCheckEditComponent,
    UiCellSelectRenderComponent,
    UiCellSimpleSelectRenderComponent,
    UiCellSelectEditComponent,
    UiCellSimpleSelectEditComponent,
    UiCellInputRenderComponent,
    ExportDialogComponent,
  ],
  imports: [
    CommonModule,
    NzInputModule,
    NzTabsModule,
    NzIconModule,
    NzCheckboxModule,
    AgGridModule,
    UiFormModule,
    NzDropDownModule,
    NzLayoutModule,
    NzResizableModule,
    NzSpinModule,
    NzEmptyModule,
    NzRadioModule,
    FormsModule,
    NzDatePickerModule,
    PortalModule,
    MatIconModule,
    NzSelectModule,
    NzButtonModule,
    NzDividerModule,
  ],
  exports: [UiDividerComponent, NzSelectModule, NzSpinModule],
})
export class DocsLayoutModule {}
