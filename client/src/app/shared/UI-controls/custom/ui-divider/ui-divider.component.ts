import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ui-divider',
  template: `<span class="divider">|</span>`,
  styleUrls: ['./ui-divider.component.less'],
})
export class UiDividerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
