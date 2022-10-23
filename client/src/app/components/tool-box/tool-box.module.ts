import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolBoxComponent } from './tool-box.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { MatIconModule } from '@angular/material/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { DocsLayoutModule } from '../../shared/layouts/docs-layout/docs-layout.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [ToolBoxComponent],
  exports: [ToolBoxComponent],
  imports: [
    CommonModule,
    NzIconModule,
    NzButtonModule,
    NzDividerModule,
    NzSpaceModule,
    MatIconModule,
    NzDropDownModule,
    DocsLayoutModule,
    NzToolTipModule,
  ],
})
export class ToolBoxModule {}
