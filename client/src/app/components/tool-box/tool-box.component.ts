import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tool-box',
  templateUrl: './tool-box.component.html',
  styleUrls: ['./tool-box.component.less'],
})
export class ToolBoxComponent implements OnInit {
  isCollapsed: boolean = true;

  @Output() onToggle = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  toogle() {
    this.onToggle.emit();
    this.isCollapsed = !this.isCollapsed;
  }
}
