import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsLayoutComponent } from './docs-layout.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GridDataComponent } from '../../../components/reports/grid-data/grid-data.component';
import { FormComponent } from '../../../components/form/form.component';
import { PlainTextComponent } from '../../../components/reports/plain-text/plain-text.component';
import { ReportComponent } from '../../../components/reports/report.component';
import { TableComponent } from '../../../components/reports/table/table.component';
import { AgGridModule } from 'ag-grid-angular';
import { UiDataPickerComponent, UiSelectComponent } from '../../UI-controls';

@NgModule({
  declarations: [
    TableComponent,
    DocsLayoutComponent,
    GridDataComponent,
    FormComponent,
    PlainTextComponent,
    ReportComponent,
    UiSelectComponent,
    UiDataPickerComponent,
  ],
  imports: [CommonModule, NzTabsModule, NzIconModule, AgGridModule],
})
export class DocsLayoutModule {}
