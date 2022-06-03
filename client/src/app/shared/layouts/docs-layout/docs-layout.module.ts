import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsLayoutComponent } from './docs-layout.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GridDataComponent } from '../../../components/grid-data/grid-data.component';
import { FormComponent } from '../../../components/form/form.component';
import { PlainTextComponent } from '../../../components/plain-text/plain-text.component';

@NgModule({
  declarations: [DocsLayoutComponent, GridDataComponent, FormComponent, PlainTextComponent],
  imports: [CommonModule, NzTabsModule, NzIconModule],
})
export class DocsLayoutModule {}
