import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolBoxComponent } from './tool-box.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@NgModule({
  declarations: [ToolBoxComponent],
  exports: [ToolBoxComponent],
  imports: [
    CommonModule,
    NzIconModule,
    NzButtonModule,
    NzDividerModule,
    NzSpaceModule,
  ],
})
export class ToolBoxModule {}
