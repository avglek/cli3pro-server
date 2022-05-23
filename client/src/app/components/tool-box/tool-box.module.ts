import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolBoxComponent } from './tool-box.component';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [ToolBoxComponent],
  exports: [ToolBoxComponent],
  imports: [CommonModule, NzIconModule],
})
export class ToolBoxModule {}
